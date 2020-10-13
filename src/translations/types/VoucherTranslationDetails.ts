/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: VoucherTranslationDetails
// ====================================================

export interface VoucherTranslationDetails_translation_ProductTranslatableContent {
  __typename: "ProductTranslatableContent" | "CollectionTranslatableContent" | "CategoryTranslatableContent" | "AttributeTranslatableContent" | "AttributeValueTranslatableContent" | "ProductVariantTranslatableContent" | "PageTranslatableContent" | "ShippingMethodTranslatableContent" | "SaleTranslatableContent" | "MenuItemTranslatableContent";
}

export interface VoucherTranslationDetails_translation_VoucherTranslatableContent_voucher {
  __typename: "Voucher";
  id: string;
  name: string | null;
}

export interface VoucherTranslationDetails_translation_VoucherTranslatableContent_translation_language {
  __typename: "LanguageDisplay";
  code: LanguageCodeEnum;
  language: string;
}

export interface VoucherTranslationDetails_translation_VoucherTranslatableContent_translation {
  __typename: "VoucherTranslation";
  id: string;
  language: VoucherTranslationDetails_translation_VoucherTranslatableContent_translation_language;
  name: string | null;
}

export interface VoucherTranslationDetails_translation_VoucherTranslatableContent {
  __typename: "VoucherTranslatableContent";
  voucher: VoucherTranslationDetails_translation_VoucherTranslatableContent_voucher | null;
  translation: VoucherTranslationDetails_translation_VoucherTranslatableContent_translation | null;
}

export type VoucherTranslationDetails_translation = VoucherTranslationDetails_translation_ProductTranslatableContent | VoucherTranslationDetails_translation_VoucherTranslatableContent;

export interface VoucherTranslationDetails {
  translation: VoucherTranslationDetails_translation | null;
}

export interface VoucherTranslationDetailsVariables {
  id: string;
  language: LanguageCodeEnum;
}
