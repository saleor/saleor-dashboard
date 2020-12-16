import gql from "graphql-tag";

import { attributeValueFragment } from "./attributes";
import { metadataFragment } from "./metadata";
import { taxTypeFragment } from "./taxes";
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

export const priceRangeFragment = gql`
  ${fragmentMoney}
  fragment PriceRangeFragment on TaxedMoneyRange {
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

export const fragmentProductImage = gql`
  fragment ProductImageFragment on ProductImage {
    id
    alt
    sortOrder
    url
  }
`;

export const channelListingProductWithoutPricingFragment = gql`
  fragment ChannelListingProductWithoutPricingFragment on ProductChannelListing {
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
  ${priceRangeFragment}
  ${channelListingProductWithoutPricingFragment}
  fragment ChannelListingProductFragment on ProductChannelListing {
    ...ChannelListingProductWithoutPricingFragment
    pricing {
      priceRange {
        ...PriceRangeFragment
      }
    }
  }
`;

export const channelListingProductVariantFragment = gql`
  ${fragmentMoney}
  fragment ChannelListingProductVariantFragment on ProductVariantChannelListing {
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
    channelListings {
      ...ChannelListingProductFragment
    }
  }
`;

export const productVariantAttributesFragment = gql`
  ${priceRangeFragment}
  ${attributeValueFragment}
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
          ...AttributeValueFragment
        }
      }
      values {
        ...AttributeValueFragment
      }
    }
    productType {
      id
      variantAttributes(variantSelection: VARIANT_SELECTION) {
        id
        name
        values {
          ...AttributeValueFragment
        }
      }
    }
    channelListings {
      channel {
        id
        name
        currencyCode
      }
      pricing {
        priceRange {
          ...PriceRangeFragment
        }
      }
    }
  }
`;

export const productFragmentDetails = gql`
  ${fragmentProductImage}
  ${productVariantAttributesFragment}
  ${stockFragment}
  ${weightFragment}
  ${metadataFragment}
  ${taxTypeFragment}
  ${channelListingProductFragment}
  ${channelListingProductVariantFragment}
  fragment Product on Product {
    ...ProductVariantAttributesFragment
    ...MetadataFragment
    name
    slug
    descriptionJson
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
      ...ChannelListingProductFragment
    }
    images {
      ...ProductImageFragment
    }
    isAvailable
    variants {
      id
      sku
      name
      margin
      stocks {
        ...StockFragment
      }
      trackInventory
      channelListings {
        ...ChannelListingProductVariantFragment
      }
    }
    productType {
      id
      name
      hasVariants
      taxType {
        ...TaxTypeFragment
      }
    }
    weight {
      ...WeightFragment
    }
    taxType {
      ...TaxTypeFragment
    }
  }
`;

export const variantAttributeFragment = gql`
  ${attributeValueFragment}
  fragment VariantAttributeFragment on Attribute {
    id
    name
    slug
    inputType
    valueRequired
    values {
      ...AttributeValueFragment
    }
  }
`;

export const selectedVariantAttributeFragment = gql`
  ${attributeValueFragment}
  ${variantAttributeFragment}
  fragment SelectedVariantAttributeFragment on SelectedAttribute {
    attribute {
      ...VariantAttributeFragment
    }
    values {
      ...AttributeValueFragment
    }
  }
`;

export const fragmentVariant = gql`
  ${selectedVariantAttributeFragment}
  ${priceRangeFragment}
  ${fragmentProductImage}
  ${stockFragment}
  ${weightFragment}
  ${metadataFragment}
  ${channelListingProductVariantFragment}
  fragment ProductVariant on ProductVariant {
    id
    ...MetadataFragment
    selectionAttributes: attributes(variantSelection: VARIANT_SELECTION) {
      ...SelectedVariantAttributeFragment
    }
    nonSelectionAttributes: attributes(
      variantSelection: NOT_VARIANT_SELECTION
    ) {
      ...SelectedVariantAttributeFragment
    }
    images {
      id
      url
    }
    name
    product {
      id
      defaultVariant {
        id
      }
      images {
        ...ProductImageFragment
      }
      name
      thumbnail {
        url
      }
      channelListings {
        channel {
          id
          name
          currencyCode
        }
        pricing {
          priceRange {
            ...PriceRangeFragment
          }
        }
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
      defaultVariant {
        id
      }
    }
    channelListings {
      ...ChannelListingProductVariantFragment
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
