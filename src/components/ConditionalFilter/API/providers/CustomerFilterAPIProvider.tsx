import { FilterAPIProvider } from "../FilterAPIProvider";

export const useCustomerAPIProvider = (): FilterAPIProvider => {
  const fetchRightOptions = async () => {
    return [];
  };

  const fetchAttributeOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
