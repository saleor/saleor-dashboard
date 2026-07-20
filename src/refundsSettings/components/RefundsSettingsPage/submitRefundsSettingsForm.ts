import {
  type RefundReasonReferenceClearMutationFn,
  type RefundSettingsUpdateMutationFn,
  type ReturnReasonReferenceClearMutationFn,
  type ReturnSettingsUpdateMutationFn,
} from "@dashboard/graphql";
import { extractMutationErrors } from "@dashboard/misc";

import { getChangedReasonReferenceFields } from "./formData";
import { type RefundsSettingsFormData } from "./types";

type RefundsSettingsMutationError = {
  code: string;
  message?: string | null;
};

export interface RefundsSettingsSubmitResult {
  allErrors: RefundsSettingsMutationError[];
}

interface SubmitRefundsSettingsFormParams {
  formData: RefundsSettingsFormData;
  initialFormData: RefundsSettingsFormData;
  updateRefundSettings: RefundSettingsUpdateMutationFn;
  clearRefundReferenceType: RefundReasonReferenceClearMutationFn;
  updateReturnSettings: ReturnSettingsUpdateMutationFn;
  clearReturnReferenceType: ReturnReasonReferenceClearMutationFn;
}

export async function submitRefundsSettingsForm({
  formData,
  initialFormData,
  updateRefundSettings,
  clearRefundReferenceType,
  updateReturnSettings,
  clearReturnReferenceType,
}: SubmitRefundsSettingsFormParams): Promise<RefundsSettingsSubmitResult> {
  const changedFields = getChangedReasonReferenceFields(formData, initialFormData);

  if (!changedFields.length) {
    return { allErrors: [] };
  }

  const mutationTasks = changedFields.map(field => {
    const value = formData[field];

    if (field === "refundReasonReferenceType") {
      return value
        ? extractMutationErrors(
            updateRefundSettings({
              variables: {
                refundSettingsInput: {
                  refundReasonReferenceType: value,
                },
              },
            }),
          )
        : extractMutationErrors(clearRefundReferenceType());
    }

    return value
      ? extractMutationErrors(
          updateReturnSettings({
            variables: {
              returnSettingsInput: {
                returnReasonReferenceType: value,
              },
            },
          }),
        )
      : extractMutationErrors(clearReturnReferenceType());
  });

  const results = await Promise.all(mutationTasks);

  return {
    allErrors: results.flat() as RefundsSettingsMutationError[],
  };
}
