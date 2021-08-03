import Form from "@saleor/components/Form";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { GiftCardCommonFormData } from "@saleor/giftCards/GiftCardCreateDialog/types";
import { MutationResultWithOpts } from "@saleor/hooks/makeMutation";
import { UseFormResult } from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import { GiftCardUpdateInput } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import React, { createContext, useContext } from "react";
import { useIntl } from "react-intl";

import { initialData as emptyFormData } from "../../GiftCardCreateDialog/providers/GiftCardCreateFormProvider";
import { useGiftCardUpdateMutation } from "../mutations";
import { GiftCardUpdate } from "../types/GiftCardUpdate";
import { getGiftCardExpirySettingsInputData } from "../utils";
import { GiftCardDetailsContext } from "./GiftCardDetailsProvider";

interface GiftCardUpdateFormProviderProps {
  children: React.ReactNode;
  onBalanceUpdateSuccess: () => void;
}

export type GiftCardUpdateFormData = GiftCardCommonFormData;

export interface GiftCardUpdateFormConsumerProps
  extends UseFormResult<GiftCardUpdateFormData> {
  opts: MutationResultWithOpts<GiftCardUpdate>;
  submitBalance: () => void;
  errors: Record<"tag" | "expiryDate" | "expiryPeriod", GiftCardError>;
}

export const GiftCardUpdateFormContext = createContext<
  GiftCardUpdateFormConsumerProps
>(null);

const GiftCardUpdateFormProvider: React.FC<GiftCardUpdateFormProviderProps> = ({
  children,
  onBalanceUpdateSuccess
}) => {
  const notify = useNotifier();
  const intl = useIntl();

  const { loading: loadingGiftCard, giftCard } = useContext(
    GiftCardDetailsContext
  );

  const getInitialData = (): GiftCardUpdateFormData => {
    if (loadingGiftCard || !giftCard) {
      return emptyFormData;
    }

    const {
      tag,
      expiryDate,
      expiryType,
      expiryPeriod,
      currentBalance: { amount, currency }
    } = giftCard;

    return {
      balanceAmount: amount.toString(),
      balanceCurrency: currency,
      tag,
      expiryDate,
      expiryType,
      expiryPeriodType: expiryPeriod?.type,
      expiryPeriodAmount: expiryPeriod?.amount.toString()
    };
  };

  const onSubmit = (data: GiftCardUpdate) => {
    const errors = data.giftCardUpdate.errors;

    notify(getDefaultNotifierSuccessErrorData(errors, intl));

    if (!errors.length) {
      onBalanceUpdateSuccess();
    }
  };

  const [updateGiftCard, updateGiftCardOpts] = useGiftCardUpdateMutation({
    onCompleted: onSubmit
  });

  const handleGiftCardUpdate = (input: GiftCardUpdateInput) =>
    updateGiftCard({
      variables: {
        id: giftCard?.id,
        input
      }
    });

  const handleSubmit = (formData: GiftCardUpdateFormData) =>
    handleGiftCardUpdate({
      tag: formData.tag,
      expirySettings: getGiftCardExpirySettingsInputData(formData)
    });

  const errors = getFormErrors(
    ["tag", "expiryDate", "expiryPeriod"],
    updateGiftCardOpts?.data?.giftCardUpdate?.errors || []
  );

  return (
    <Form initial={getInitialData()} onSubmit={handleSubmit}>
      {formProps => {
        const handleBalanceSubmit = () =>
          handleGiftCardUpdate({
            balance: {
              amount: formProps.data.balanceAmount,
              currency: formProps.data.balanceCurrency
            }
          });

        const providerValues: GiftCardUpdateFormConsumerProps = {
          ...formProps,
          opts: updateGiftCardOpts,
          submitBalance: handleBalanceSubmit,
          errors
        };

        return (
          <GiftCardUpdateFormContext.Provider value={providerValues}>
            {children}
          </GiftCardUpdateFormContext.Provider>
        );
      }}
    </Form>
  );
};

export default GiftCardUpdateFormProvider;
