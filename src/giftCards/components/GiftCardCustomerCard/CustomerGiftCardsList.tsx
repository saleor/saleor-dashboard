import CollectionWithDividers from "@saleor/components/CollectionWithDividers";
import Skeleton from "@saleor/components/Skeleton";
import { getExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import React from "react";

import CustomerGiftCardsCardListItem from "./CustomerGiftCardsCardListItem";
import { CustomerGiftCardList_giftCards_edges_node } from "./types/CustomerGiftCardList";

interface CustomerGiftCardsListProps {
  giftCards: CustomerGiftCardList_giftCards_edges_node[];
  loading: boolean;
}

const CustomerGiftCardsList: React.FC<CustomerGiftCardsListProps> = ({
  giftCards,
  loading
}) => (
  <Skeleton>
    {!loading && giftCards && (
      <CollectionWithDividers
        collection={giftCards}
        renderItem={giftCard => (
          <CustomerGiftCardsCardListItem
            giftCard={getExtendedGiftCard(giftCard)}
          />
        )}
        withOuterDividers
      />
    )}
  </Skeleton>
);

export default CustomerGiftCardsList;
