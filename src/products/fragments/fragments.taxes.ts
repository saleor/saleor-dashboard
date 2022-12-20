import { gql } from "@apollo/client";

export const channelListingProductWithoutPricingFragment = gql`
  fragment ChannelListingProductWithoutPricing on ProductChannelListing {
    isPublished
    publicationDate
    isAvailableForPurchase
    availableForPurchase
    visibleInListings
    channel {
      id
      name
      currencyCode
    }
  }
`;

export const fragmentProductMedia = gql`
  fragment ProductMedia on ProductMedia {
    id
    alt
    sortOrder
    url
    type
    oembedData
  }
`;

export const fragmentPreorder = gql`
  fragment Preorder on PreorderData {
    globalThreshold
    globalSoldUnits
    endDate
  }
`;

export const stockFragment = gql`
  fragment Stock on Stock {
    id
    quantity
    quantityAllocated
    warehouse {
      ...Warehouse
    }
  }
`;

export const fragmentMoney = gql`
  fragment Money on Money {
    amount
    currency
  }
`;

export const warehouseFragment = gql`
  fragment Warehouse on Warehouse {
    id
    name
  }
`;

export const channelListingProductVariantFragment = gql`
  fragment ChannelListingProductVariant on ProductVariantChannelListing {
    channel {
      id
      name
      currencyCode
    }
    price {
      ...Money
    }
    costPrice {
      ...Money
    }
    preorderThreshold {
      quantity
      soldUnits
    }
  }
`;

export const productDetailsVariant = gql`
  fragment ProductDetailsVariant on ProductVariant {
    id
    sku
    name
    attributes {
      attribute {
        id
        name
      }
      values {
        id
        name
      }
    }
    media {
      url(size: 200)
    }
    stocks {
      ...Stock
    }
    trackInventory
    preorder {
      ...Preorder
    }
    channelListings {
      ...ChannelListingProductVariant
    }
    quantityLimitPerCustomer
  }
`;

export const weightFragment = gql`
  fragment Weight on Weight {
    unit
    value
  }
`;

export const metadataFragment = gql`
  fragment MetadataItem on MetadataItem {
    key
    value
  }
  fragment Metadata on ObjectWithMetadata {
    metadata {
      ...MetadataItem
    }
    privateMetadata {
      ...MetadataItem
    }
  }
`;

export const fileFragment = gql`
  fragment File on File {
    url
    contentType
  }
`;

export const attributeValueListFragment = gql`
  fragment AttributeValueList on AttributeValueCountableConnection {
    pageInfo {
      ...PageInfo
    }
    edges {
      cursor
      node {
        ...AttributeValueDetails
      }
    }
  }
`;

export const attributeValueFragment = gql`
  fragment AttributeValue on AttributeValue {
    id
    name
    slug
    file {
      ...File
    }
    reference
    boolean
    date
    dateTime
    value
  }
`;

export const attributeValueDetailsFragment = gql`
  ${attributeValueFragment}
  fragment AttributeValueDetails on AttributeValue {
    ...AttributeValue
    plainText
    richText
  }
`;

export const pageInfoFragment = gql`
  fragment PageInfo on PageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
`;

export const productVariantAttributesFragment = gql`
  fragment ProductVariantAttributes on Product {
    id
    attributes {
      attribute {
        id
        slug
        name
        inputType
        entityType
        valueRequired
        unit
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueList
        }
      }
      values {
        ...AttributeValueDetails
      }
    }
    productType {
      id
      variantAttributes {
        id
        name
        inputType
        valueRequired
        unit
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueList
        }
      }
    }
    channelListings {
      channel {
        id
        name
        currencyCode
      }
    }
  }
`;
