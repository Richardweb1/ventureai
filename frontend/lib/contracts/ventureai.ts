import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { IdeaEntry, TransactionReceipt } from "./types";

export function parseIdeaEntry(entry: string): IdeaEntry {
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
      viability_score: parseInt(parts[5] || "0", 10),
      market_score: 0,
      execution_score: 0,
      differentiation_score: 0,
      strengths: "",
      risks: "",
      summary: parts[6] || "",
    };
  }
}

class VentureAI {
  private contractAddress: `0x${string}`;
  private client: ReturnType<typeof createClient>;

  constructor(
    contractAddress: string,
    address?: string | null,
    studioUrl?: string
  ) {
    this.contractAddress = contractAddress as `0x${string}`;

    const config: any = {
      chain: studionet,
    };

    if (address) {
      config.account = address as `0x${string}`;
    }

    if (studioUrl) {
      config.endpoint = studioUrl;
    }

    this.client = createClient(config);
  }

  updateAccount(address: string): void {
    const config: any = {
      chain: studionet,
      account: address as `0x${string}`,
    };
    this.client = createClient(config);
  }

  async getIdeas(): Promise<IdeaEntry[]> {
    try {
      const ideas: any = await this.client.readContract({
        address: this.contractAddress,
        functionName: "get_ideas",
        args: [],
      });

      if (Array.isArray(ideas)) {
        return ideas.map(parseIdeaEntry);
      }

      return [];
    } catch (error) {
      console.error("Error fetching ideas:", error);
      throw new Error("Failed to fetch ideas from contract");
    }
  }

  async analyzeIdea(
    industry: string,
    title: string,
    description: string
  ): Promise<TransactionReceipt> {
    try {
      const txHash = await this.client.writeContract({
        address: this.contractAddress,
        functionName: "analyze_idea",
        args: [industry, title, description],
        value: BigInt(0),
      });

      const receipt = await this.client.waitForTransactionReceipt({
        hash: txHash,
        status: "ACCEPTED" as any,
        retries: 24,
        interval: 5000,
      });

      return receipt as TransactionReceipt;
    } catch (error) {
      console.error("Error analyzing idea:", error);
      throw new Error("Failed to analyze idea");
    }
  }
}

export default VentureAI;
