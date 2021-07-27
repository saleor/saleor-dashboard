import Form from "@saleor/components/Form";
import { UseFormResult } from "@saleor/hooks/useForm";
import {
  GiftCardExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";
import React, { createContext, useState } from "react";

import { GiftCardDetails_giftCard } from "../GiftCardUpdatePage/types/GiftCardDetails";

interface GiftCardCreateFormProviderProps {
  children: React.ReactNode;
}

export interface GiftCardCreateFormData
  extends Pick<GiftCardDetails_giftCard, "tag" | "expiryDate" | "expiryType"> {
  balanceAmount: number;
  balanceCurrency: string;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  note: string;
}

export interface GiftCardCreateFormConsumerProps
  extends UseFormResult<GiftCardCreateFormData> {
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  selectedCustomer: string;
  setSelectedCustomer: (value: string) => void;
}

export const GiftCardCreateFormContext = createContext<
  GiftCardCreateFormConsumerProps
>(null);

const GiftCardCreateFormProvider: React.FC<GiftCardCreateFormProviderProps> = ({
  children
}) => {
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // TEMP

  const initialData: GiftCardCreateFormData = {
    balanceAmount: 0,
    balanceCurrency: "USD", // should default to?
    tag: "",
    note: "",
    expiryDate: "",
    expiryType: GiftCardExpiryTypeEnum.EXPIRY_PERIOD,
    expiryPeriodType: TimePeriodTypeEnum.YEAR,
    expiryPeriodAmount: 0
  };

  //   const [openModal, closeModal] = createDialogActionHandlers<
  //     AppDetailsUrlDialog,
  //     AppDetailsUrlQueryParams
  //   >(navigate, params => appUrl(id, params), params);

  return (
    <Form initial={initialData}>
      {formProps => {
        const providerValues: GiftCardCreateFormConsumerProps = {
          ...formProps,
          selectedTag,
          setSelectedTag,
          selectedCustomer,
          setSelectedCustomer
        };

        return (
          <GiftCardCreateFormContext.Provider value={providerValues}>
            {children}
          </GiftCardCreateFormContext.Provider>
        );
      }}
    </Form>
  );
};

export default GiftCardCreateFormProvider;
