import { UrlToken } from "./UrlToken"
import { TokenArray } from "./tokenize"

const toFlatUrlTokens = (p: UrlToken[], c: TokenArray[number]) => {
  if (typeof c == "string") return p

  if (Array.isArray(c)) {
    return p.concat(flatenate(c))
  }

  return p.concat(c)
}

export const flatenate = (tokens: TokenArray): UrlToken[] => {
  return tokens.reduce<UrlToken[]>(toFlatUrlTokens, [])
}