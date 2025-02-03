import { FilterAPIProvider } from "@dashboard/components/ConditionalFilter/API/FilterAPIProvider";

export const useDraftOrderFilterAPIProvider = (): FilterAPIProvider => {
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
