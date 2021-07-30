import Form from "@saleor/components/Form";
import { MutationResultWithOpts } from "@saleor/hooks/makeMutation";
import { UseFormResult } from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import React, { createContext, useContext } from "react";
import { useIntl } from "react-intl";

import { initialData } from "../GiftCardCreateDialog/GiftCardCreateFormProvider";
import { GiftCardExpirySettingsFormData } from "../GiftCardCreateDialog/types";
import { GiftCardDetailsContext } from "./GiftCardDetailsProvider";
import { useGiftCardUpdateMutation } from "./mutations";
import { GiftCardUpdate } from "./types/GiftCardUpdate";
import { getGiftCardExpirySettingsInputData } from "./utils";

interface GiftCardUpdateFormProviderProps {
  children: React.ReactNode;
}

export interface GiftCardUpdateFormData extends GiftCardExpirySettingsFormData {
  tag: string;
}

export interface GiftCardUpdateFormConsumerProps
  extends UseFormResult<GiftCardUpdateFormData> {
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  opts: MutationResultWithOpts<GiftCardUpdate>;
}

export const GiftCardUpdateFormContext = createContext<
  GiftCardUpdateFormConsumerProps
>(null);

const GiftCardUpdateFormProvider: React.FC<GiftCardUpdateFormProviderProps> = ({
  children
}) => {
  const notify = useNotifier();
  const intl = useIntl();

  const { loading: loadingGiftCard, giftCard } = useContext(
    GiftCardDetailsContext
  );

  const [selectedTag, setSelectedTag] = useStateFromProps(
    giftCard?.tag || null
  );

  const getInitialData = (): GiftCardUpdateFormData => {
    if (loadingGiftCard || !giftCard) {
      return initialData;
    }

    const { tag, expiryDate, expiryType, expiryPeriod } = giftCard;

    return {
      tag,
      expiryDate,
      expiryType,
      expiryPeriodType: expiryPeriod?.type,
      expiryPeriodAmount: expiryPeriod?.amount
    };
  };

  const onSubmit = (data: GiftCardUpdate) =>
    notify(
      getDefaultNotifierSuccessErrorData(data.giftCardUpdate.errors, intl)
    );

  const [updateGiftCard, updateGiftCardOpts] = useGiftCardUpdateMutation({
    onCompleted: onSubmit
  });

  const handleSubmit = (formData: GiftCardUpdateFormData) =>
    updateGiftCard({
      variables: {
        id: giftCard?.id,
        input: {
          tag: formData.tag,
          expirySettings: getGiftCardExpirySettingsInputData(formData)
        }
      }
    });

  return (
    <Form initial={getInitialData()} onSubmit={handleSubmit}>
      {formProps => {
        const providerValues: GiftCardUpdateFormConsumerProps = {
          ...formProps,
          selectedTag,
          setSelectedTag,
          opts: updateGiftCardOpts
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
