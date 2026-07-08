# VentureAI

VentureAI is a GenLayer application that turns a business idea into a consensus-reviewed venture assessment. The frontend collects an industry, title, and detailed idea description; the Intelligent Contract asks GenLayer validators to independently score the idea, compare structured outputs, and store the accepted verdict on-chain.

## What GenLayer does here

VentureAI does not use GenLayer as a generic AI chat backend. The contract owns the authoritative state transition:

1. A user submits a business idea.
2. The leader validator produces a structured JSON assessment.
3. Validators rerun the assessment independently.
4. Consensus compares stable fields:
   - `verdict`
   - `viability_score`
   - `market_score`
   - `execution_score`
   - `differentiation_score`
5. Only an agreed result is written to on-chain storage.

The frontend only handles wallet connection, form UX, and displaying accepted entries.

## Assessment output

Each accepted idea stores:

- submitter address
- industry, title, and description
- verdict: `Promising`, `Needs Work`, or `Not Viable`
- overall viability score from `1` to `10`
- market, execution, and differentiation sub-scores
- strengths, risks, and a short summary

## Deployment evidence

- Live app: [ventureai.vercel.app](https://ventureai.vercel.app)
- GenLayer network: StudioNet
- Contract address: [`0x9bb2921655D785e4d7dd827534D9Dca528635E36`](https://explorer-studio.genlayer.com/address/0x9bb2921655D785e4d7dd827534D9Dca528635E36)
- Contract source: [`contracts/venture_ai.py`](contracts/venture_ai.py)

If redeployed, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `frontend/.env` and record the new transaction hash here.

## Versions

- GenLayer SDK: `genlayer-js@0.18.3`
- GenVM runner pinned in contract:
  `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`
- Frontend: Next.js + TypeScript + Tailwind CSS
- Wallet: MetaMask

The contract intentionally avoids `py-genlayer:test`, `py-genlayer:latest`, or unpinned runtime aliases.

## Run locally

```bash
git clone https://github.com/Richardweb1/ventureai.git
cd ventureai
npm install
cd frontend
cp .env.example .env
```

Set the contract address:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x9bb2921655D785e4d7dd827534D9Dca528635E36
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Reviewer demo flow

1. Open the live app or local app.
2. Connect MetaMask.
3. Submit a detailed business idea, at least 40 characters.
4. Confirm the GenLayer transaction.
5. Wait for validator consensus.
6. Refresh or wait for the ideas list to reload.
7. Confirm the stored output shows verdict, viability score, sub-scores, strengths, risks, and summary.

## Tests and checks

Run the project checks:

```bash
npm run test
npm run build
```

Lint the Intelligent Contract with GenVM:

```bash
genvm-lint check contracts/venture_ai.py
```

The included tests verify:

- no unrelated scaffold leftovers in contract code
- pinned GenLayer runtime
- structured validator fields are present
- frontend parsing supports both new JSON entries and legacy pipe-delimited entries

## Repository hygiene

This repo has been cleaned of old scaffold references. Project metadata, manifest, wallet copy, and package descriptions now describe VentureAI only.
