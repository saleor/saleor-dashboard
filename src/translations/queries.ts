import { gql } from "@apollo/client";

export const categoryTranslations = gql`
  query CategoryTranslations(
    $language: LanguageCodeEnum!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    translations(
      kind: CATEGORY
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...CategoryTranslationFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const collectionTranslations = gql`
  query CollectionTranslations(
    $language: LanguageCodeEnum!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    translations(
      kind: COLLECTION
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...CollectionTranslationFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const productTranslations = gql`
  query ProductTranslations(
    $language: LanguageCodeEnum!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    translations(
      kind: PRODUCT
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...ProductTranslationFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const pageTranslations = gql`
  query PageTranslations(
    $language: LanguageCodeEnum!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    translations(
      kind: PAGE
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...PageTranslationFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const voucherTranslations = gql`
  query VoucherTranslations(
    $language: LanguageCodeEnum!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    translations(
      kind: VOUCHER
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...VoucherTranslationFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const saleTranslations = gql`
  query SaleTranslations(
    $language: LanguageCodeEnum!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    translations(
      kind: SALE
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...SaleTranslationFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const attributeTranslations = gql`
  query AttributeTranslations(
    $language: LanguageCodeEnum!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    translations(
      kind: ATTRIBUTE
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...AttributeTranslationFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const shippingMethodTranslations = gql`
  query ShippingMethodTranslations(
    $language: LanguageCodeEnum!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    translations(
      kind: SHIPPING_METHOD
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          ...ShippingMethodTranslationFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const productTranslationDetails = gql`
  query ProductTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: PRODUCT, id: $id) {
      ...ProductTranslationFragment
    }
  }
`;

export const productVariantList = gql`
  query ProductVariantList($id: ID!) {
    product(id: $id) {
      id
      variants {
        id
        name
        sku
      }
    }
  }
`;

export const productVariantTranslationDetails = gql`
  query ProductVariantTranslationDetails(
    $id: ID!
    $language: LanguageCodeEnum!
  ) {
    translation(kind: VARIANT, id: $id) {
      ...ProductVariantTranslationFragment
    }
  }
`;

export const categoryTranslationDetails = gql`
  query CategoryTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: CATEGORY, id: $id) {
      ...CategoryTranslationFragment
    }
  }
`;

export const collectionTranslationDetails = gql`
  query CollectionTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(id: $id, kind: COLLECTION) {
      ...CollectionTranslationFragment
    }
  }
`;

export const pageTranslationDetails = gql`
  query PageTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(id: $id, kind: PAGE) {
      ...PageTranslationFragment
    }
  }
`;

export const saleTranslationDetails = gql`
  query SaleTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: SALE, id: $id) {
      ...SaleTranslationFragment
    }
  }
`;

export const voucherTranslationDetails = gql`
  query VoucherTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: VOUCHER, id: $id) {
      ...VoucherTranslationFragment
    }
  }
`;

export const attributeTranslationDetails = gql`
  query AttributeTranslationDetails(
    $id: ID!
    $language: LanguageCodeEnum!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    translation(kind: ATTRIBUTE, id: $id) {
      ...AttributeTranslationDetailsFragment
    }
  }
`;

export const shippingMethodTranslationDetails = gql`
  query ShippingMethodTranslationDetails(
    $id: ID!
    $language: LanguageCodeEnum!
  ) {
    translation(kind: SHIPPING_METHOD, id: $id) {
      ...ShippingMethodTranslationFragment
    }
  }
`;
