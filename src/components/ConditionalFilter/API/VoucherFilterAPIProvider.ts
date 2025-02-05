import { FilterAPIProvider } from "./FilterAPIProvider";

export const useVoucherAPIProvider = (): FilterAPIProvider => {
  const fetchRightOptions = async () => {
    return [];
  };
  const fetchLeftOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchLeftOptions,
  };
};
