import { useContext } from "react";
import { CandidateApplicationContext } from "@/contexts/candidate-application-context";

export function useCandidateApplicationContext() {
  const context = useContext(CandidateApplicationContext);
  if (context === undefined) {
    throw new Error(
      "useCandidateApplicationContext must be used within a CandidateApplicationProvider"
    );
  }
  return context;
}

