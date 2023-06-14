
import { ParsedQs, parse } from "qs"
import { UrlToken } from "./UrlToken"

export type TokenArray = (string | UrlToken | TokenArray)[]

const mapToTokens = (urlEntries: (ParsedQs | string)[]): TokenArray => 
  urlEntries.map(entry => {
    if (typeof entry === "string") return entry

    if (Array.isArray(entry)) return mapToTokens(entry)

    return UrlToken.fromUrlEntry(entry)
  }) as TokenArray


export const tokenizeUrl = (urlParams: string) => {
  const parsedUrl = Object.values(parse(urlParams)) as (ParsedQs | string)[]

  return mapToTokens(parsedUrl)
}