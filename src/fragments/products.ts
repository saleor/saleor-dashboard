import gql from "graphql-tag";

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
    productType {
      id
      name
      hasVariants
    }
    channelListing {
      channel {
        id
        name
      }
      isPublished
      publicationDate
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
        values {
          id
          name
          slug
        }
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
  fragment Product on Product {
    ...ProductVariantAttributesFragment
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
    isAvailable
    chargeTaxes
    channelListing {
      channel {
        id
        name
      }
      isPublished
      publicationDate
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
  }
`;

export const fragmentVariant = gql`
  ${fragmentMoney}
  ${fragmentProductImage}
  ${stockFragment}
  fragment ProductVariant on ProductVariant {
    id
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
    channelListing {
      channel {
        id
        name
        currencyCode
      }
      costPrice {
        ...Money
      }
      price {
        ...Money
      }
    }
    sku
    stocks {
      ...StockFragment
    }
    trackInventory
  }
`;
