import { MetadataFormData } from "@saleor/components/Metadata";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { MutationResultWithOpts } from "@saleor/hooks/makeMutation";
import useForm, { FormChange, UseFormResult } from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import { getFormErrors } from "@saleor/utils/errors";
import useHandleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
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

import {
  GiftCardCreateFormData,
  initialData as emptyFormData
} from "../../../GiftCardCreateDialog/GiftCardCreateDialogForm";
import { useGiftCardUpdateMutation } from "../../mutations";
import { GiftCardUpdate } from "../../types/GiftCardUpdate";
import useGiftCardDetails from "../GiftCardDetailsProvider/hooks/useGiftCardDetails";

interface GiftCardUpdateFormProviderProps {
  children: React.ReactNode;
}

export type GiftCardUpdateFormData = MetadataFormData &
  Pick<GiftCardCreateFormData, "tag" | "expiryDate">;

export interface GiftCardUpdateFormConsumerData
  extends GiftCardUpdateFormErrors {
  opts: MutationResultWithOpts<GiftCardUpdate>;
}

export interface GiftCardUpdateFormErrors {
  formErrors: Record<"tag" | "expiryDate", GiftCardError>;
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
  children
}) => {
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const { loading: loadingGiftCard, giftCard } = useGiftCardDetails();

  const getInitialData = (): GiftCardUpdateFormData => {
    if (loadingGiftCard || !giftCard) {
      return { ...emptyFormData, metadata: [], privateMetadata: [] };
    }

    const { tag, expiryDate, privateMetadata, metadata } = giftCard;

    return {
      tag,
      expiryDate,
      privateMetadata: privateMetadata?.map(mapMetadataItemToInput),
      metadata: metadata?.map(mapMetadataItemToInput)
    };
  };

  const onSubmit = (data: GiftCardUpdate) => {
    const errors = data.giftCardUpdate.errors;

    notify(getDefaultNotifierSuccessErrorData(errors, intl));
  };

  const [updateGiftCard, updateGiftCardOpts] = useGiftCardUpdateMutation({
    onCompleted: onSubmit
  });

  const submit = async ({ tag, expiryDate }: GiftCardUpdateFormData) => {
    const result = await updateGiftCard({
      variables: {
        id: giftCard?.id,
        input: {
          tag,
          expiryDate
        }
      }
    });

    return result?.data?.giftCardUpdate?.errors;
  };

  const formProps = useForm(getInitialData());

  const { data, change, setChanged, hasChanged, formId } = formProps;

  const handleSubmit = createMetadataUpdateHandler(
    giftCard,
    submit,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
    setChanged
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(change);

  const submitData: GiftCardUpdateFormData = {
    ...data,
    ...getMetadata(data, isMetadataModified, isPrivateMetadataModified)
  };

  const formSubmit = () => handleFormSubmit(submitData);

  const formErrors = getFormErrors(
    ["tag", "expiryDate"],
    updateGiftCardOpts?.data?.giftCardUpdate?.errors
  );

  const providerValues = {
    ...formProps,
    opts: updateGiftCardOpts,
    hasChanged,
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
