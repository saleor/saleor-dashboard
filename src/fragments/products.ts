import { gql } from "@apollo/client";

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

export const fragmentPreorder = gql`
  fragment Preorder on PreorderData {
    globalThreshold
    globalSoldUnits
    endDate
  }
`;

export const priceRangeFragment = gql`
  fragment PriceRange on TaxedMoneyRange {
    start {
      net {
        ...Money
      }
    }
    stop {
      net {
        ...Money
      }
    }
  }
`;

export const fragmentProductMedia = gql`
  fragment ProductMedia on ProductMedia {
    id
    alt
    sortOrder
    url(size: 1024)
    type
    oembedData
  }
`;

export const channelListingProductWithoutPricingFragment = gql`
  fragment ChannelListingProductWithoutPricing on ProductChannelListing {
    id
    isPublished
    publishedAt
    isAvailableForPurchase
    availableForPurchaseAt
    visibleInListings
    channel {
      id
      name
      currencyCode
    }
  }
`;
export const channelListingProductFragment = gql`
  fragment ChannelListingProduct on ProductChannelListing {
    ...ChannelListingProductWithoutPricing
    pricing {
      priceRange {
        ...PriceRange
      }
    }
  }
`;

export const channelListingProductVariantFragment = gql`
  fragment ChannelListingProductVariant on ProductVariantChannelListing {
    id
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

export const productFragment = gql`
  fragment ProductWithChannelListings on Product {
    id
    name
    thumbnail(size: 1024) {
      url
    }
    productType {
      id
      name
      hasVariants
    }
    category @include(if: $includeCategories) {
      id
      name
    }
    collections @include(if: $includeCollections) {
      id
      name
    }
    channelListings {
      ...ChannelListingProductWithoutPricing
      pricing @include(if: $hasChannel) {
        priceRange {
          ...PriceRange
        }
      }
    }
  }
`;

export const productVariantAttributesFragment = gql`
  fragment ProductVariantAttributes on Product {
    id
    attributes {
      attribute {
        ...AttributeDetails
      }
      values {
        ...AttributeValueDetails
      }
    }
    productType {
      id
      variantAttributes {
        ...VariantAttribute
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
        ...AttributeValueDetails
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

export const productFragmentDetails = gql`
  fragment Product on Product {
    ...ProductVariantAttributes
    ...Metadata
    name
    slug
    description
    seoTitle
    seoDescription
    rating
    defaultVariant {
      id
    }
    category {
      id
      name
    }
    collections {
      id
      name
    }
    channelListings {
      ...ChannelListingProductWithoutPricing
    }
    media {
      ...ProductMedia
    }
    isAvailable
    variants {
      ...ProductDetailsVariant
    }
    productType {
      id
      name
      hasVariants
    }
    weight {
      ...Weight
    }
    taxClass {
      id
      name
    }
  }
`;

export const variantAttributeFragment = gql`
  fragment VariantAttribute on Attribute {
    id
    name
    slug
    inputType
    entityType
    valueRequired
    unit
    referenceTypes {
      ... on ProductType {
        id
        name
      }
      ... on PageType {
        id
        name
      }
    }
    choices(first: $firstValues, after: $afterValues, last: $lastValues, before: $beforeValues) {
      ...AttributeValueList
    }
  }
`;

export const selectedVariantAttributeFragment = gql`
  fragment SelectedVariantAttribute on SelectedAttribute {
    attribute {
      ...VariantAttribute
    }
    values {
      ...AttributeValueDetails
    }
  }
`;

export const fragmentVariant = gql`
  fragment ProductVariant on ProductVariant {
    id
    ...Metadata
    selectionAttributes: attributes(variantSelection: VARIANT_SELECTION) {
      ...SelectedVariantAttribute
    }
    nonSelectionAttributes: attributes(variantSelection: NOT_VARIANT_SELECTION) {
      ...SelectedVariantAttribute
    }
    media {
      id
      url
      type
      oembedData
    }
    name
    product {
      id
      defaultVariant {
        id
      }
      media {
        ...ProductMedia
      }
      name
      thumbnail {
        url
      }
      channelListings {
        id
        publishedAt
        isPublished
        channel {
          id
          name
          currencyCode
        }
      }
      variants {
        id
        name
        sku
        media {
          id
          url(size: 200)
          type
          oembedData
        }
      }
    }
    channelListings {
      ...ChannelListingProductVariant
    }
    sku
    stocks {
      ...Stock
    }
    trackInventory
    preorder {
      ...Preorder
    }
    weight {
      ...Weight
    }
    quantityLimitPerCustomer
  }
`;

export const searchProduct = gql`
  fragment SearchProduct on Product {
    id
    name
    productType {
      id
      name
    }
    thumbnail {
      url
    }
    channelListings {
      ...ChannelListingProductWithoutPricing
    }
    variants {
      id
      name
      sku
      product {
        id
        name
        thumbnail {
          url
          __typename
        }
        productType {
          id
          name
          __typename
        }
      }
      channelListings {
        channel {
          id
          isActive
          name
          currencyCode
        }
        price {
          amount
          currency
        }
      }
    }
    collections {
      id
    }
  }
`;

export const exportFileFragment = gql`
  fragment ExportFile on ExportFile {
    id
    status
    url
  }
`;

export const productListAttribute = gql`
  fragment ProductListAttribute on SelectedAttribute {
    attribute {
      id
    }
    values {
      ...AttributeValue
    }
  }
`;
