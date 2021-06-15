import gql from "graphql-tag";

import { pageInfoFragment } from "./pageInfo";

export const categoryTranslationFragment = gql`
  fragment CategoryTranslationFragment on CategoryTranslatableContent {
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
  fragment CollectionTranslationFragment on CollectionTranslatableContent {
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
  fragment ProductTranslationFragment on ProductTranslatableContent {
    product {
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
        code
        language
      }
      name
      seoDescription
      seoTitle
    }
  }
`;
export const saleTranslationFragment = gql`
  fragment SaleTranslationFragment on SaleTranslatableContent {
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
  fragment VoucherTranslationFragment on VoucherTranslatableContent {
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
  fragment ShippingMethodTranslationFragment on ShippingMethodTranslatableContent {
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
  fragment PageTranslationFragment on PageTranslatableContent {
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
  }
`;
export const pageTranslatableFragment = gql`
  fragment PageTranslatableFragment on PageTranslatableContent {
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
  ${pageInfoFragment}
  fragment AttributeChoicesTranslationFragment on AttributeValueCountableConnection {
    pageInfo {
      ...PageInfoFragment
    }
    edges {
      cursor
      node {
        id
        name
        richText
        inputType
        translation(languageCode: $language) {
          id
          name
          richText
        }
      }
    }
  }
`;

export const attributeTranslationFragment = gql`
  fragment AttributeTranslationFragment on AttributeTranslatableContent {
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
  ${attributeChoicesTranslationFragment}
  fragment AttributeTranslationDetailsFragment on AttributeTranslatableContent {
    translation(languageCode: $language) {
      id
      name
    }
    attribute {
      id
      name
      inputType
      choices(
        first: $firstValues
        after: $afterValues
        last: $lastValues
        before: $beforeValues
      ) {
        ...AttributeChoicesTranslationFragment
      }
    }
  }
`;
