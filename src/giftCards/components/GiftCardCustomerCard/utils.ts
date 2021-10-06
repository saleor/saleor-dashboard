import { ExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";

import { CustomerGiftCardList_giftCards_edges_node } from "./types/CustomerGiftCardList";

export const getGiftCardDisplayCode = (
  giftCard: ExtendedGiftCard<CustomerGiftCardList_giftCards_edges_node>
) => giftCard.displayCode.slice(4, giftCard.displayCode.length);
