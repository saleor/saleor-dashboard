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

export const channelListingProductFragment = gql`
  fragment ChannelListingProductFragment on ProductChannelListing {
    isPublished
    publicationDate
    discountedPrice {
      amount
      currency
    }
    channel {
      id
      name
      currencyCode
    }
  }
`;

export const productFragment = gql`
  ${channelListingProductFragment}
  fragment ProductFragment on Product {
    id
    name
    thumbnail {
      url
    }
    productType {
      id
      name
      hasVariants
    }
    channelListing {
      ...ChannelListingProductFragment
    }
  }
`;

export const productVariantAttributesFragment = gql`
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
    channelListing {
      channel {
        id
        name
        currencyCode
      }
      discountedPrice {
        amount
        currency
      }
    }
  }
`;

export const productFragmentDetails = gql`
  ${fragmentProductImage}
  ${fragmentMoney}
  ${productVariantAttributesFragment}
  ${stockFragment}
  ${channelListingProductFragment}
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
      ...ChannelListingProductFragment
    }
    images {
      ...ProductImageFragment
    }
    variants {
      id
      sku
      name
      margin
      stocks {
        ...StockFragment
      }
      trackInventory
      channelListing {
        channel {
          id
          name
          currencyCode
        }
        price {
          amount
          currency
        }
      }
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
