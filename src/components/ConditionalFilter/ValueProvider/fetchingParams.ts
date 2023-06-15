import { UrlToken } from "./UrlToken"
import { flatenate } from "./flatenate"
import { TokenArray } from "./tokenize"

interface FetchingParams {
  category: string[]
  collection: string[]
  channel: string[]
  producttype: [],
  attribute: Record<string, string[]>
}

const emptyFetchingParams: FetchingParams = {
  category: [],
  collection: [],
  channel: [],
  producttype: [],
  attribute: {}
}

const unique = <T>(array: Iterable<T>) => {
  return Array.from(new Set(array))
}

const toFetchingParams = (p: FetchingParams, c: UrlToken) => {
  if (!c.isAttribute() && !p[c.name]) {
    p[c.name] = []
  }

  if (c.isAttribute() && !p.attribute[c.name]) {
    p.attribute[c.name] = []
  }


  if (c.isAttribute()) {
    p.attribute[c.name] = unique(p.attribute[c.name].concat(c.value))

    return p
  }

  p[c.name] = unique(p[c.name].concat(c.value))

  return p
}

export const obtainFetchingParams = (tokens: TokenArray): FetchingParams => {
 return flatenate(tokens)
  .filter(token => token.isLoadable())
  .reduce<FetchingParams>(toFetchingParams, emptyFetchingParams)
}