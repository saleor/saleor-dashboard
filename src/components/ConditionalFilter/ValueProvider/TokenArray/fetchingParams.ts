import { TokenType, UrlToken } from "../UrlToken";

export interface FetchingParams {
  category: string[];
  collection: string[];
  channel: string[];
  productType: string[];
  attribute: Record<string, string[]>;
}

export interface OrderFetchingParams {
  paymentStatus: string[];
  status: string[];
  authorizeStatus: string[];
  chargeStatus: string[];
  channels: string[];
  giftCardUsage: string[];
  // isPreorder: string[];
  // isClickAndCollect: string[];
}

type FetchingParamsKeys = keyof Omit<FetchingParams, "attribute">;

export const emptyFetchingParams: FetchingParams = {
  category: [],
  collection: [],
  channel: [],
  productType: [],
  attribute: {},
};

export const emptyOrderFetchingParams: OrderFetchingParams = {
  paymentStatus: [],
  status: [],
  authorizeStatus: [],
  chargeStatus: [],
  channels: [],
  giftCardUsage: [],
  // // TODO
  // isClickAndCollect: [],
  // isPreorder: [],
};

const unique = <T>(array: Iterable<T>) => Array.from(new Set(array));
const includedInParams = (c: UrlToken) =>
  TokenType.ATTRIBUTE_DROPDOWN === c.type || TokenType.ATTRIBUTE_MULTISELECT === c.type;

export const toFetchingParams = (p: FetchingParams, c: UrlToken) => {
  const key = c.name as FetchingParamsKeys;

  if (!c.isAttribute() && !p[key]) {
    p[key] = [];
  }

  if (c.isAttribute() && !p.attribute[c.name]) {
    p.attribute[c.name] = [];
  }

  if (c.isAttribute() && includedInParams(c)) {
    p.attribute[c.name] = unique(p.attribute[c.name].concat(c.value));

    return p;
  }

  if (c.isAttribute() && !includedInParams(c)) {
    p.attribute[c.name] = [];

    return p;
  }

  p[key] = unique(p[key].concat(c.value));

  return p;
};
