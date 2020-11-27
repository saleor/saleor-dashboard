import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import {
  attributeTranslationFragment,
  categoryTranslationFragment,
  collectionTranslationFragment,
  pageTranslationFragment,
  productTranslationFragment,
  saleTranslationFragment,
  shippingMethodTranslationFragment,
  voucherTranslationFragment
} from "@saleor/fragments/translations";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import {
  AttributeTranslationDetails,
  AttributeTranslationDetailsVariables
} from "./types/AttributeTranslationDetails";
import {
  AttributeTranslations,
  AttributeTranslationsVariables
} from "./types/AttributeTranslations";
import {
  CategoryTranslationDetails,
  CategoryTranslationDetailsVariables
} from "./types/CategoryTranslationDetails";
import {
  CategoryTranslations,
  CategoryTranslationsVariables
} from "./types/CategoryTranslations";
import {
  CollectionTranslationDetails,
  CollectionTranslationDetailsVariables
} from "./types/CollectionTranslationDetails";
import {
  CollectionTranslations,
  CollectionTranslationsVariables
} from "./types/CollectionTranslations";
import {
  PageTranslationDetails,
  PageTranslationDetailsVariables
} from "./types/PageTranslationDetails";
import {
  PageTranslations,
  PageTranslationsVariables
} from "./types/PageTranslations";
import {
  ProductTranslationDetails,
  ProductTranslationDetailsVariables
} from "./types/ProductTranslationDetails";
import {
  ProductTranslations,
  ProductTranslationsVariables
} from "./types/ProductTranslations";
import {
  SaleTranslationDetails,
  SaleTranslationDetailsVariables
} from "./types/SaleTranslationDetails";
import {
  SaleTranslations,
  SaleTranslationsVariables
} from "./types/SaleTranslations";
import {
  ShippingMethodTranslationDetails,
  ShippingMethodTranslationDetailsVariables
} from "./types/ShippingMethodTranslationDetails";
import {
  ShippingMethodTranslations,
  ShippingMethodTranslationsVariables
} from "./types/ShippingMethodTranslations";
import {
  VoucherTranslationDetails,
  VoucherTranslationDetailsVariables
} from "./types/VoucherTranslationDetails";
import {
  VoucherTranslations,
  VoucherTranslationsVariables
} from "./types/VoucherTranslations";

const categoryTranslations = gql`
  ${pageInfoFragment}
  ${categoryTranslationFragment}
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
export const TypedCategoryTranslations = TypedQuery<
  CategoryTranslations,
  CategoryTranslationsVariables
>(categoryTranslations);

const collectionTranslations = gql`
  ${pageInfoFragment}
  ${collectionTranslationFragment}
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
export const TypedCollectionTranslations = TypedQuery<
  CollectionTranslations,
  CollectionTranslationsVariables
>(collectionTranslations);

const productTranslations = gql`
  ${pageInfoFragment}
  ${productTranslationFragment}
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
export const TypedProductTranslations = TypedQuery<
  ProductTranslations,
  ProductTranslationsVariables
>(productTranslations);

const pageTranslations = gql`
  ${pageInfoFragment}
  ${pageTranslationFragment}
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
export const TypedPageTranslations = TypedQuery<
  PageTranslations,
  PageTranslationsVariables
>(pageTranslations);

const voucherTranslations = gql`
  ${pageInfoFragment}
  ${voucherTranslationFragment}
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
export const TypedVoucherTranslations = TypedQuery<
  VoucherTranslations,
  VoucherTranslationsVariables
>(voucherTranslations);

const saleTranslations = gql`
  ${pageInfoFragment}
  ${saleTranslationFragment}
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
export const TypedSaleTranslations = TypedQuery<
  SaleTranslations,
  SaleTranslationsVariables
>(saleTranslations);

const attributeTranslations = gql`
  ${pageInfoFragment}
  ${attributeTranslationFragment}
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
export const TypedAttributeTranslations = TypedQuery<
  AttributeTranslations,
  AttributeTranslationsVariables
>(attributeTranslations);

const shippingMethodTranslations = gql`
  ${pageInfoFragment}
  ${shippingMethodTranslationFragment}
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
export const TypedShippingMethodTranslations = TypedQuery<
  ShippingMethodTranslations,
  ShippingMethodTranslationsVariables
>(shippingMethodTranslations);

const productTranslationDetails = gql`
  ${productTranslationFragment}
  query ProductTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: PRODUCT, id: $id) {
      ...ProductTranslationFragment
    }
  }
`;
export const useProductTranslationDetails = makeQuery<
  ProductTranslationDetails,
  ProductTranslationDetailsVariables
>(productTranslationDetails);

const categoryTranslationDetails = gql`
  ${categoryTranslationFragment}
  query CategoryTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: CATEGORY, id: $id) {
      ...CategoryTranslationFragment
    }
  }
`;
export const useCategoryTranslationDetails = makeQuery<
  CategoryTranslationDetails,
  CategoryTranslationDetailsVariables
>(categoryTranslationDetails);

const collectionTranslationDetails = gql`
  ${collectionTranslationFragment}
  query CollectionTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(id: $id, kind: COLLECTION) {
      ...CollectionTranslationFragment
    }
  }
`;
export const useCollectionTranslationDetails = makeQuery<
  CollectionTranslationDetails,
  CollectionTranslationDetailsVariables
>(collectionTranslationDetails);

const pageTranslationDetails = gql`
  ${pageTranslationFragment}
  query PageTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(id: $id, kind: PAGE) {
      ...PageTranslationFragment
    }
  }
`;
export const usePageTranslationDetails = makeQuery<
  PageTranslationDetails,
  PageTranslationDetailsVariables
>(pageTranslationDetails);

const saleTranslationDetails = gql`
  ${saleTranslationFragment}
  query SaleTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: SALE, id: $id) {
      ...SaleTranslationFragment
    }
  }
`;
export const useSaleTranslationDetails = makeQuery<
  SaleTranslationDetails,
  SaleTranslationDetailsVariables
>(saleTranslationDetails);

const voucherTranslationDetails = gql`
  ${voucherTranslationFragment}
  query VoucherTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: VOUCHER, id: $id) {
      ...VoucherTranslationFragment
    }
  }
`;
export const useVoucherTranslationDetails = makeQuery<
  VoucherTranslationDetails,
  VoucherTranslationDetailsVariables
>(voucherTranslationDetails);

const attributeTranslationDetails = gql`
  ${attributeTranslationFragment}
  query AttributeTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
    translation(kind: ATTRIBUTE, id: $id) {
      ...AttributeTranslationFragment
    }
  }
`;
export const useAttributeTranslationDetails = makeQuery<
  AttributeTranslationDetails,
  AttributeTranslationDetailsVariables
>(attributeTranslationDetails);

const shippingMethodTranslationDetails = gql`
  ${shippingMethodTranslationFragment}
  query ShippingMethodTranslationDetails(
    $id: ID!
    $language: LanguageCodeEnum!
  ) {
    translation(kind: SHIPPING_METHOD, id: $id) {
      ...ShippingMethodTranslationFragment
    }
  }
`;
export const useShippingMethodTranslationDetails = makeQuery<
  ShippingMethodTranslationDetails,
  ShippingMethodTranslationDetailsVariables
>(shippingMethodTranslationDetails);
