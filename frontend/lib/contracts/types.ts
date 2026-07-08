export interface IdeaEntry {
  author: string;
  industry: string;
  title: string;
  description: string;
  verdict: string;
  viability_score: number;
  market_score?: number;
  execution_score?: number;
  differentiation_score?: number;
  strengths?: string;
  risks?: string;
  summary: string;
}

export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}
