import { type RefundsSettingsFormData } from "./types";

export function getRefundsSettingsFormData(
  refundReasonReferenceTypeId: string,
  returnReasonReferenceTypeId: string,
): RefundsSettingsFormData {
  return {
    refundReasonReferenceType: refundReasonReferenceTypeId,
    returnReasonReferenceType: returnReasonReferenceTypeId,
  };
}

export function isRefundsSettingsFormPristine(
  current: RefundsSettingsFormData,
  initial: RefundsSettingsFormData,
): boolean {
  return (
    current.refundReasonReferenceType === initial.refundReasonReferenceType &&
    current.returnReasonReferenceType === initial.returnReasonReferenceType
  );
}

export function getChangedReasonReferenceFields(
  current: RefundsSettingsFormData,
  initial: RefundsSettingsFormData,
): Array<"refundReasonReferenceType" | "returnReasonReferenceType"> {
  const changedFields: Array<"refundReasonReferenceType" | "returnReasonReferenceType"> = [];

  if (current.refundReasonReferenceType !== initial.refundReasonReferenceType) {
    changedFields.push("refundReasonReferenceType");
  }

  if (current.returnReasonReferenceType !== initial.returnReasonReferenceType) {
    changedFields.push("returnReasonReferenceType");
  }

  return changedFields;
}
