import { gql } from "@apollo/client";

export const updateProductTranslations = gql`
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

export const updateProductVariantTranslations = gql`
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

export const updateCategoryTranslations = gql`
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

export const updateCollectionTranslations = gql`
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

export const updatePageTranslations = gql`
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
        ...PageTranslation
      }
    }
  }
`;

export const updateVoucherTranslations = gql`
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

export const updateSaleTranslations = gql`
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

export const updateAttributeTranslations = gql`
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

export const updateAttributeValueTranslations = gql`
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

export const updateShippingMethodTranslations = gql`
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

export const updateMethodItemTranslations = gql`
  mutation UpdateMenuItemTranslations(
    $id: ID!
    $input: NameTranslationInput!
    $language: LanguageCodeEnum!
  ) {
    menuItemTranslate(id: $id, input: $input, languageCode: $language) {
      errors {
        field
        message
      }
      menuItem {
        id
        name
        translation(languageCode: $language) {
          id
          language {
            language
          }
          name
        }
      }
    }
  }
`;
