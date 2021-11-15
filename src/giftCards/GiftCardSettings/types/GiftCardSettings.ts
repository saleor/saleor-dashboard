/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardSettingsExpiryTypeEnum, TimePeriodTypeEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: GiftCardSettings
// ====================================================

export interface GiftCardSettings_giftCardSettings_expiryPeriod {
  __typename: "TimePeriod";
  type: TimePeriodTypeEnum;
  amount: number;
}

export interface GiftCardSettings_giftCardSettings {
  __typename: "GiftCardSettings";
  expiryType: GiftCardSettingsExpiryTypeEnum;
  expiryPeriod: GiftCardSettings_giftCardSettings_expiryPeriod | null;
}

export interface GiftCardSettings {
  giftCardSettings: GiftCardSettings_giftCardSettings;
}
