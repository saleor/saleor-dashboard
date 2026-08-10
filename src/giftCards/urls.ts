import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import { type GiftCardListUrlQueryParams } from "./GiftCardsList/types";
import { type GiftCardUpdatePageUrlQueryParams } from "./GiftCardUpdate/types";

export const giftCardsSectionUrlName = "/gift-cards";

export const giftCardsListPath = `${giftCardsSectionUrlName}/`;

export const giftCardListUrl = (params?: GiftCardListUrlQueryParams) =>
  giftCardsListPath + "?" + stringifyQs(params);

export const giftCardPath = (id: string) => urlJoin(giftCardsListPath, id);

export const giftCardUrl = (id: string, params?: GiftCardUpdatePageUrlQueryParams) =>
  giftCardPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const giftCardSettingsPath = urlJoin(giftCardsListPath, "settings");

export type GiftCardSettingsUrlQueryParams = {
  from?: "gift-cards" | "configuration";
};

export const giftCardSettingsUrl = (
  params?: GiftCardSettingsUrlQueryParams & { hash?: string },
): string => {
  const query = params?.from ? `?${stringifyQs({ from: params.from })}` : "";
  const hash = params?.hash ? `#${params.hash}` : "";

  return `${giftCardSettingsPath}${query}${hash}`;
};
