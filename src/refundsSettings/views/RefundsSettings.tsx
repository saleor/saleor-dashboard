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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

export const RefundsSettings = (): JSX.Element => {
  const intl = useIntl();
  const notify = useNotifier();
  const { loading: refundSettingsLoading, data: refundSettingsData } = useRefundSettingsQuery();
  const { loading: returnSettingsLoading, data: returnSettingsData } = useReturnSettingsQuery();
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

  useEffect(
    function syncFormWithServer() {
      setFormData(initialFormData);
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

    const result = await submitRefundsSettingsForm({
      formData,
      initialFormData,
      updateRefundSettings,
      clearRefundReferenceType,
      updateReturnSettings,
      clearReturnReferenceType,
    });

    setSaveErrors(result.allErrors);
    setIsSaving(false);

    if (!result.allErrors.length) {
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
  }, [
    clearRefundReferenceType,
    clearReturnReferenceType,
    formData,
    initialFormData,
    intl,
    notify,
    updateRefundSettings,
    updateReturnSettings,
  ]);

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
