import CollectionWithDividers from "@saleor/components/CollectionWithDividers";
import Skeleton from "@saleor/components/Skeleton";
import { getExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import React from "react";

import CustomerGiftCardsCardListCard from "./CustomerGiftCardsCardListCard";
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
    {!loading && (
      <CollectionWithDividers
        collection={giftCards}
        renderItem={giftCard => (
          <CustomerGiftCardsCardListCard
            giftCard={getExtendedGiftCard(giftCard)}
          />
        )}
      />
    )}
  </Skeleton>
);

export default CustomerGiftCardsList;
