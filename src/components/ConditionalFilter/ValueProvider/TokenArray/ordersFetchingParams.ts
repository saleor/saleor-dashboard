import { TokenType, UrlToken } from "../UrlToken";

export interface OrdersFetchingParams {
  paymentStatus: string[];
}

type FetchingParamsKeys = keyof Omit<OrdersFetchingParams, "attribute">;

export const emptyFetchingParams: OrdersFetchingParams = {
  paymentStatus: [],
};

const unique = <T>(array: Iterable<T>) => Array.from(new Set(array));
const includedInParams = (c: UrlToken) =>
  TokenType.ATTRIBUTE_DROPDOWN === c.type || TokenType.ATTRIBUTE_MULTISELECT === c.type;

export const toFetchingParams = (p: OrdersFetchingParams, c: UrlToken) => {
  const key = c.name as FetchingParamsKeys;

  if (!c.isAttribute() && !p[key]) {
    p[key] = [];
  }

  //   if (c.isAttribute() && !p.attribute[c.name]) {
  //     p.attribute[c.name] = [];
  //   }

  //   if (c.isAttribute() && includedInParams(c)) {
  //     p.attribute[c.name] = unique(p.attribute[c.name].concat(c.value));

  //     return p;
  //   }

  //   if (c.isAttribute() && !includedInParams(c)) {
  //     p.attribute[c.name] = [];

  //     return p;
  //   }

  p[key] = unique(p[key].concat(c.value));

  return p;
};
