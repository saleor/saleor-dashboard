import { FilterAPIProvider } from "@dashboard/components/ConditionalFilter/API/FilterAPIProvider";

export const useDiscountFilterAPIProvider = (): FilterAPIProvider => {
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
