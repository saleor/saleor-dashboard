import {
  GiftCardEventsEnum,
  GiftCardExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";
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
    expiryType: GiftCardExpiryTypeEnum.EXPIRY_PERIOD,
    events: [
      {
        type: GiftCardEventsEnum.ISSUED,
        orderId: "1234",
        orderNumber: "32423434"
      }
    ],
    createdBy: {
      id: "1222",
      firstName: "Janusz",
      lastName: "Kowalski"
    },
    product: {
      id: "1234",
      name: "Greatest product"
    },
    created: "2020-04-01",
    createdByEmail: "foobar@gmail.com",
    usedBy: {
      id: "1234",
      firstName: "Krzesimir",
      lastName: "Majsterkowicz"
    },
    usedByEmail: "elfo.mail@gmail.com",
    expiryPeriod: {
      type: TimePeriodTypeEnum.MONTH,
      amount: 12
    },
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
