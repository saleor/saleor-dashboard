import { PLACEHOLDER } from "@saleor/giftCards/GiftCardUpdate/types";

import { GiftCardList_giftCards_edges_node_tags } from "../types/GiftCardList";

export const getTagCellText = (
  tags: GiftCardList_giftCards_edges_node_tags[]
) => {
  if (!!tags.length) {
    return tags.map(({ name }) => name).join(", ");
  }

  return PLACEHOLDER;
};
