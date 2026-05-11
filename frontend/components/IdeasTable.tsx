"use client";

import { useIdeas } from "@/lib/hooks/useVentureAI";
import { AddressDisplay } from "./AddressDisplay";

const verdictColors: Record<string, string> = {
  "Promising": "text-green-400 bg-green-400/10 border-green-400/30",
  "Needs Work": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "Not Viable": "text-red-400 bg-red-400/10 border-red-400/30",
};

const industryColors: Record<string, string> = {
  "Tech": "text-blue-400 bg-blue-400/10 border-blue-400/30",
  "Retail": "text-purple-400 bg-purple-400/10 border-purple-400/30",
  "Food": "text-orange-400 bg-orange-400/10 border-orange-400/30",
  "Health": "text-pink-400 bg-pink-400/10 border-pink-400/30",
  "Finance": "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  "Other": "text-gray-400 bg-gray-400/10 border-gray-400/30",
};

export function IdeasTable() {
  const { data: ideas, isLoading, error, refetch } = useIdeas();

  if (isLoading) {
    return (
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Analyzed Ideas</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading ideas from blockchain...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Analyzed Ideas</h2>
          <button onClick={() => refetch()} className="text-sm text-accent hover:underline">
            Retry
          </button>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <p>Failed to load ideas. Please try again.</p>
        </div>
      </div>
    );
  }

  const totalIdeas = ideas?.length || 0;
  const promising = ideas?.filter(i => i.verdict === "Promising").length || 0;

  return (
    <div className="glass-card p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Analyzed Business Ideas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {totalIdeas} ideas analyzed · {promising} promising
          </p>
        </div>
        
      </div>

      {/* Empty State */}
      {!ideas || ideas.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-30">💡</div>
          <h3 className="text-lg font-semibold mb-2">No ideas analyzed yet</h3>
          <p className="text-muted-foreground text-sm">
            Be the first to submit a business idea for AI analysis!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-lg p-5 hover:border-accent/30 transition-all duration-200 hover:bg-white/2"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Industry Badge */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${industryColors[idea.industry] || industryColors["Other"]}`}>
                    {idea.industry}
                  </span>
                  {/* Verdict Badge */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${verdictColors[idea.verdict] || "text-gray-400 bg-gray-400/10 border-gray-400/30"}`}>
                    {idea.verdict}
                  </span>
                  
                </div>
                {/* Author */}
                <AddressDisplay address={idea.author} />
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg mb-2">{idea.title}</h3>

              {/* Summary */}
              {idea.summary && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {idea.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
