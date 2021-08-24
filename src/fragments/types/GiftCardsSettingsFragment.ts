/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GiftCardSettingsExpiryTypeEnum, TimePeriodTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: GiftCardsSettingsFragment
// ====================================================

export interface GiftCardsSettingsFragment_expiryPeriod {
  __typename: "TimePeriod";
  type: TimePeriodTypeEnum;
  amount: number;
}

export interface GiftCardsSettingsFragment {
  __typename: "GiftCardSettings";
  expiryType: GiftCardSettingsExpiryTypeEnum;
  expiryPeriod: GiftCardsSettingsFragment_expiryPeriod | null;
}
