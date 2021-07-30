import Form from "@saleor/components/Form";
import { UseFormResult } from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import {
  GiftCardCreateInput,
  GiftCardExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";
import React, { createContext, useState } from "react";
import { useIntl } from "react-intl";

import { useGiftCardCreateMutation } from "./mutations";
import {
  GiftCardCreateFormCustomer,
  GiftCardExpirySettingsFormData
} from "./types";
import { GiftCardCreate } from "./types/GiftCardCreate";

export const initialData: GiftCardCreateFormData = {
  tag: "",
  balanceAmount: 1,
  balanceCurrency: "",
  note: "",
  expiryDate: "",
  expiryType: GiftCardExpiryTypeEnum.EXPIRY_PERIOD,
  expiryPeriodType: TimePeriodTypeEnum.YEAR,
  expiryPeriodAmount: 1
};

interface GiftCardCreateFormProviderProps {
  children: React.ReactNode;
}

export interface GiftCardCreateFormData extends GiftCardExpirySettingsFormData {
  tag: string;
  balanceAmount: number;
  balanceCurrency: string;
  note: string;
}

export interface GiftCardCreateFormConsumerProps
  extends UseFormResult<GiftCardCreateFormData> {
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (value: GiftCardCreateFormCustomer) => void;
  loading: boolean;
}

export const GiftCardCreateFormContext = createContext<
  GiftCardCreateFormConsumerProps
>(null);

const GiftCardCreateFormProvider: React.FC<GiftCardCreateFormProviderProps> = ({
  children
}) => {
  const notify = useNotifier();
  const intl = useIntl();

  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<
    GiftCardCreateFormCustomer
  >({ email: "", name: "" });

  const onSubmit = (data: GiftCardCreate) => {
    notify(
      getDefaultNotifierSuccessErrorData(data.giftCardCreate.errors, intl)
    );
    // closeModal
  };

  const [createGiftCard, createGiftCardOpts] = useGiftCardCreateMutation({
    onCompleted: onSubmit
  });

  const handleSubmit = (data: GiftCardCreateFormData) =>
    createGiftCard({
      variables: {
        input: getParsedSubmitInputData(data)
      }
    });

  const getParsedSubmitInputData = ({
    expiryType,
    expiryDate,
    expiryPeriodAmount,
    expiryPeriodType,
    balanceAmount,
    balanceCurrency,
    note
  }: GiftCardCreateFormData): GiftCardCreateInput => ({
    note: note || null,
    tag: selectedTag || null,
    userEmail: selectedCustomer.email || null,
    balance: {
      amount: parseInt(balanceAmount, 10),
      currency: balanceCurrency
    },
    expirySettings: {
      expiryType,
      expiryDate,
      expiryPeriod: {
        amount: expiryPeriodAmount,
        type: expiryPeriodType
      }
    }
  });

  return (
    <Form initial={initialData} onSubmit={handleSubmit}>
      {formProps => {
        const providerValues: GiftCardCreateFormConsumerProps = {
          ...formProps,
          selectedTag,
          setSelectedTag,
          selectedCustomer,
          setSelectedCustomer,
          loading: createGiftCardOpts.loading
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
