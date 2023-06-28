import * as AvailableFlags from "./availableFlags";
import { useAllFlags } from "./useAllFlags";

export const useFlagsInfo = () => {
  const allFlags = useAllFlags();

  return AvailableFlags.asFlagInfoArray(allFlags);
};
