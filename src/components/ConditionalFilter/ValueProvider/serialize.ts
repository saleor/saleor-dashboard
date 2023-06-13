import { ParsedQs, parse } from "qs"

const CONDITIONS = [
  "is",
  "equals",
  "in",
  "between",
  "lower",
  "greater"
]

class UrlToken {
  private constructor(
    public name: string,
    public value: unknown,
    public type: string,
    public conditionKind: string
  ) {}

  public static fromUrlEntry (entry: Record<string, unknown>) {
    const [key, value] = Object.entries(entry)[0]
    const [identifier, entryName] = key.split(".")
    const [type, control] = identifier.split("")

    return new UrlToken(entryName, value, type, CONDITIONS[control])
  }

  public isStatic () {
    this.type === "s"
  }
  public isAttribute () {
    this.type === "a"
  }
}

type TokenArray = (string | UrlToken | TokenArray[])[]

const mapToTokens = (urlEntries: (ParsedQs | string)[]): TokenArray => 
  urlEntries.map(entry => {
    if (typeof entry === "string") return entry

    if (Array.isArray(entry)) return mapToTokens(entry)

    return UrlToken.fromUrlEntry(entry)
  }) as TokenArray


export const decodeUrl = (urlParams: string) => {
  const parsedUrl = Object.values(parse(urlParams)) as (ParsedQs | string)[]

  return mapToTokens(parsedUrl)
}