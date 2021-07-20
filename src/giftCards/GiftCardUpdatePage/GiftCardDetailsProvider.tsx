import React, { createContext } from "react";

import { GiftCardDetails_giftCard } from "./types/GiftCardDetails";

interface GiftCardDetailsProviderProps {
  children: React.ReactNode;
  id: string;
}

export interface GiftCardDetailsConsumerProps {
  giftCard: GiftCardDetails_giftCard;
}

export const GiftCardDetailsContext = createContext<
  GiftCardDetailsConsumerProps
>(null);

const GiftCardDetailsProvider: React.FC<GiftCardDetailsProviderProps> = ({
  children
}) => {
  const giftCard: GiftCardDetails_giftCard = {
    id: "1234",
    code: "8361",
    isActive: false,
    currentBalance: {
      amount: 10.67,
      currency: "USD"
    },
    initialBalance: {
      amount: 17.0,
      currency: "USD"
    }
  };

  const providerValues: GiftCardDetailsConsumerProps = {
    giftCard
  };

  return (
    <GiftCardDetailsContext.Provider value={providerValues}>
      {children}
    </GiftCardDetailsContext.Provider>
  );
};

export default GiftCardDetailsProvider;
