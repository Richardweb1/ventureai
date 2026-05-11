# VentureAI

> What if an AI could tell you whether your business idea is worth pursuing — and store that verdict on blockchain forever?

That's VentureAI.

---

## The Idea Behind It

Every entrepreneur has been there. You have a business idea, you tell your friends, they say "that's great!" — but you never really know if it's actually viable.

VentureAI solves this differently. Instead of asking friends or paying a consultant, you submit your idea to GenLayer's AI validators. Multiple AI models independently analyze your idea, reach consensus, and store the verdict permanently on-chain. No human bias. No sugarcoating. Just honest AI analysis.

---

## What It Does

You submit a business idea with three things:
- **Industry** — Tech, Retail, Food, Health, Finance, or Other
- **Title** — A short name for your idea
- **Description** — Explain your idea in detail

GenLayer's AI validators then analyze it and return:
- A **verdict** — Promising, Needs Work, or Not Viable
- A **viability score** — 1 to 10
- A **summary** — honest feedback on strengths and risks

The result is stored permanently on-chain. Anyone can browse all analyzed ideas publicly.

---

## Why GenLayer?

Regular blockchains can only do math. They can't read, understand, or judge the quality of a business idea.

GenLayer changes this with **Intelligent Contracts** — smart contracts powered by AI that can understand natural language, access the internet, and make intelligent decisions through consensus.

This makes VentureAI possible. The verdict isn't decided by one AI or one person — it's decided by multiple validators that must agree. That's what makes it trustworthy.

---

## Tech Stack

- **Smart Contract** — Python (GenLayer Intelligent Contract v0.2.16)
- **Frontend** — Next.js + TypeScript + Tailwind CSS
- **Blockchain** — GenLayer Studionet
- **SDK** — genlayer-js
- **Wallet** — MetaMask

---

## Contract

- **Address:** `0x9bb2921655D785e4d7dd827534D9Dca528635E36`
- **Network:** GenLayer Studionet
- **Explorer:** [explorer-studio.genlayer.com](https://explorer-studio.genlayer.com/address/0x9bb2921655D785e4d7dd827534D9Dca528635E36)

---

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/Richardweb1/ventureai.git
cd ventureai

# Install dependencies
cd frontend
npm install

# Add your contract address
cp .env.example .env
# Edit .env and set NEXT_PUBLIC_CONTRACT_ADDRESS

# Start the app
npm run dev
```

Open `http://localhost:3000`

---

## How to Use

1. Connect your MetaMask wallet
2. Click **"Analyze My Business Idea"**
3. Select an industry
4. Enter your idea title and description
5. Click **"Analyze My Idea"**
6. Sign the transaction in MetaMask
7. Wait ~30 seconds for AI validators to reach consensus
8. Your verdict appears on the page!

---

## Live Demo

🔗 [ventureai.vercel.app](https://ventureai.vercel.app)

---

## Built On

[GenLayer](https://genlayer.com) — The first blockchain with AI-powered Intelligent Contracts.

---

