// @ts-strict-ignore
import { UrlToken } from "../UrlToken";

export interface FetchingParams {
  category: string[];
  collection: string[];
  channel: string[];
  producttype: [];
  attribute: Record<string, string[]>;
}

export const emptyFetchingParams: FetchingParams = {
  category: [],
  collection: [],
  channel: [],
  producttype: [],
  attribute: {},
};

const unique = <T>(array: Iterable<T>) => Array.from(new Set(array));

export const toFetchingParams = (p: FetchingParams, c: UrlToken) => {
  if (!c.isAttribute() && !p[c.name]) {
    p[c.name] = [];
  }

  if (c.isAttribute() && !p.attribute[c.name]) {
    p.attribute[c.name] = [];
  }

  if (c.isAttribute()) {
    p.attribute[c.name] = unique(p.attribute[c.name].concat(c.value));

    return p;
  }

  p[c.name] = unique(p[c.name].concat(c.value));

  return p;
};
