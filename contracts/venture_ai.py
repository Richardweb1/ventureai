# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json

VALID_VERDICTS = ["Promising", "Needs Work", "Not Viable"]

def _to_int(value) -> int:
    try:
        score = int(value)
    except Exception:
        raise gl.vm.UserError("[LLM_ERROR] score is not an integer")
    if score < 1:
        return 1
    if score > 10:
        return 10
    return score

def _parse_analysis(raw: str) -> dict:
    first = raw.find("{")
    last = raw.rfind("}")
    if first < 0 or last < first:
        raise gl.vm.UserError("[LLM_ERROR] missing JSON object")
    parsed = json.loads(raw[first:last + 1])

    viability = _to_int(parsed.get("viability_score"))
    market = _to_int(parsed.get("market_score"))
    execution = _to_int(parsed.get("execution_score"))
    differentiation = _to_int(parsed.get("differentiation_score"))
    verdict = str(parsed.get("verdict", "")).strip()

    if verdict not in VALID_VERDICTS:
        raise gl.vm.UserError("[LLM_ERROR] invalid verdict")
    expected = int(round((market + execution + differentiation) / 3))
    if abs(viability - expected) > 1:
        raise gl.vm.UserError("[LLM_ERROR] viability score inconsistent with sub-scores")

    return {
        "viability_score": viability,
        "market_score": market,
        "execution_score": execution,
        "differentiation_score": differentiation,
        "strengths": str(parsed.get("strengths", ""))[:180],
        "risks": str(parsed.get("risks", ""))[:180],
        "verdict": verdict,
        "summary": str(parsed.get("summary", ""))[:220],
    }

class VentureAI(gl.Contract):
    ideas: DynArray[str]
    analysis_count: u32

    def __init__(self):
        self.analysis_count = 0

    @gl.public.view
    def get_ideas(self) -> list:
        return list(self.ideas)

    @gl.public.view
    def get_analysis_count(self) -> int:
        return self.analysis_count

    @gl.public.write
    def analyze_idea(
        self,
        industry: str,
        title: str,
        description: str
    ) -> None:
        ind = industry
        ttl = title
        desc = description

        if len(ind) < 2 or len(ttl) < 3 or len(desc) < 40:
            raise gl.vm.UserError("[EXPECTED] Industry, title, and a detailed description are required")
        if len(desc) > 1200:
            raise gl.vm.UserError("[EXPECTED] Description must be 1200 characters or fewer")

        def get_analysis() -> dict:
            task = f"""You are an expert business analyst and startup advisor.

A user submitted the following business idea:

Industry: {ind}
Title: {ttl}
Description: {desc}

Analyze this business idea carefully and provide:
1. Market pain clarity
2. Target customer specificity
3. Differentiation
4. Execution risk
5. Monetization path
6. Overall verdict

Respond with ONLY this JSON format:
{{
    "viability_score": int (1-10),
    "market_score": int (1-10),
    "execution_score": int (1-10),
    "differentiation_score": int (1-10),
    "strengths": str (max 180 chars),
    "risks": str (max 180 chars),
    "verdict": str (one of: "Promising", "Needs Work", "Not Viable"),
    "summary": str (max 220 chars)
}}
Rules:
- viability_score must be the rounded average of market_score, execution_score, and differentiation_score.
- verdict must be "Promising" only if viability_score >= 8.
- verdict must be "Needs Work" only if viability_score is 5, 6, or 7.
- verdict must be "Not Viable" only if viability_score <= 4.
- Nothing else. Pure JSON only. No markdown."""
            result = (
                gl.nondet.exec_prompt(task)
                .replace("```json", "")
                .replace("```", "")
            )
            print(result)
            return _parse_analysis(result)

        def validator_fn(leaders_res: gl.vm.Result) -> bool:
            if not isinstance(leaders_res, gl.vm.Return):
                return False

            leader = leaders_res.calldata
            validator = get_analysis()

            if leader["verdict"] != validator["verdict"]:
                return False
            if abs(leader["viability_score"] - validator["viability_score"]) > 1:
                return False
            if abs(leader["market_score"] - validator["market_score"]) > 2:
                return False
            if abs(leader["execution_score"] - validator["execution_score"]) > 2:
                return False
            if abs(leader["differentiation_score"] - validator["differentiation_score"]) > 2:
                return False
            return True

        parsed = gl.vm.run_nondet_unsafe(get_analysis, validator_fn)

        entry = {
            "author": str(gl.message.sender_address),
            "industry": ind,
            "title": ttl,
            "description": desc,
            "verdict": parsed["verdict"],
            "viability_score": parsed["viability_score"],
            "market_score": parsed["market_score"],
            "execution_score": parsed["execution_score"],
            "differentiation_score": parsed["differentiation_score"],
            "strengths": parsed["strengths"],
            "risks": parsed["risks"],
            "summary": parsed["summary"],
        }
        self.ideas.append(json.dumps(entry))
        self.analysis_count += 1
