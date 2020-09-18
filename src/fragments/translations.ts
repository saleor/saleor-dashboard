import gql from "graphql-tag";

export const categoryTranslationFragment = gql`
  fragment CategoryTranslationFragment on Category {
    id
    name
    descriptionJson
    seoDescription
    seoTitle
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
export const collectionTranslationFragment = gql`
  fragment CollectionTranslationFragment on Collection {
    id
    name
    descriptionJson
    seoDescription
    seoTitle
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
  fragment ProductTranslationFragment on Product {
    id
    name
    descriptionJson
    seoDescription
    seoTitle
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
  fragment SaleTranslationFragment on Sale {
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
export const voucherTranslationFragment = gql`
  fragment VoucherTranslationFragment on Voucher {
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
export const shippingMethodTranslationFragment = gql`
  fragment ShippingMethodTranslationFragment on ShippingMethod {
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
  fragment PageTranslationFragment on Page {
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
export const productTypeTranslationFragment = gql`
  fragment AttributeTranslationFragment on Attribute {
    id
    name
    translation(languageCode: $language) {
      id
      name
    }
    values {
      id
      name
      translation(languageCode: $language) {
        id
        name
      }
    }
  }
  fragment ProductTypeTranslationFragment on ProductType {
    id
    name
    productAttributes {
      ...AttributeTranslationFragment
    }
    variantAttributes {
      ...AttributeTranslationFragment
    }
  }
`;
