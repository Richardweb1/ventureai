"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { IdeasTable } from "@/components/IdeasTable";
import { SubmitIdeaModal } from "@/components/SubmitIdeaModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Analyzing notification */}
      {isAnalyzing && (
        <div className="fixed bottom-6 right-6 z-[200] bg-accent text-black px-6 py-4 rounded-lg shadow-xl font-semibold flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          <div>
            <div>AI is analyzing your idea...</div>
            <div className="text-xs font-normal opacity-70">Your verdict will appear on the page shortly</div>
          </div>
        </div>
      )}

      <main className="flex-grow pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              AI-Powered Business Analysis on GenLayer
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Validate Your
              <span className="text-accent"> Business Idea</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Submit your business idea and let GenLayer's AI validators analyze it.
              Get viability scores, strengths, risks, and verdicts stored permanently on-chain.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-accent/90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-accent/20"
            >
              Analyze My Business Idea
            </button>
          </div>

          <div className="animate-slide-up">
            <IdeasTable />
          </div>

          <div className="mt-10 glass-card p-6 md:p-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-2xl font-bold mb-6">How it Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-accent font-bold text-lg">1. Submit Your Idea</div>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet and submit your business idea with industry, title, and description.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-accent font-bold text-lg">2. AI Analysis</div>
                <p className="text-sm text-muted-foreground">
                  GenLayer's AI validators independently analyze your idea for viability, strengths, and risks.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-accent font-bold text-lg">3. On-Chain Verdict</div>
                <p className="text-sm text-muted-foreground">
                  The analysis and verdict are stored permanently on-chain. Browse all analyzed ideas publicly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SubmitIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAnalyzing={() => setIsAnalyzing(true)}
        onDone={() => setIsAnalyzing(false)}
      />

      <footer className="border-t border-white/10 py-2">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="https://genlayer.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              Powered by GenLayer
            </a>
            <a href="https://studio.genlayer.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              Studio
            </a>
            <a href="https://docs.genlayer.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
