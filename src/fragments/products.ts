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
    url
    type
    oembedData
  }
`;

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
    thumbnail {
      url
    }
    productType {
      id
      name
      hasVariants
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
      variantAttributes(variantSelection: VARIANT_SELECTION) {
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

export const productDetailsVariant = gql`
  fragment ProductDetailsVariant on ProductVariant {
    id
    sku
    name
    margin
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
    chargeTaxes
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
      taxType {
        ...TaxType
      }
    }
    weight {
      ...Weight
    }
    taxType {
      ...TaxType
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
    choices(
      first: $firstValues
      after: $afterValues
      last: $lastValues
      before: $beforeValues
    ) {
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
    nonSelectionAttributes: attributes(
      variantSelection: NOT_VARIANT_SELECTION
    ) {
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
        publicationDate
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
          url
          type
          oembedData
        }
      }
      defaultVariant {
        id
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
