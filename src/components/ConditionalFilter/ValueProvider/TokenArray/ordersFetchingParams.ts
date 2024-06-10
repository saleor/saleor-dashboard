import { UrlToken } from "../UrlToken";

export interface OrdersFetchingParams {
  paymentStatus: string[];
}

type FetchingParamsKeys = keyof Omit<OrdersFetchingParams, "attribute">;

export const emptyFetchingParams: OrdersFetchingParams = {
  paymentStatus: [],
};

const unique = <T>(array: Iterable<T>) => Array.from(new Set(array));

export const toFetchingParams = (p: OrdersFetchingParams, c: UrlToken) => {
  const key = c.name as FetchingParamsKeys;

  if (!c.isAttribute() && !p[key]) {
    p[key] = [];
  }

  p[key] = unique(p[key].concat(c.value));

  return p;
};
