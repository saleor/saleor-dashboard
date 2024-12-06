// @ts-strict-ignore
import { GiftCardDetailsQuery, useGiftCardDetailsQuery } from "@dashboard/graphql";
import React, { createContext } from "react";

import { ExtendedGiftCard } from "./types";
import { getExtendedGiftCard } from "./utils";

interface GiftCardDetailsProviderProps {
  children: React.ReactNode;
  id: string;
}

export interface GiftCardDetailsConsumerProps {
  giftCard: ExtendedGiftCard<GiftCardDetailsQuery["giftCard"]> | undefined;
  loading: boolean;
}

export const GiftCardDetailsContext = createContext<GiftCardDetailsConsumerProps>(null);

const GiftCardDetailsProvider = ({ children, id }: GiftCardDetailsProviderProps) => {
  const { data, loading } = useGiftCardDetailsQuery({
    displayLoader: true,
    variables: { id },
  });
  const providerValues: GiftCardDetailsConsumerProps = {
    giftCard: getExtendedGiftCard(data?.giftCard),
    loading,
  };

  return (
    <GiftCardDetailsContext.Provider value={providerValues}>
      {children}
    </GiftCardDetailsContext.Provider>
  );
};

export default GiftCardDetailsProvider;
