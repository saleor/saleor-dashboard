import { FilterAPIProvider } from "../FilterAPIProvider";

export const useCustomerAPIProvider = (): FilterAPIProvider => {
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
