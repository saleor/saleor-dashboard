import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { GiftCardListUrlQueryParams } from "./GiftCardsList/types";
import { GiftCardUpdatePageUrlQueryParams } from "./GiftCardUpdate/types";

export const giftCardsSectionUrlName = "/gift-cards";

export const giftCardsListPath = `${giftCardsSectionUrlName}/`;

export const giftCardsListUrl = (params?: GiftCardListUrlQueryParams) =>
  giftCardsListPath + "?" + stringifyQs(params);

export const giftCardUrl = (
  id: string,
  params?: GiftCardUpdatePageUrlQueryParams
) => urlJoin(giftCardsListPath, id) + "?" + stringifyQs(params);
