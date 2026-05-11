export interface IdeaEntry {
  author: string;
  industry: string;
  title: string;
  description: string;
  verdict: string;
  viability_score: number;
  summary: string;
}

export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}
