import { type FilterAPIProvider } from "../FilterAPIProvider";
import { emptyAttributeChoicesPage, emptyChoicesPage } from "../filterChoicesPage";

export const useDraftOrderFilterAPIProvider = (): FilterAPIProvider => {
  const fetchRightOptions = async () => {
    return emptyChoicesPage();
  };

  const fetchAttributeOptions = async () => {
    return emptyAttributeChoicesPage();
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
