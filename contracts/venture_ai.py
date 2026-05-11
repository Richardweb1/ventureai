# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json

class VentureAI(gl.Contract):
    ideas: DynArray[str]

    def __init__(self):
        pass

    @gl.public.view
    def get_ideas(self) -> list:
        return list(self.ideas)

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

        def get_analysis() -> str:
            task = f"""You are an expert business analyst and startup advisor.

A user submitted the following business idea:

Industry: {ind}
Title: {ttl}
Description: {desc}

Analyze this business idea carefully and provide:
1. Viability assessment
2. Main strengths
3. Main risks
4. Overall verdict

Respond with ONLY this JSON format:
{{
    "viability_score": int (1-10),
    "strengths": str,
    "risks": str,
    "verdict": str (one of: "Promising", "Needs Work", "Not Viable"),
    "summary": str
}}
Nothing else. Pure JSON only. No markdown."""
            result = (
                gl.nondet.exec_prompt(task)
                .replace("```json", "")
                .replace("```", "")
            )
            print(result)
            return result

        result = gl.eq_principle.prompt_comparative(
            get_analysis,
            "The verdict and viability_score must match"
        )
        parsed = json.loads(result)

        entry = f"{str(gl.message.sender_address)}|{ind}|{ttl}|{desc}|{parsed['verdict']}|{parsed['viability_score']}|{parsed['summary']}"
        self.ideas.append(entry)