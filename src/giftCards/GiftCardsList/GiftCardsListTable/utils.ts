import { PLACEHOLDER } from "@saleor/giftCards/GiftCardUpdate/types";
import { GiftCardDataFragment } from "@saleor/graphql";

export const getTagCellText = (tags: GiftCardDataFragment["tags"]) => {
  if (!!tags.length) {
    return tags.map(({ name }) => name).join(", ");
  }

  return PLACEHOLDER;
};
