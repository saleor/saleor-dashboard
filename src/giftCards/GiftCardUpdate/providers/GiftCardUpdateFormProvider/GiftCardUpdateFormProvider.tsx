import { giftCardUpdateFormMessages } from "@dashboard/giftCards/GiftCardsList/messages";
import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import {
  type GiftCardErrorFragment,
  type GiftCardUpdateMutation,
  useGiftCardUpdateMutation,
} from "@dashboard/graphql";
import { type MutationResultWithOpts } from "@dashboard/hooks/makeMutation";
import useForm, { type UseFormResult } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@dashboard/hooks/useNotifier/utils";
import { getFormErrors } from "@dashboard/utils/errors";
import { createContext, type ReactNode, useEffect } from "react";
import { useIntl } from "react-intl";

import {
  type GiftCardCreateFormData,
  initialData as emptyFormData,
} from "../../../GiftCardCreateDialog/GiftCardCreateDialogForm";
import {
  buildGiftCardSaveComposition,
  EMPTY_GIFT_CARD_SAVE_COMPOSITION,
  type GiftCardSaveComposition,
  hasGiftCardSaveComposition,
} from "../../saveComposition";
import useGiftCardDetails from "../GiftCardDetailsProvider/hooks/useGiftCardDetails";

interface GiftCardUpdateFormProviderProps {
  children: ReactNode;
}

export type GiftCardUpdateFormData = Pick<GiftCardCreateFormData, "tags" | "expiryDate">;

export interface GiftCardUpdateFormConsumerData extends GiftCardUpdateFormErrors {
  opts: MutationResultWithOpts<GiftCardUpdateMutation>;
  saveComposition: GiftCardSaveComposition;
  isSaveDisabled: boolean;
}

export interface GiftCardUpdateFormErrors {
  formErrors: Record<"tags" | "expiryDate", GiftCardErrorFragment | undefined>;
}

type GiftCardUpdateFormConsumerProps = UseFormResult<GiftCardUpdateFormData> &
  GiftCardUpdateFormConsumerData;

export const GiftCardUpdateFormContext = createContext<GiftCardUpdateFormConsumerProps | null>(
  null,
);

export const getGiftCardTagsAddRemoveData = (initTags: string[], changedTags: string[]) => {
  const removeTags = initTags.filter(tag => !changedTags.includes(tag));
  const addTags = changedTags.filter(tag => !initTags.includes(tag));

  return {
    addTags,
    removeTags,
  };
};

const GiftCardUpdateFormProvider = ({ children }: GiftCardUpdateFormProviderProps) => {
  const notify = useNotifier();
  const intl = useIntl();
  const { canSeeCreatedBy } = useGiftCardPermissions();
  const { loading: loadingGiftCard, giftCard } = useGiftCardDetails();
  const getInitialData = (): GiftCardUpdateFormData => {
    if (loadingGiftCard || !giftCard) {
      return {
        tags: emptyFormData.tags,
        expiryDate: emptyFormData.expiryDate,
      };
    }

    const { tags, expiryDate } = giftCard;

    return {
      tags: tags.map(({ name }) => ({ label: name, value: name })),
      expiryDate: expiryDate ?? "",
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
      return [];
    }

    const result = await updateGiftCard({
      variables: {
        id: giftCard.id,
        input: {
          expiryDate: expiryDate || null,
          ...getGiftCardTagsAddRemoveData(
            giftCard.tags.map(el => el.name),
            tags.map(el => el.value),
          ),
        },
        showCreatedBy: canSeeCreatedBy,
      },
    });

    return result?.data?.giftCardUpdate?.errors ?? [];
  };
  const formProps = useForm(getInitialData(), undefined, {
    confirmLeave: true,
  });
  const { data, formId, changedData, triggerChange, setIsSubmitDisabled, handleChange } = formProps;
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: submit,
  });
  const formErrors = getFormErrors(
    ["tags", "expiryDate"],
    updateGiftCardOpts?.data?.giftCardUpdate?.errors,
  );
  const saveComposition = giftCard
    ? buildGiftCardSaveComposition(Object.keys(changedData))
    : EMPTY_GIFT_CARD_SAVE_COMPOSITION;
  const hasUnsavedChanges = hasGiftCardSaveComposition(saveComposition);
  const isSaveDisabled =
    loadingGiftCard || !giftCard || updateGiftCardOpts.loading || !hasUnsavedChanges;

  // Keep exit-dialog dirty + submit-disabled in sync with real composition
  // (reverting edits must clear confirm-leave; Save stays disabled when pristine).
  useEffect(
    function syncExitDialogDirtyFromComposition() {
      triggerChange(hasUnsavedChanges);
    },
    [hasUnsavedChanges, triggerChange],
  );

  setIsSubmitDisabled(isSaveDisabled);

  const providerValues: GiftCardUpdateFormConsumerProps = {
    ...formProps,
    change: handleChange,
    opts: updateGiftCardOpts,
    formErrors,
    submit: () => handleFormSubmit(data),
    saveComposition,
    isSaveDisabled,
  };

  return (
    <GiftCardUpdateFormContext.Provider value={providerValues}>
      {children}
    </GiftCardUpdateFormContext.Provider>
  );
};

export default GiftCardUpdateFormProvider;
