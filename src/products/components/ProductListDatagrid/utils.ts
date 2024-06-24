import { ProductFilterKeys } from "../ProductListPage";

const isNumberParam = (element: string): boolean => {
  if (element.length === 1 || element.length === 2) {
    return true;
  }

  return false;
};

const sortAscending = (a: number | undefined, b: number | undefined) => {
  if (a === undefined || b === undefined) {
    return a === b ? 0 : a ? -1 : 1;
  }

  return a - b;
};

const paramsToIndices = (key: string) => {
  // We're checking for eg. "...&10=AND..."
  if (isNumberParam(key)) {
    return parseInt(key);
  }

  const number = parseInt(key.split("[")[0]);

  if (isNaN(number)) return;

  return number;
};

const mapIndices = (keys: string[]) =>
  keys
    .map(paramsToIndices)
    .filter(el => el !== undefined)
    .sort(sortAscending);

export const getPriceClickSearchParams = (search: string): string => {
  const params = new URLSearchParams(search);

  const filtersIndices = mapIndices(Array.from(params.keys()));

  const lastFilterIndex = filtersIndices.at(-1) ?? 0;
  const hasChannelFilter = Array.from(params.keys()).find(key =>
    key.includes(ProductFilterKeys.channel),
  );

  if (!hasChannelFilter) {
    const channelFilter = `[s0.${ProductFilterKeys.channel}]`;

    if (filtersIndices.length > 0) {
      params.append(`${lastFilterIndex + 1}`, "AND");
      params.append(`${lastFilterIndex + 2}${channelFilter}`, "");
    } else {
      params.append(`0${channelFilter}`, "");
    }
  }

  return params.toString();
};
