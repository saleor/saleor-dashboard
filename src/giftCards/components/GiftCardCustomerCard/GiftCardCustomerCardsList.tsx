import React from "react";
import GiftCardCustomerCardListing from "./GiftCardCustomerCardListing";
import useGiftCardList from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import Skeleton from "@saleor/components/Skeleton";

interface GiftCardCustomerCardsListProps {}

const GiftCardCustomerCardsList: React.FC<GiftCardCustomerCardsListProps> = ({}) => {
  const { giftCards, loading } = useGiftCardList();

  if (!loading) {
    console.log({ giftCards });
  }

  if (loading) {
    return <Skeleton />;
  }

  const getGiftCardsForCustomerPage = () => {
    return giftCards
      .splice(0, 5)
      .map(giftCard => <GiftCardCustomerCardListing giftCard={giftCard} />);
  };

  return (
    <>
      {giftCards.length > 0 ? (
        getGiftCardsForCustomerPage()
      ) : (
        <div>No giftcards sad UwU</div>
      )}
    </>
  );
};

export default GiftCardCustomerCardsList;
