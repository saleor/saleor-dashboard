import { parse, ParsedQs } from "qs";

import { InitialProductStateResponse } from "../../API/initialState/product/InitialProductStateResponse";
import { FilterContainer, FilterElement } from "../../FilterElement";
import { FilterProviderType, InitialResponseType } from "../../types";
import { UrlEntry, UrlToken } from "../UrlToken";
import {
  CollectionFetchingParams,
  FetchingParams,
  FetchingParamsType,
  GiftCardsFetchingParams,
  OrderFetchingParams,
  PageFetchingParams,
  toCollectionFetchingParams,
  toFetchingParams,
  toGiftCardsFetchingParams,
  toOrderFetchingParams,
  toPageFetchingParams,
  toVouchersFetchingParams,
  VoucherFetchingParams,
} from "./fetchingParams";

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
  response: InitialResponseType,
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

  public getFetchingParams(params: FetchingParamsType, type: FilterProviderType) {
    switch (type) {
      case "order":
        return this.asFlatArray()
          .filter(token => token.isLoadable())
          .reduce<OrderFetchingParams>(toOrderFetchingParams, params as OrderFetchingParams);
      case "collection":
        return this.asFlatArray()
          .filter(token => token.isLoadable())
          .reduce<CollectionFetchingParams>(
            toCollectionFetchingParams,
            params as CollectionFetchingParams,
          );
      case "voucher":
        return this.asFlatArray()
          .filter(token => token.isLoadable())
          .reduce<VoucherFetchingParams>(toVouchersFetchingParams, params as VoucherFetchingParams);
      case "page":
        return this.asFlatArray()
          .filter(token => token.isLoadable())
          .reduce<PageFetchingParams>(toPageFetchingParams, params as PageFetchingParams);
      case "gift-cards":
        return this.asFlatArray()
          .filter(token => token.isLoadable())
          .reduce<GiftCardsFetchingParams>(
            toGiftCardsFetchingParams,
            params as GiftCardsFetchingParams,
          );
      default:
        return this.asFlatArray()
          .filter(token => token.isLoadable())
          .reduce<FetchingParams>(toFetchingParams, params as FetchingParams);
    }
  }

  public asFlatArray() {
    return flatenate(this);
  }

  public asFilterValuesFromResponse(response: InitialResponseType): FilterContainer {
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
    return this.asFilterValuesFromResponse(InitialProductStateResponse.empty());
  }
}
