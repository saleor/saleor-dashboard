import { parse } from "qs";

const paramsToRemove = ["activeTab", "action", "sort", "asc"];

export const prepareQs = (searchQuery: string) => {
  const parsedQs = parse(searchQuery.startsWith("?") ? searchQuery.slice(1) : searchQuery);
  const activeTab = parsedQs.activeTab;

  paramsToRemove.forEach(param => {
    delete parsedQs[param];
  });

  return {
    activeTab,
    parsedQs,
  };
};
