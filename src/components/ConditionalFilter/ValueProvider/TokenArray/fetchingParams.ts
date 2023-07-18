import { UrlToken } from "../UrlToken";

export interface FetchingParams {
  category: string[];
  collection: string[];
  channel: string[];
  productType: string[];
  attribute: Record<string, string[]>;
}

type FetchingParamsKeys = keyof Omit<FetchingParams, "attribute">;

export const emptyFetchingParams: FetchingParams = {
  category: [],
  collection: [],
  channel: [],
  productType: [],
  attribute: {},
};

const unique = <T>(array: Iterable<T>) => Array.from(new Set(array));

export const toFetchingParams = (p: FetchingParams, c: UrlToken) => {
  const key = c.name as FetchingParamsKeys;

  if (!c.isAttribute() && !p[key]) {
    p[key] = [];
  }

  if (c.isAttribute() && !p.attribute[c.name]) {
    p.attribute[c.name] = [];
  }

  if (c.isAttribute()) {
    p.attribute[c.name] = unique(p.attribute[c.name].concat(c.value));

    return p;
  }

  p[key] = unique(p[key].concat(c.value));

  return p;
};
