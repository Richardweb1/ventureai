import assert from "node:assert/strict";

function parseIdeaEntry(entry) {
  try {
    const parsed = JSON.parse(entry);
    return {
      author: parsed.author || "",
      industry: parsed.industry || "",
      title: parsed.title || "",
      description: parsed.description || "",
      verdict: parsed.verdict || "",
      viability_score: Number(parsed.viability_score || 0),
      market_score: Number(parsed.market_score || 0),
      execution_score: Number(parsed.execution_score || 0),
      differentiation_score: Number(parsed.differentiation_score || 0),
      strengths: parsed.strengths || "",
      risks: parsed.risks || "",
      summary: parsed.summary || "",
    };
  } catch {
    const parts = entry.split("|");
    return {
      author: parts[0] || "",
      industry: parts[1] || "",
      title: parts[2] || "",
      description: parts[3] || "",
      verdict: parts[4] || "",
      viability_score: Number.parseInt(parts[5] || "0", 10),
      market_score: 0,
      execution_score: 0,
      differentiation_score: 0,
      strengths: "",
      risks: "",
      summary: parts[6] || "",
    };
  }
}

const structured = parseIdeaEntry(JSON.stringify({
  author: "0xabc",
  industry: "Tech",
  title: "Quiet CRM",
  description: "A calmer CRM for solo founders with guided follow-up workflows.",
  verdict: "Promising",
  viability_score: 8,
  market_score: 8,
  execution_score: 7,
  differentiation_score: 9,
  strengths: "Clear founder pain and focused workflow.",
  risks: "Crowded CRM category.",
  summary: "Worth exploring with a narrow ICP.",
}));

assert.equal(structured.verdict, "Promising");
assert.equal(structured.market_score, 8);
assert.equal(structured.risks, "Crowded CRM category.");

const legacy = parseIdeaEntry("0xabc|Food|Soup kiosk|Healthy soups near offices|Needs Work|6|Good niche, needs demand proof");

assert.equal(legacy.industry, "Food");
assert.equal(legacy.viability_score, 6);
assert.equal(legacy.summary, "Good niche, needs demand proof");

console.log("frontend parser checks passed");
