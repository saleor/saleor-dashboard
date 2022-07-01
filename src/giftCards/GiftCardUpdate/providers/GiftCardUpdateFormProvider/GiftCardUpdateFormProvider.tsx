import { MetadataFormData } from "@saleor/components/Metadata";
import { giftCardUpdateFormMessages } from "@saleor/giftCards/GiftCardsList/messages";
import {
  GiftCardErrorFragment,
  GiftCardUpdateMutation,
  useGiftCardUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@saleor/graphql";
import { MutationResultWithOpts } from "@saleor/hooks/makeMutation";
import useForm, { FormChange, UseFormResult } from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import { getFormErrors } from "@saleor/utils/errors";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import difference from "lodash/difference";
import React, { createContext } from "react";
import { useIntl } from "react-intl";

import {
  GiftCardCreateFormData,
  initialData as emptyFormData,
} from "../../../GiftCardCreateDialog/GiftCardCreateDialogForm";
import useGiftCardDetails from "../GiftCardDetailsProvider/hooks/useGiftCardDetails";

interface GiftCardUpdateFormProviderProps {
  children: React.ReactNode;
}

export type GiftCardUpdateFormData = MetadataFormData &
  Pick<GiftCardCreateFormData, "tags" | "expiryDate">;

export interface GiftCardUpdateFormConsumerData
  extends GiftCardUpdateFormErrors {
  opts: MutationResultWithOpts<GiftCardUpdateMutation>;
}

export interface GiftCardUpdateFormErrors {
  formErrors: Record<"tags" | "expiryDate", GiftCardErrorFragment>;
  handlers: { changeMetadata: FormChange };
}

export type GiftCardUpdateFormConsumerProps = UseFormResult<
  GiftCardUpdateFormData
> &
  GiftCardUpdateFormConsumerData;

export const GiftCardUpdateFormContext = createContext<
  GiftCardUpdateFormConsumerProps
>(null);

const getGiftCardTagsAddRemoveData = (
  initTags: string[],
  changedTags: string[],
) => {
  const removed = difference(initTags, changedTags);
  const added = difference(changedTags, initTags);

  return {
    addTags: added,
    removeTags: removed,
  };
};

const GiftCardUpdateFormProvider: React.FC<GiftCardUpdateFormProviderProps> = ({
  children,
}) => {
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const { loading: loadingGiftCard, giftCard } = useGiftCardDetails();

  const getInitialData = (): GiftCardUpdateFormData => {
    if (loadingGiftCard || !giftCard) {
      return { ...emptyFormData, metadata: [], privateMetadata: [] };
    }

    const { tags, expiryDate, privateMetadata, metadata } = giftCard;

    return {
      tags: tags.map(({ name }) => name),
      expiryDate,
      privateMetadata: privateMetadata?.map(mapMetadataItemToInput),
      metadata: metadata?.map(mapMetadataItemToInput),
    };
  };

  const [updateGiftCard, updateGiftCardOpts] = useGiftCardUpdateMutation({
    onCompleted: data => {
      const errors = data.giftCardUpdate.errors;
      const hasExpiryError = errors.some(error => error.field === "expiryDate");

      notify(
        hasExpiryError
          ? {
              title: intl.formatMessage(
                giftCardUpdateFormMessages.giftCardInvalidExpiryDateHeader,
              ),
              text: intl.formatMessage(
                giftCardUpdateFormMessages.giftCardInvalidExpiryDateContent,
              ),
              status: "error",
            }
          : getDefaultNotifierSuccessErrorData(errors, intl),
      );
    },
  });

  const submit = async ({ tags, expiryDate }: GiftCardUpdateFormData) => {
    const result = await updateGiftCard({
      variables: {
        id: giftCard?.id,
        input: {
          expiryDate,
          ...getGiftCardTagsAddRemoveData(
            giftCard.tags.map(el => el.name),
            tags,
          ),
        },
      },
    });

    return result?.data?.giftCardUpdate?.errors;
  };

  const formProps = useForm(getInitialData());

  const { data, change, formId } = formProps;

  const handleSubmit = createMetadataUpdateHandler(
    giftCard,
    submit,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(change);

  const submitData: GiftCardUpdateFormData = {
    ...data,
    ...getMetadata(data, isMetadataModified, isPrivateMetadataModified),
  };

  const formSubmit = () => handleFormSubmit(submitData);

  const formErrors = getFormErrors(
    ["tags", "expiryDate"],
    updateGiftCardOpts?.data?.giftCardUpdate?.errors,
  );

  const providerValues = {
    ...formProps,
    opts: updateGiftCardOpts,
    formErrors,
    submit: formSubmit,
    handlers: {
      changeMetadata,
    },
  };

  return (
    <GiftCardUpdateFormContext.Provider value={providerValues}>
      {children}
    </GiftCardUpdateFormContext.Provider>
  );
};

export default GiftCardUpdateFormProvider;
