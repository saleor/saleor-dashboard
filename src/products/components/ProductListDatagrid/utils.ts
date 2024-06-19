import { ProductFilterKeys } from "../ProductListPage";

export const getPriceClickSearchParams = (search: string): string => {
  const params = new URLSearchParams(search);

  const filtersIndices = Array.from(params.keys())
    .map(key => {
      if (key.length === 1 || key.length === 2) {
        return parseInt(key);
      }

      const number = parseInt(key.split("[")[0]);

      if (isNaN(number)) return;

      return number;
    })
    .filter(Boolean)
    .sort((a, b) => a - b);

  const lastFilterIndex = filtersIndices.at(-1);
  const hasChannelFilter = Array.from(params.keys()).find(key =>
    key.includes(ProductFilterKeys.channel),
  );

  if (!hasChannelFilter) {
    const channelFilter = `[s0.${ProductFilterKeys.channel}]`;

    if (filtersIndices.length > 0) {
      params.append(`${lastFilterIndex + 1}`, "AND");
      params.append(`${lastFilterIndex + 2}${channelFilter}`, "");
    } else {
      params.append(`${lastFilterIndex + 1}${channelFilter}`, "");
    }
  }

  return params.toString();
};
