import { parse, ParsedQs } from "qs";

import { InitialStateResponse } from "../../API/InitialStateResponse";
import { FilterContainer, FilterElement } from "../../FilterElement";
import { UrlEntry, UrlToken } from "../UrlToken";
import { emptyFetchingParams, FetchingParams, toFetchingParams } from "./fetchingParams";

const toFlatUrlTokens = (p: UrlToken[], c: TokenArray[number]) => {
  if (typeof c === "string") {
    return p;
  }

  if (Array.isArray(c)) {
    return p.concat(flatenate(c));
  }

  return p.concat(c);
};
const flatenate = (tokens: TokenArray): UrlToken[] =>
  tokens.reduce<UrlToken[]>(toFlatUrlTokens, []);
const mapToTokens = (urlEntries: Array<ParsedQs | string>): TokenArray =>
  urlEntries.map(entry => {
    if (typeof entry === "string") {
      return entry;
    }

    if (Array.isArray(entry)) {
      return mapToTokens(entry);
    }

    return UrlToken.fromUrlEntry(UrlEntry.fromQs(entry));
  }) as TokenArray;
const tokenizeUrl = (urlParams: string) => {
  const parsedUrl = Object.values(parse(urlParams)) as Array<ParsedQs | string>;

  return mapToTokens(parsedUrl);
};
const mapUrlTokensToFilterValues = (
  urlTokens: TokenArray,
  response: InitialStateResponse,
): FilterContainer =>
  urlTokens.map(el => {
    if (typeof el === "string") {
      return el;
    }

    if (Array.isArray(el)) {
      return mapUrlTokensToFilterValues(el, response);
    }

    return FilterElement.fromUrlToken(el, response);
  });

export class TokenArray extends Array<string | UrlToken | TokenArray> {
  constructor(url: string) {
    super(...tokenizeUrl(url));
  }

  public getFetchingParams() {
    return this.asFlatArray()
      .filter(token => token.isLoadable())
      .reduce<FetchingParams>(toFetchingParams, emptyFetchingParams);
  }

  public asFlatArray() {
    return flatenate(this);
  }

  public asFilterValuesFromResponse(response: InitialStateResponse): FilterContainer {
    return this.map(el => {
      if (typeof el === "string") {
        return el;
      }

      if (Array.isArray(el)) {
        return mapUrlTokensToFilterValues(el, response);
      }

      return FilterElement.fromUrlToken(el, response);
    }).map((element, _, container) => {
      if (FilterElement.isCompatible(element) && !element.constraint?.existIn(container)) {
        element.clearConstraint();
      }

      return element;
    });
  }

  public asFilterValueFromEmpty(): FilterContainer {
    return this.asFilterValuesFromResponse(InitialStateResponse.empty());
  }
}
