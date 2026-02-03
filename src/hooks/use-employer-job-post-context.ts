import { useContext } from "react";
import { EmployerJobPostContext } from "@/contexts/employer-job-post-context";

export function useEmployerJobPostContext() {
  const context = useContext(EmployerJobPostContext);
  if (context === undefined) {
    throw new Error(
      "useEmployerJobPostContext must be used within an EmployerJobPostProvider"
    );
  }
  return context;
}


