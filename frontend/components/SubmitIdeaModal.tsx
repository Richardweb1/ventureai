"use client";

import { Lightbulb, Link2 } from "lucide-react";
import { useState } from "react";
import { useAnalyzeIdea } from "@/lib/hooks/useVentureAI";
import { useWallet } from "@/lib/genlayer/wallet";

const INDUSTRIES = ["Tech", "Retail", "Food", "Health", "Finance", "Other"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzing: () => void;
  onDone: () => void;
}

export function SubmitIdeaModal({ isOpen, onClose, onAnalyzing, onDone }: Props) {
  const [industry, setIndustry] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { address } = useWallet();
  const { analyzeIdeaAsync, isAnalyzing } = useAnalyzeIdea();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!industry || !title || !description) return;
  try {
    onClose();
    setIndustry("");
    setTitle("");
    setDescription("");
    onAnalyzing();
    await analyzeIdeaAsync({ industry, title, description });
    onDone();
  } catch (err) {
    console.error("Error:", err);
    onDone();
  }
};

  if (!isOpen) return null;

  return (
  <>
    {/* Analyzing notification */}
    {isAnalyzing && (
      <div className="fixed bottom-6 right-6 z-[200] bg-accent text-black px-6 py-4 rounded-lg shadow-xl font-semibold flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        <div>
          <div>AI is analyzing your idea...</div>
          <div className="text-xs font-normal opacity-70">Results will appear on the ledger shortly</div>
        </div>
      </div>
    )}

    {/* Modal */}
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => !isAnalyzing && onClose()} />
        <div className="relative z-10 w-full max-w-lg glass-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Submit Business Idea</h2>
            {!isAnalyzing && (
              <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors text-xl">✕</button>
            )}
          </div>

          {!address ? (
            <div className="text-center py-8">
              <Link2 className="mx-auto mb-4 h-10 w-10 text-accent" aria-hidden="true" />
              <p className="text-muted-foreground mb-2">Connect your wallet to submit an idea</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide text-muted-foreground">Industry *</label>
                <div className="grid grid-cols-3 gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button key={ind} type="button" onClick={() => setIndustry(ind)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${industry === ind ? "border-accent bg-accent/10 text-accent" : "border-white/10 text-muted-foreground hover:border-white/30"}`}>
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide text-muted-foreground">Idea Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI-powered laundry delivery app" maxLength={100} required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground" />
                <div className="text-right text-xs text-muted-foreground mt-1">{title.length}/100</div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wide text-muted-foreground">Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your business idea in detail..." maxLength={1000} rows={5} required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground resize-none" />
                <div className="text-right text-xs text-muted-foreground mt-1">{description.length}/1000</div>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>GenLayer AI validators analyze structured market, execution, and differentiation scores before storing the verdict on-chain.</span>
                </div>
              </div>

              <button type="submit" disabled={isAnalyzing || !industry || !title || !description}
                className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                Analyze My Idea
              </button>
            </form>
          )}
        </div>
      </div>
     )}
   </>
  );
}
