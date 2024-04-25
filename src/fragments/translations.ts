import { gql } from "@apollo/client";

export const attributeValueTranslatableFragment = gql`
  fragment AttributeValueTranslatable on AttributeValueTranslatableContent {
    id
    name
    plainText
    richText
    attributeValue {
      id
    }
    attribute {
      id
      name
    }
    translation(languageCode: $language) {
      id
      name
      plainText
      richText
      language {
        code
        language
      }
    }
  }
`;

export const categoryTranslationFragment = gql`
  fragment CategoryTranslation on CategoryTranslatableContent {
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
    category {
      id
      name
      description
      seoDescription
      seoTitle
    }
  }
`;
export const collectionTranslationFragment = gql`
  fragment CollectionTranslation on CollectionTranslatableContent {
    collection {
      id
      name
      description
      seoDescription
      seoTitle
    }
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
`;

export const productTranslationFragment = gql`
  fragment ProductTranslation on ProductTranslatableContent {
    product {
      id
      name
      description
      seoDescription
      seoTitle
    }
    translation(languageCode: $language) {
      id
      seoTitle
      seoDescription
      name
      description
      language {
        code
        language
      }
    }
    attributeValues {
      ...AttributeValueTranslatable
    }
  }
`;

export const productVariantTranslationFragment = gql`
  fragment ProductVariantTranslation on ProductVariantTranslatableContent {
    productVariant {
      id
    }
    name
    translation(languageCode: $language) {
      id
      name
      language {
        code
        language
      }
    }
    attributeValues {
      ...AttributeValueTranslatable
    }
  }
`;

export const saleTranslationFragment = gql`
  fragment SaleTranslation on SaleTranslatableContent {
    sale {
      id
      name
    }
    translation(languageCode: $language) {
      id
      language {
        code
        language
      }
      name
    }
  }
`;
export const voucherTranslationFragment = gql`
  fragment VoucherTranslation on VoucherTranslatableContent {
    name
    voucher {
      id
      name
    }
    translation(languageCode: $language) {
      id
      language {
        code
        language
      }
      name
    }
  }
`;
export const shippingMethodTranslationFragment = gql`
  fragment ShippingMethodTranslation on ShippingMethodTranslatableContent {
    id
    name
    description
    shippingMethod {
      id
    }
    translation(languageCode: $language) {
      id
      language {
        code
        language
      }
      name
      description
    }
  }
`;

export const pageTranslationFragment = gql`
  fragment PageTranslation on PageTranslatableContent {
    page {
      id
      content
      seoDescription
      seoTitle
      title
    }
    translation(languageCode: $language) {
      id
      content
      seoDescription
      seoTitle
      title
      language {
        code
        language
      }
    }
    attributeValues {
      ...AttributeValueTranslatable
    }
  }
`;
export const pageTranslatableFragment = gql`
  fragment PageTranslatable on PageTranslatableContent {
    id
    content
    seoDescription
    seoTitle
    title
    translation(languageCode: $language) {
      id
      content
      seoDescription
      seoTitle
      title
      language {
        code
        language
      }
    }
  }
`;

export const attributeChoicesTranslationFragment = gql`
  fragment AttributeChoicesTranslation on AttributeValueCountableConnection {
    pageInfo {
      ...PageInfo
    }
    edges {
      cursor
      node {
        id
        name
        plainText
        richText
        inputType
        translation(languageCode: $language) {
          id
          name
          plainText
          richText
        }
      }
    }
  }
`;

export const attributeTranslationFragment = gql`
  fragment AttributeTranslation on AttributeTranslatableContent {
    id
    name
    translation(languageCode: $language) {
      id
      name
    }
    attribute {
      id
      name
      inputType
    }
  }
`;

export const attributeTranslationDetailsFragment = gql`
  fragment AttributeTranslationDetails on AttributeTranslatableContent {
    translation(languageCode: $language) {
      id
      name
    }
    attribute {
      id
      name
      inputType
      withChoices
      choices(first: $firstValues, after: $afterValues, last: $lastValues, before: $beforeValues) {
        ...AttributeChoicesTranslation
      }
    }
  }
`;

export const menuItemTranslationFragment = gql`
  fragment MenuItemTranslation on MenuItemTranslatableContent {
    translation(languageCode: $language) {
      id
      language {
        language
      }
      name
    }
    menuItem {
      id
      name
    }
  }
`;
