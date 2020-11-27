import gql from "graphql-tag";

export const categoryTranslationFragment = gql`
  fragment CategoryTranslationFragment on CategoryTranslatableContent {
    translation(languageCode: $language) {
      id
      descriptionJson
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
      descriptionJson
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
      descriptionJson
      seoDescription
      seoTitle
    }
    translation(languageCode: $language) {
      id
      descriptionJson
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
      descriptionJson
      seoDescription
      seoTitle
    }
    translation(languageCode: $language) {
      id
      descriptionJson
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
    shippingMethod {
      id
    }
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
`;

export const pageTranslationFragment = gql`
  fragment PageTranslationFragment on PageTranslatableContent {
    page {
      id
      contentJson
      seoDescription
      seoTitle
      title
    }
    translation(languageCode: $language) {
      id
      contentJson
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
    contentJson
    seoDescription
    seoTitle
    title

    translation(languageCode: $language) {
      id
      contentJson
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

export const attributeTranslationFragment = gql`
  fragment AttributeTranslationFragment on AttributeTranslatableContent {
    translation(languageCode: $language) {
      id
      name
    }
    attribute {
      id
      name
      values {
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
