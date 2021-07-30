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

import { getGiftCardExpirySettingsInputData } from "../GiftCardUpdatePage/utils";
import { useGiftCardCreateMutation } from "./mutations";
import { GiftCardCommonFormData, GiftCardCreateFormCustomer } from "./types";
import { GiftCardCreate } from "./types/GiftCardCreate";

export const initialData: GiftCardCreateFormData = {
  tag: "",
  balanceAmount: "1",
  balanceCurrency: "",
  note: "",
  expiryDate: "",
  expiryType: GiftCardExpiryTypeEnum.EXPIRY_PERIOD,
  expiryPeriodType: TimePeriodTypeEnum.YEAR,
  expiryPeriodAmount: "1"
};

interface GiftCardCreateFormProviderProps {
  children: React.ReactNode;
  onSubmitSuccess: () => void;
}

export interface GiftCardCreateFormData extends GiftCardCommonFormData {
  note: string;
}

export interface GiftCardCreateFormConsumerProps
  extends UseFormResult<GiftCardCreateFormData> {
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (value: GiftCardCreateFormCustomer) => void;
  loading: boolean;
}

export const GiftCardCreateFormContext = createContext<
  GiftCardCreateFormConsumerProps
>(null);

const GiftCardCreateFormProvider: React.FC<GiftCardCreateFormProviderProps> = ({
  children,
  onSubmitSuccess
}) => {
  const notify = useNotifier();
  const intl = useIntl();

  const [selectedCustomer, setSelectedCustomer] = useState<
    GiftCardCreateFormCustomer
  >({ email: "", name: "" });

  const onSubmit = (data: GiftCardCreate) => {
    const errors = data.giftCardCreate.errors;
    notify(getDefaultNotifierSuccessErrorData(errors, intl));

    if (!errors.length) {
      onSubmitSuccess();
    }
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

  const getParsedSubmitInputData = (
    formData: GiftCardCreateFormData
  ): GiftCardCreateInput => {
    const { balanceAmount, balanceCurrency, note, tag } = formData;

    return {
      note: note || null,
      tag: tag || null,
      userEmail: selectedCustomer.email || null,
      balance: {
        amount: balanceAmount,
        currency: balanceCurrency
      },
      expirySettings: getGiftCardExpirySettingsInputData(formData)
    };
  };

  return (
    <Form initial={initialData} onSubmit={handleSubmit}>
      {formProps => {
        const providerValues: GiftCardCreateFormConsumerProps = {
          ...formProps,
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
