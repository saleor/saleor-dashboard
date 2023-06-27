import { useFeatureFlagContext } from "./context";

export const useAllFlags = () => {
  const context = useFeatureFlagContext();

  return context;
};
