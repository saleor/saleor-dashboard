import moment from "moment";
import React, { createContext } from "react";

import { useGiftCardDetailsQuery } from "../../queries";
import { ExtendedGiftCard } from "./types";

interface GiftCardDetailsProviderProps {
  children: React.ReactNode;
  id: string;
}

export interface GiftCardDetailsConsumerProps {
  giftCard: ExtendedGiftCard;
  loading: boolean;
}

export const GiftCardDetailsContext = createContext<
  GiftCardDetailsConsumerProps
>(null);

const GiftCardDetailsProvider: React.FC<GiftCardDetailsProviderProps> = ({
  children,
  id
}) => {
  const { data, loading } = useGiftCardDetailsQuery({
    displayLoader: true,
    variables: { id }
  });

  const isGiftCardExpired = () => {
    if (loading) {
      return false;
    }

    // return moment(data?.giftCard?.expiryDate).isBefore(moment());
    return moment("2021-09-01").isBefore(moment());
  };

  const extendedGiftCard = {
    ...data?.giftCard,
    isExpired: isGiftCardExpired()
  };

  const providerValues: GiftCardDetailsConsumerProps = {
    giftCard: extendedGiftCard,
    loading
  };

  return (
    <GiftCardDetailsContext.Provider value={providerValues}>
      {children}
    </GiftCardDetailsContext.Provider>
  );
};

export default GiftCardDetailsProvider;
