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
  const giftCard = {
    id: "1234",
    code: "8361",
    isActive: false
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
