import gql from "graphql-tag";

import { metadataFragment } from "./metadata";
import { weightFragment } from "./weight";

export const stockFragment = gql`
  fragment StockFragment on Stock {
    id
    quantity
    quantityAllocated
    warehouse {
      id
      name
    }
  }
`;

export const fragmentMoney = gql`
  fragment Money on Money {
    amount
    currency
  }
`;

export const fragmentProductImage = gql`
  fragment ProductImageFragment on ProductImage {
    id
    alt
    sortOrder
    url
  }
`;

export const productFragment = gql`
  fragment ProductFragment on Product {
    id
    name
    thumbnail {
      url
    }
    isAvailable
    isPublished
    productType {
      id
      name
      hasVariants
    }
  }
`;

export const productVariantAttributesFragment = gql`
  ${fragmentMoney}
  fragment ProductVariantAttributesFragment on Product {
    id
    attributes {
      attribute {
        id
        slug
        name
        inputType
        valueRequired
        values {
          id
          name
          slug
        }
      }
      values {
        id
        name
        slug
      }
    }
    productType {
      id
      variantAttributes {
        id
        name
        slug
        valueRequired
        values {
          id
          name
          slug
        }
        filterableInStorefront
        visibleInStorefront
      }
    }
    pricing {
      priceRangeUndiscounted {
        start {
          gross {
            ...Money
          }
        }
        stop {
          gross {
            ...Money
          }
        }
      }
    }
  }
`;

export const productFragmentDetails = gql`
  ${fragmentProductImage}
  ${fragmentMoney}
  ${productVariantAttributesFragment}
  ${stockFragment}
  ${weightFragment}
  ${metadataFragment}
  fragment Product on Product {
    ...ProductVariantAttributesFragment
    ...MetadataFragment
    name
    descriptionJson
    seoTitle
    seoDescription
    category {
      id
      name
    }
    collections {
      id
      name
    }
    margin {
      start
      stop
    }
    purchaseCost {
      start {
        ...Money
      }
      stop {
        ...Money
      }
    }
    isAvailableForPurchase
    isAvailable
    isPublished
    chargeTaxes
    publicationDate
    pricing {
      priceRangeUndiscounted {
        start {
          gross {
            ...Money
          }
        }
        stop {
          gross {
            ...Money
          }
        }
      }
    }
    images {
      ...ProductImageFragment
    }
    variants {
      id
      sku
      name
      price {
        ...Money
      }
      margin
      stocks {
        ...StockFragment
      }
      trackInventory
    }
    productType {
      id
      name
      hasVariants
    }
    weight {
      ...WeightFragment
    }
    availableForPurchase
    visibleInListings
  }
`;

export const fragmentVariant = gql`
  ${fragmentMoney}
  ${fragmentProductImage}
  ${stockFragment}
  ${weightFragment}
  ${metadataFragment}
  fragment ProductVariant on ProductVariant {
    id
    ...MetadataFragment
    attributes {
      attribute {
        id
        name
        slug
        valueRequired
        values {
          id
          name
          slug
        }
      }
      values {
        id
        name
        slug
      }
    }
    costPrice {
      ...Money
    }
    images {
      id
      url
    }
    name
    price {
      ...Money
    }
    product {
      id
      images {
        ...ProductImageFragment
      }
      name
      thumbnail {
        url
      }
      productType {
        id
      }
      variants {
        id
        name
        sku
        images {
          id
          url
        }
      }
    }
    sku
    stocks {
      ...StockFragment
    }
    trackInventory
    weight {
      ...WeightFragment
    }
  }
`;

export const exportFileFragment = gql`
  fragment ExportFileFragment on ExportFile {
    id
    status
    url
  }
`;
