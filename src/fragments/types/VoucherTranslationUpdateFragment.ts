/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: VoucherTranslationUpdateFragment
// ====================================================

export interface VoucherTranslationUpdateFragment_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface VoucherTranslationUpdateFragment_translation {
  __typename: "VoucherTranslation";
  id: string;
  language: VoucherTranslationUpdateFragment_translation_language;
  name: string | null;
}

export interface VoucherTranslationUpdateFragment {
  __typename: "Voucher";
  id: string;
  name: string | null;
  translation: VoucherTranslationUpdateFragment_translation | null;
}
