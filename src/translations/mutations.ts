import { gql } from "@apollo/client";
import {
  attributeTranslateErrorFragment,
  attributeValueTranslateErrorFragment,
  categoryTranslateErrorFragment,
  collectionTranslateErrorFragment,
  pageTranslateErrorFragment,
  productTranslateErrorFragment,
  productVariantTranslateErrorFragment,
  saleTranslateErrorFragment,
  shippingPriceTranslateErrorFragment,
  voucherTranslateErrorFragment
} from "@saleor/fragments/errors";
import { pageTranslationFragment } from "@saleor/fragments/translations";

import { TypedMutation } from "../mutations";
import {
  UpdateAttributeTranslations,
  UpdateAttributeTranslationsVariables
} from "./types/UpdateAttributeTranslations";
import {
  UpdateAttributeValueTranslations,
  UpdateAttributeValueTranslationsVariables
} from "./types/UpdateAttributeValueTranslations";
import {
  UpdateCategoryTranslations,
  UpdateCategoryTranslationsVariables
} from "./types/UpdateCategoryTranslations";
import {
  UpdateCollectionTranslations,
  UpdateCollectionTranslationsVariables
} from "./types/UpdateCollectionTranslations";
import {
  UpdatePageTranslations,
  UpdatePageTranslationsVariables
} from "./types/UpdatePageTranslations";
import {
  UpdateProductTranslations,
  UpdateProductTranslationsVariables
} from "./types/UpdateProductTranslations";
import {
  UpdateProductVariantTranslations,
  UpdateProductVariantTranslationsVariables
} from "./types/UpdateProductVariantTranslations";
import {
  UpdateSaleTranslations,
  UpdateSaleTranslationsVariables
} from "./types/UpdateSaleTranslations";
import {
  UpdateShippingMethodTranslations,
  UpdateShippingMethodTranslationsVariables
} from "./types/UpdateShippingMethodTranslations";
import {
  UpdateVoucherTranslations,
  UpdateVoucherTranslationsVariables
} from "./types/UpdateVoucherTranslations";

const updateProductTranslations = gql`
  ${productTranslateErrorFragment}
  mutation UpdateProductTranslations(
    $id: ID!
    $input: TranslationInput!
    $language: LanguageCodeEnum!
  ) {
    productTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...ProductTranslateErrorFragment
      }
      product {
        id
        name
        description
        seoDescription
        seoTitle
        translation(languageCode: $language) {
          id
          description
          language {
            code
            language
          }
          name
          seoDescription
          seoTitle
        }
      }
    }
  }
`;
export const TypedUpdateProductTranslations = TypedMutation<
  UpdateProductTranslations,
  UpdateProductTranslationsVariables
>(updateProductTranslations);

const updateProductVariantTranslations = gql`
  ${productVariantTranslateErrorFragment}
  mutation UpdateProductVariantTranslations(
    $id: ID!
    $input: NameTranslationInput!
    $language: LanguageCodeEnum!
  ) {
    productVariantTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...ProductVariantTranslateErrorFragment
      }
      productVariant {
        id
        name
        translation(languageCode: $language) {
          id
          name
          language {
            code
            language
          }
        }
      }
    }
  }
`;
export const TypedUpdateProductVariantTranslations = TypedMutation<
  UpdateProductVariantTranslations,
  UpdateProductVariantTranslationsVariables
>(updateProductVariantTranslations);

const updateCategoryTranslations = gql`
  ${categoryTranslateErrorFragment}
  mutation UpdateCategoryTranslations(
    $id: ID!
    $input: TranslationInput!
    $language: LanguageCodeEnum!
  ) {
    categoryTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...CategoryTranslateErrorFragment
      }
      category {
        id
        name
        description
        seoDescription
        seoTitle
        translation(languageCode: $language) {
          id
          description
          language {
            language
          }
          name
          seoDescription
          seoTitle
        }
      }
    }
  }
`;

export const TypedUpdateCategoryTranslations = TypedMutation<
  UpdateCategoryTranslations,
  UpdateCategoryTranslationsVariables
>(updateCategoryTranslations);

