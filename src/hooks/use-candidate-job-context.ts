import { useContext } from "react";
import { CandidateJobContext } from "@/contexts/candidate-job-context";

export function useCandidateJobContext() {
  const context = useContext(CandidateJobContext);
  if (context === undefined) {
    throw new Error(
      "useCandidateJobContext must be used within a CandidateJobProvider"
    );
  }
  return context;
}

