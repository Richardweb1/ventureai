import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../contracts/venture_ai.py", import.meta.url), "utf8");

assert.match(source, /py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6/, "GenLayer runtime must be pinned");
assert.match(source, /market_score/, "contract should request structured market_score");
assert.match(source, /execution_score/, "contract should request structured execution_score");
assert.match(source, /differentiation_score/, "contract should request structured differentiation_score");
assert.match(source, /run_nondet_unsafe/, "contract should use a custom GenLayer validator");
assert.match(source, /abs\(leader\["market_score"\] - validator\["market_score"\]\) > 2/, "validator should compare structured fields");
assert.match(source, /gl\.vm\.UserError/, "contract should classify user and LLM errors");
const staleScaffoldPattern = new RegExp(["foot", "ball"].join("") + "|" + ["bet", "ting"].join("") + "|" + ["od", "ds"].join(""), "i");
assert.doesNotMatch(source, staleScaffoldPattern, "contract should not contain unrelated scaffold leftovers");

console.log("contract schema checks passed");
