import { createContext, useContext } from "react";

interface LabelsData {
  loading: boolean;
  labels: Record<string, string>;
}

export const labelsMapsContext = createContext<{
  gifts: LabelsData;
  ruleConditionsValues: LabelsData;
} | null>(null);

export const useLabelMapsContext = () => {
  const context = useContext(labelsMapsContext);

  if (!context) {
    throw new Error("useLabelMapContext must be used within a LabelsMapProvider");
  }

  return context;
};
