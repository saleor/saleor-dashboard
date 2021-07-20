import urlJoin from "url-join";

export const giftCardsSectionUrlName = "/gift-cards";

export const giftCardsListPath = `${giftCardsSectionUrlName}/`;

export const giftCardsListUrl = () => giftCardsListPath;

export const giftCardPath = (id: string) => urlJoin(giftCardsListPath, id);
