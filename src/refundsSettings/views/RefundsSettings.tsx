import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import {
  useModelTypesQuery,
  useRefundReasonReferenceClearMutation,
  useRefundSettingsQuery,
  useRefundSettingsUpdateMutation,
  useReturnReasonReferenceClearMutation,
  useReturnSettingsQuery,
  useReturnSettingsUpdateMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationState } from "@dashboard/misc";
import {
  getRefundsSettingsFormData,
  isRefundsSettingsFormPristine,
} from "@dashboard/refundsSettings/components/RefundsSettingsPage/formData";
import { refundsSettingsPageMessages } from "@dashboard/refundsSettings/components/RefundsSettingsPage/messages";
import { RefundsSettingsPage } from "@dashboard/refundsSettings/components/RefundsSettingsPage/RefundsSettingsPage";
import { submitRefundsSettingsForm } from "@dashboard/refundsSettings/components/RefundsSettingsPage/submitRefundsSettingsForm";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

export const RefundsSettings = (): JSX.Element => {
  const intl = useIntl();
  const notify = useNotifier();
  const formId = useRef(Symbol("refunds-settings-form")).current;
  const { setIsDirty, setExitDialogSubmitRef, setEnableExitDialog } = useExitFormDialog({
    formId,
  });
  const {
    loading: refundSettingsLoading,
    data: refundSettingsData,
    refetch: refetchRefundSettings,
  } = useRefundSettingsQuery();
  const {
    loading: returnSettingsLoading,
    data: returnSettingsData,
    refetch: refetchReturnSettings,
  } = useReturnSettingsQuery();
  const { loading: modelTypesLoading, data: modelsList } = useModelTypesQuery();

  const [updateRefundSettings, updateRefundSettingsOpts] = useRefundSettingsUpdateMutation();
  const [clearRefundReferenceType, clearRefundReferenceTypeOpts] =
    useRefundReasonReferenceClearMutation();
  const [updateReturnSettings, updateReturnSettingsOpts] = useReturnSettingsUpdateMutation();
  const [clearReturnReferenceType, clearReturnReferenceTypeOpts] =
    useReturnReasonReferenceClearMutation();
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrors, setSaveErrors] = useState<Array<{ code: string; message?: string | null }>>(
    [],
  );

  const initialFormData = useMemo(
    () =>
      getRefundsSettingsFormData(
        refundSettingsData?.refundSettings.reasonReferenceType?.id ?? "",
        returnSettingsData?.returnSettings.reasonReferenceType?.id ?? "",
      ),
    [
      refundSettingsData?.refundSettings.reasonReferenceType?.id,
      returnSettingsData?.returnSettings.reasonReferenceType?.id,
    ],
  );

  const [formData, setFormData] = useState(initialFormData);
  const previousInitialRef = useRef(initialFormData);

  useEffect(
    function syncFormWithServerWhenPristine() {
      setFormData(current => {
        const wasPristine = isRefundsSettingsFormPristine(current, previousInitialRef.current);

        previousInitialRef.current = initialFormData;

        return wasPristine ? initialFormData : current;
      });
    },
    [initialFormData],
  );

  const modelTypesOptions = useMemo(
    () => [
      {
        value: "",
        label: intl.formatMessage(refundsSettingsPageMessages.noneOption),
      },
      ...(modelsList?.pageTypes?.edges.map(edge => ({
        value: edge.node.id,
        label: edge.node.name,
      })) ?? []),
    ],
    [intl, modelsList?.pageTypes?.edges],
  );

  const isLoading = refundSettingsLoading || returnSettingsLoading || modelTypesLoading;
  const isSaveDisabled = isRefundsSettingsFormPristine(formData, initialFormData);

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    setSaveErrors([]);

    try {
      const result = await submitRefundsSettingsForm({
        formData,
        initialFormData,
        updateRefundSettings,
        clearRefundReferenceType,
        updateReturnSettings,
        clearReturnReferenceType,
      });

      setSaveErrors(result.allErrors);

      if (!result.allErrors.length) {
        await Promise.all([refetchRefundSettings(), refetchReturnSettings()]);
        setIsDirty(false);
        notify({
          status: "success",
          text: intl.formatMessage(refundsSettingsPageMessages.saveSuccess),
        });
      } else {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong),
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    clearRefundReferenceType,
    clearReturnReferenceType,
    formData,
    initialFormData,
    intl,
    notify,
    refetchRefundSettings,
    refetchReturnSettings,
    setIsDirty,
    updateRefundSettings,
    updateReturnSettings,
  ]);

  useEffect(
    function enableExitPrompt() {
      setEnableExitDialog(true);
    },
    [setEnableExitDialog],
  );

  useEffect(
    function syncExitPromptDirtyState() {
      setIsDirty(!isSaveDisabled);
    },
    [isSaveDisabled, setIsDirty],
  );

  useLayoutEffect(
    function registerExitDialogSubmit() {
      setExitDialogSubmitRef(handleSubmit);
    },
    [handleSubmit, setExitDialogSubmitRef],
  );

  const mutationLoading =
    updateRefundSettingsOpts.loading ||
    clearRefundReferenceTypeOpts.loading ||
    updateReturnSettingsOpts.loading ||
    clearReturnReferenceTypeOpts.loading ||
    isSaving;

  const saveButtonBarState = getMutationState(
    updateRefundSettingsOpts.called ||
      clearRefundReferenceTypeOpts.called ||
      updateReturnSettingsOpts.called ||
      clearReturnReferenceTypeOpts.called ||
      isSaving,
    mutationLoading,
    saveErrors,
  );

  return (
    <RefundsSettingsPage
      loading={isLoading}
      disabled={isLoading || mutationLoading}
      isSaveDisabled={isSaveDisabled}
      modelTypesOptions={modelTypesOptions}
      onRefundReasonChange={value =>
        setFormData(current => ({ ...current, refundReasonReferenceType: value }))
      }
      onReturnReasonChange={value =>
        setFormData(current => ({ ...current, returnReasonReferenceType: value }))
      }
      onSubmit={handleSubmit}
      refundReasonReferenceType={formData.refundReasonReferenceType}
      returnReasonReferenceType={formData.returnReasonReferenceType}
      saveButtonBarState={saveButtonBarState}
    />
  );
};
