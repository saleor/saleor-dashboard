/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardSettingsUpdateInput, GiftCardSettingsErrorCode, GiftCardSettingsExpiryTypeEnum, TimePeriodTypeEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: GiftCardSettingsUpdate
// ====================================================

export interface GiftCardSettingsUpdate_giftCardSettingsUpdate_errors {
  __typename: "GiftCardSettingsError";
  code: GiftCardSettingsErrorCode;
  field: string | null;
}

export interface GiftCardSettingsUpdate_giftCardSettingsUpdate_giftCardSettings_expiryPeriod {
  __typename: "TimePeriod";
  type: TimePeriodTypeEnum;
  amount: number;
}

export interface GiftCardSettingsUpdate_giftCardSettingsUpdate_giftCardSettings {
  __typename: "GiftCardSettings";
  expiryType: GiftCardSettingsExpiryTypeEnum;
  expiryPeriod: GiftCardSettingsUpdate_giftCardSettingsUpdate_giftCardSettings_expiryPeriod | null;
}

export interface GiftCardSettingsUpdate_giftCardSettingsUpdate {
  __typename: "GiftCardSettingsUpdate";
  errors: GiftCardSettingsUpdate_giftCardSettingsUpdate_errors[];
  giftCardSettings: GiftCardSettingsUpdate_giftCardSettingsUpdate_giftCardSettings | null;
}

export interface GiftCardSettingsUpdate {
  giftCardSettingsUpdate: GiftCardSettingsUpdate_giftCardSettingsUpdate | null;
}

export interface GiftCardSettingsUpdateVariables {
  input: GiftCardSettingsUpdateInput;
}
