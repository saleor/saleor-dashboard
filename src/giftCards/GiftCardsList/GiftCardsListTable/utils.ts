import { PLACEHOLDER } from "@dashboard/giftCards/GiftCardUpdate/types";
import { GiftCardDataFragment } from "@dashboard/graphql";

export const getTagCellText = (tags: GiftCardDataFragment["tags"]) => {
  if (!!tags.length) {
    return tags.map(({ name }) => name).join(", ");
  }

  return PLACEHOLDER;
};
