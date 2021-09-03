import React, { createContext } from "react";

import { useGiftCardDetailsQuery } from "../../queries";
import { GiftCardDetails_giftCard } from "../../types/GiftCardDetails";

interface GiftCardDetailsProviderProps {
  children: React.ReactNode;
  id: string;
}

export interface GiftCardDetailsConsumerProps {
  giftCard: GiftCardDetails_giftCard;
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

  const providerValues: GiftCardDetailsConsumerProps = {
    giftCard: data?.giftCard,
    loading
  };

  return (
    <GiftCardDetailsContext.Provider value={providerValues}>
      {children}
    </GiftCardDetailsContext.Provider>
  );
};

export default GiftCardDetailsProvider;
