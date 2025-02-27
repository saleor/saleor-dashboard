// @ts-strict-ignore
import { GiftCardDetailsQuery, useGiftCardDetailsQuery } from "@dashboard/graphql";
import { createContext, ReactNode, useContext } from "react";

import { useGiftCardPermissions } from "../../../hooks/useGiftCardPermissions";
import { ExtendedGiftCard } from "./types";
import { getExtendedGiftCard } from "./utils";

interface GiftCardDetailsProviderProps {
  children: ReactNode;
  id: string;
}

export interface GiftCardDetailsConsumerProps {
  giftCard: ExtendedGiftCard<GiftCardDetailsQuery["giftCard"]> | undefined;
  loading: boolean;
}

export const GiftCardDetailsContext = createContext<GiftCardDetailsConsumerProps>(null);

const GiftCardDetailsProvider = ({ children, id }: GiftCardDetailsProviderProps) => {
  const { canSeeApp, canSeeUser } = useGiftCardPermissions();
  const { data, loading } = useGiftCardDetailsQuery({
    displayLoader: true,
    variables: { id, canSeeApp, canSeeUser },
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

export const useGiftCardDetails = () => {
  const context = useContext(GiftCardDetailsContext);

  if (!context) {
    throw new Error("useGiftCardDetails must be used within a GiftCardDetailsProvider");
  }

  return context;
};

export default GiftCardDetailsProvider;
