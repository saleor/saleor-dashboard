const paramsToRemove = ["activeTab", "action", "sort", "asc"];

export const prepareQs = (searchQueary: string): URLSearchParams => {
  const qs = new URLSearchParams(searchQueary);

  paramsToRemove.forEach(param => {
    qs.delete(param);
  });

  return qs;
};
