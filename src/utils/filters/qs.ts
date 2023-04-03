import { parse } from "qs";

const paramsToRemove = ["activeTab", "action", "sort", "asc"];

export const prepareQs = (searchQueary: string) => {
  const paresedQs = parse(
    searchQueary.startsWith("?") ? searchQueary.slice(1) : searchQueary,
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
