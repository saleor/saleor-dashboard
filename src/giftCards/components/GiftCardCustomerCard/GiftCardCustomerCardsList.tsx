import { CardContent } from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import { getExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import React from "react";

import GiftCardCustomerCardListing from "./CustomerGiftCardListCard";
import { CustomerGiftCardList_giftCards_edges_node } from "./types/CustomerGiftCardList";

interface GiftCardCustomerCardsListProps {
  giftCards: CustomerGiftCardList_giftCards_edges_node[];
  loading: boolean;
}

const GiftCardCustomerCardsList: React.FC<GiftCardCustomerCardsListProps> = ({
  giftCards,
  loading
}) => {
  if (loading) {
    return (
      <CardContent>
        <Skeleton />
      </CardContent>
    );
  }

  const getGiftCardsForCustomerPage = () =>
    giftCards.map(giftCard => (
      <GiftCardCustomerCardListing giftCard={getExtendedGiftCard(giftCard)} />
    ));

  return <>{giftCards.length > 0 && getGiftCardsForCustomerPage()}</>;
};

export default GiftCardCustomerCardsList;