const updateCollectionTranslations = gql`
  ${collectionTranslateErrorFragment}
  mutation UpdateCollectionTranslations(
    $id: ID!
    $input: TranslationInput!
    $language: LanguageCodeEnum!
  ) {
    collectionTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...CollectionTranslateErrorFragment
      }
      collection {
        id
        name
        description
        seoDescription
        seoTitle
        translation(languageCode: $language) {
          id
          description
          language {
            language
          }
          name
          seoDescription
          seoTitle
        }
      }
    }
  }
`;

export const TypedUpdateCollectionTranslations = TypedMutation<
  UpdateCollectionTranslations,
  UpdateCollectionTranslationsVariables
>(updateCollectionTranslations);

const updatePageTranslations = gql`
  ${pageTranslateErrorFragment}
  ${pageTranslationFragment}
  mutation UpdatePageTranslations(
    $id: ID!
    $input: PageTranslationInput!
    $language: LanguageCodeEnum!
  ) {
    pageTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...PageTranslateErrorFragment
      }
      page {
        ...PageTranslationFragment
      }
    }
  }
`;
export const TypedUpdatePageTranslations = TypedMutation<
  UpdatePageTranslations,
  UpdatePageTranslationsVariables
>(updatePageTranslations);

const updateVoucherTranslations = gql`
  ${voucherTranslateErrorFragment}
  mutation UpdateVoucherTranslations(
    $id: ID!
    $input: NameTranslationInput!
    $language: LanguageCodeEnum!
  ) {
    voucherTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...VoucherTranslateErrorFragment
      }
      voucher {
        id
        name
        translation(languageCode: $language) {
          id
          language {
            code
            language
          }
          name
        }
      }
    }
  }
`;
export const TypedUpdateVoucherTranslations = TypedMutation<
  UpdateVoucherTranslations,
  UpdateVoucherTranslationsVariables
>(updateVoucherTranslations);

const updateSaleTranslations = gql`
  ${saleTranslateErrorFragment}
  mutation UpdateSaleTranslations(
    $id: ID!
    $input: NameTranslationInput!
    $language: LanguageCodeEnum!
  ) {
    saleTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...SaleTranslateErrorFragment
      }
      sale {
        id
        name
        translation(languageCode: $language) {
          id
          language {
            code
            language
          }
          name
        }
      }
    }
  }
`;
export const TypedUpdateSaleTranslations = TypedMutation<
  UpdateSaleTranslations,
  UpdateSaleTranslationsVariables
>(updateSaleTranslations);

const updateAttributeTranslations = gql`
  ${attributeTranslateErrorFragment}
  mutation UpdateAttributeTranslations(
    $id: ID!
    $input: NameTranslationInput!
    $language: LanguageCodeEnum!
  ) {
    attributeTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...AttributeTranslateErrorFragment
      }
      attribute {
        id
        name
        translation(languageCode: $language) {
          id
          name
        }
      }
    }
  }
`;
export const TypedUpdateAttributeTranslations = TypedMutation<
  UpdateAttributeTranslations,
  UpdateAttributeTranslationsVariables
>(updateAttributeTranslations);

const updateAttributeValueTranslations = gql`
  ${attributeValueTranslateErrorFragment}
  mutation UpdateAttributeValueTranslations(
    $id: ID!
    $input: AttributeValueTranslationInput!
    $language: LanguageCodeEnum!
  ) {
    attributeValueTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...AttributeValueTranslateErrorFragment
      }
      attributeValue {
        id
        name
        richText
        translation(languageCode: $language) {
          id
          name
          richText
        }
      }
    }
  }
`;
export const TypedUpdateAttributeValueTranslations = TypedMutation<
  UpdateAttributeValueTranslations,
  UpdateAttributeValueTranslationsVariables
>(updateAttributeValueTranslations);

const updateShippingMethodTranslations = gql`
  ${shippingPriceTranslateErrorFragment}
  mutation UpdateShippingMethodTranslations(
    $id: ID!
    $input: ShippingPriceTranslationInput!
    $language: LanguageCodeEnum!
  ) {
    shippingPriceTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        ...ShippingPriceTranslateErrorFragment
      }
      shippingMethod {
        id
        name
        description
        translation(languageCode: $language) {
          id
          language {
            language
          }
          name
          description
        }
      }
    }
  }
`;

export const TypedUpdateShippingMethodTranslations = TypedMutation<
  UpdateShippingMethodTranslations,
  UpdateShippingMethodTranslationsVariables
>(updateShippingMethodTranslations);
