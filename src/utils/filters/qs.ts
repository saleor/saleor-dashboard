import { parse } from "qs";

const paramsToRemove = ["activeTab", "action", "sort", "asc"];

export const prepareQs = (searchQuery: string) => {
  const paresedQs = parse(
    searchQuery.startsWith("?") ? searchQuery.slice(1) : searchQuery,
  );
  const activeTab = paresedQs.activeTab;

  paramsToRemove.forEach(param => {
    delete paresedQs[param];
  });

  return {
    activeTab,
    paresedQs,
  };
};
