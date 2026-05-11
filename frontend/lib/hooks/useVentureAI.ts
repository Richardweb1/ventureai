"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import VentureAI from "../contracts/ventureai";
import { getContractAddress, getStudioUrl } from "../genlayer/client";
import { useWallet } from "../genlayer/wallet";
import { success, error, configError } from "../utils/toast";
import type { IdeaEntry } from "../contracts/types";

export function useVentureAIContract(): VentureAI | null {
  const { address } = useWallet();
  const contractAddress = getContractAddress();
  const studioUrl = getStudioUrl();

  const contract = useMemo(() => {
    if (!contractAddress) {
      configError(
        "Setup Required",
        "Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env file.",
        {
          label: "Setup Guide",
          onClick: () => window.open("/docs/setup", "_blank")
        }
      );
      return null;
    }
    return new VentureAI(contractAddress, address, studioUrl);
  }, [contractAddress, address, studioUrl]);

  return contract;
}

export function useIdeas() {
  const contract = useVentureAIContract();

  return useQuery<IdeaEntry[], Error>({
    queryKey: ["ideas"],
    queryFn: () => {
      if (!contract) return Promise.resolve([]);
      return contract.getIdeas();
    },
    refetchOnWindowFocus: true,
    staleTime: 2000,
    enabled: !!contract,
  });
}

export function useAnalyzeIdea() {
  const contract = useVentureAIContract();
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      industry,
      title,
      description,
    }: {
      industry: string;
      title: string;
      description: string;
    }) => {
      if (!contract) throw new Error("Contract not configured.");
      if (!address) throw new Error("Wallet not connected. Please connect your wallet.");
      setIsAnalyzing(true);
      return contract.analyzeIdea(industry, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      setIsAnalyzing(false);
      success("Idea analyzed successfully!", {
        description: "Your business idea has been analyzed and stored on-chain."
      });
    },
    onError: (err: any) => {
      console.error("Error analyzing idea:", err);
      setIsAnalyzing(false);
      error("Failed to analyze idea", {
        description: err?.message || "Please try again."
      });
    },
  });

  return {
    ...mutation,
    isAnalyzing,
    analyzeIdea: mutation.mutate,
    analyzeIdeaAsync: mutation.mutateAsync,
  };
}
