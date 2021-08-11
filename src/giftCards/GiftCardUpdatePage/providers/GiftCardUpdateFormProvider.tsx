import { MetadataFormData } from "@saleor/components/Metadata";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { GiftCardCommonFormData } from "@saleor/giftCards/GiftCardCreateDialog/types";
import { getGiftCardExpirySettingsInputData } from "@saleor/giftCards/GiftCardCreateDialog/utils";
import { MutationResultWithOpts } from "@saleor/hooks/makeMutation";
import useForm, { FormChange, UseFormResult } from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import { getFormErrors } from "@saleor/utils/errors";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React, { createContext } from "react";
import { useIntl } from "react-intl";

import { initialData as emptyFormData } from "../../GiftCardCreateDialog/GiftCardCreateDialogForm";
import useGiftCardDetails from "../hooks/useGiftCardDetails";
import { useGiftCardUpdateMutation } from "../mutations";
import { GiftCardUpdate } from "../types/GiftCardUpdate";

interface GiftCardUpdateFormProviderProps {
  children: React.ReactNode;
  onBalanceUpdateSuccess: () => void;
}

export type GiftCardUpdateFormData = MetadataFormData &
  Omit<GiftCardCommonFormData, "balanceAmount" | "balanceCurrency">;

export interface GiftCardUpdateFormConsumerData
  extends GiftCardUpdateFormErrors {
  opts: MutationResultWithOpts<GiftCardUpdate>;
}

export interface GiftCardUpdateFormErrors {
  formErrors: Record<"tag" | "expiryDate" | "expiryPeriod", GiftCardError>;
  handlers: { changeMetadata: FormChange };
}

export type GiftCardUpdateFormConsumerProps = UseFormResult<
  GiftCardUpdateFormData
> &
  GiftCardUpdateFormConsumerData;

export const GiftCardUpdateFormContext = createContext<
  GiftCardUpdateFormConsumerProps
>(null);

const GiftCardUpdateFormProvider: React.FC<GiftCardUpdateFormProviderProps> = ({
  children,
  onBalanceUpdateSuccess
}) => {
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const { loading: loadingGiftCard, giftCard } = useGiftCardDetails();

  const getInitialData = (): GiftCardUpdateFormData => {
    if (loadingGiftCard || !giftCard) {
      return { ...emptyFormData, metadata: [], privateMetadata: [] };
    }

    const {
      tag,
      expiryDate,
      expiryType,
      expiryPeriod,
      privateMetadata,
      metadata
    } = giftCard;

    return {
      tag,
      expiryDate,
      expiryType,
      expiryPeriodType: expiryPeriod?.type,
      expiryPeriodAmount: expiryPeriod?.amount,
      privateMetadata: privateMetadata?.map(mapMetadataItemToInput),
      metadata: metadata?.map(mapMetadataItemToInput)
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

  const submit = async (formData: GiftCardUpdateFormData) => {
    const result = await updateGiftCard({
      variables: {
        id: giftCard?.id,
        input: {
          tag: formData.tag,
          expirySettings: getGiftCardExpirySettingsInputData(formData)
        }
      }
    });

    return result?.data?.giftCardUpdate?.errors;
  };

  const formProps = useForm<GiftCardUpdateFormData>(getInitialData());

  const { data, change } = formProps;

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleChange: FormChange = (event, cb) => {
    change(event, cb);
    triggerChange();
  };

  const changeMetadata = makeMetadataChangeHandler(handleChange);

  const submitData: GiftCardUpdateFormData = {
    ...data,
    ...getMetadata(data, isMetadataModified, isPrivateMetadataModified)
  };

  const handleSubmit = createMetadataUpdateHandler(
    giftCard,
    submit,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  const formSubmit = () =>
    handleFormSubmit(submitData, handleSubmit, setChanged);

  const formErrors = getFormErrors(
    ["tag", "expiryDate", "expiryPeriod"],
    updateGiftCardOpts?.data?.giftCardUpdate?.errors
  );

  const providerValues = {
    ...formProps,
    opts: updateGiftCardOpts,
    hasChanged: changed,
    formErrors,
    submit: formSubmit,
    handlers: {
      changeMetadata
    }
  };

  return (
    <GiftCardUpdateFormContext.Provider value={providerValues}>
      {children}
    </GiftCardUpdateFormContext.Provider>
  );
};

export default GiftCardUpdateFormProvider;
