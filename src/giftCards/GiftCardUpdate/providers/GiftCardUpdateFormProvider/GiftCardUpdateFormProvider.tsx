import { type MetadataFormData } from "@dashboard/components/Metadata";
import { giftCardUpdateFormMessages } from "@dashboard/giftCards/GiftCardsList/messages";
import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import {
  type GiftCardErrorFragment,
  type GiftCardUpdateMutation,
  useGiftCardUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import { type MutationResultWithOpts } from "@dashboard/hooks/makeMutation";
import useForm, { type FormChange, type UseFormResult } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@dashboard/hooks/useNotifier/utils";
import { getFormErrors } from "@dashboard/utils/errors";
import createMetadataUpdateHandler, {
  type ObjectWithMetadata,
} from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import getMetadata from "@dashboard/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import difference from "lodash/difference";
import type * as React from "react";
import { createContext } from "react";
import { useIntl } from "react-intl";

import {
  type GiftCardCreateFormData,
  initialData as emptyFormData,
} from "../../../GiftCardCreateDialog/GiftCardCreateDialogForm";
import useGiftCardDetails from "../GiftCardDetailsProvider/hooks/useGiftCardDetails";

interface GiftCardUpdateFormProviderProps {
  children: React.ReactNode;
}

export type GiftCardUpdateFormData = MetadataFormData &
  Pick<GiftCardCreateFormData, "tags" | "expiryDate">;

export interface GiftCardUpdateFormConsumerData extends GiftCardUpdateFormErrors {
  opts: MutationResultWithOpts<GiftCardUpdateMutation>;
}

export interface GiftCardUpdateFormErrors {
  formErrors: Record<"tags" | "expiryDate", GiftCardErrorFragment | undefined>;
  handlers: { changeMetadata: FormChange };
}

type GiftCardUpdateFormConsumerProps = UseFormResult<GiftCardUpdateFormData> &
  GiftCardUpdateFormConsumerData;

export const GiftCardUpdateFormContext = createContext<GiftCardUpdateFormConsumerProps | null>(
  null,
);

export const getGiftCardTagsAddRemoveData = (initTags: string[], changedTags: string[]) => {
  const removed = difference(initTags, changedTags);
  const added = difference(changedTags, initTags);

  return {
    addTags: added,
    removeTags: removed,
  };
};

const GiftCardUpdateFormProvider = ({ children }: GiftCardUpdateFormProviderProps) => {
  const notify = useNotifier();
  const intl = useIntl();
  const { canSeeCreatedBy } = useGiftCardPermissions();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const { loading: loadingGiftCard, giftCard } = useGiftCardDetails();
  const getInitialData = (): GiftCardUpdateFormData => {
    if (loadingGiftCard || !giftCard) {
      return { ...emptyFormData, metadata: [], privateMetadata: [] };
    }

    const { tags, expiryDate, privateMetadata, metadata } = giftCard;

    return {
      tags: tags.map(({ name }) => ({ label: name, value: name })),
      expiryDate: expiryDate ?? "",
      privateMetadata: privateMetadata?.map(mapMetadataItemToInput) ?? [],
      metadata: metadata?.map(mapMetadataItemToInput) ?? [],
    };
  };
  const [updateGiftCard, updateGiftCardOpts] = useGiftCardUpdateMutation({
    onCompleted: data => {
      const errors = data.giftCardUpdate?.errors ?? [];
      const hasExpiryError = errors.some(error => error.field === "expiryDate");

      notify(
        hasExpiryError
          ? {
              title: intl.formatMessage(giftCardUpdateFormMessages.giftCardInvalidExpiryDateHeader),
              text: intl.formatMessage(giftCardUpdateFormMessages.giftCardInvalidExpiryDateContent),
              status: "error",
            }
          : getDefaultNotifierSuccessErrorData(errors, intl),
      );
    },
  });
  const submit = async ({ tags, expiryDate }: GiftCardUpdateFormData) => {
    if (!giftCard) {
      return undefined;
    }

    const result = await updateGiftCard({
      variables: {
        id: giftCard.id,
        input: {
          expiryDate,
          ...getGiftCardTagsAddRemoveData(
            giftCard.tags.map(el => el.name),
            tags.map(el => el.value),
          ),
        },
        showCreatedBy: canSeeCreatedBy,
      },
    });

    return result?.data?.giftCardUpdate?.errors;
  };
  const formProps = useForm(getInitialData());
  const { data, change, formId } = formProps;
  const giftCardMetadata: ObjectWithMetadata = giftCard ?? {
    id: "",
    metadata: [],
    privateMetadata: [],
  };
  const handleSubmit = createMetadataUpdateHandler(
    giftCardMetadata,
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
  const metadataUpdate = getMetadata(data, isMetadataModified, isPrivateMetadataModified);
  const submitData: GiftCardUpdateFormData = {
    ...data,
    metadata: metadataUpdate.metadata ?? data.metadata,
    privateMetadata: metadataUpdate.privateMetadata ?? data.privateMetadata,
  };
  const formSubmit = () => handleFormSubmit(submitData);
  const formErrors = getFormErrors(
    ["tags", "expiryDate"],
    updateGiftCardOpts?.data?.giftCardUpdate?.errors,
  );
  const providerValues: GiftCardUpdateFormConsumerProps = {
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
