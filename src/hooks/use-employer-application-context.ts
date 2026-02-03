import { useContext } from "react";
import { EmployerApplicationContext } from "@/contexts/employer-application-context";

export function useEmployerApplicationContext() {
  const context = useContext(EmployerApplicationContext);
  if (context === undefined) {
    throw new Error(
      "useEmployerApplicationContext must be used within an EmployerApplicationProvider"
    );
  }
  return context;
}


