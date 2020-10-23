import gql from "graphql-tag";

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

export const fragmentProductImage = gql`
  fragment ProductImageFragment on ProductImage {
    id
    alt
    sortOrder
    url
  }
`;

export const channelListingAvailabilityFragment = gql`
  ${fragmentMoney}
  fragment ChannelListingAvailabilityFragment on ProductChannelListing {
    isPublished
    publicationDate
    # isAvailableForPurchase
    # availableForPurchase
    channel {
      id
      name
    }
  }
`;

export const channelListingProductFragment = gql`
  ${fragmentMoney}
  fragment ChannelListingProductFragment on ProductChannelListing {
    isPublished
    publicationDate
    discountedPrice {
      ...Money
    }
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
    channelListing {
      ...ChannelListingProductFragment
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
    channelListing {
      channel {
        id
        name
        currencyCode
      }
      discountedPrice {
        ...Money
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

export const fragmentVariant = gql`
  ${fragmentMoney}
  ${fragmentProductImage}
  ${stockFragment}
  ${weightFragment}
  ${metadataFragment}
  ${channelListingProductVariantFragment}
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
      channelListing {
        channel {
          id
          name
          currencyCode
        }
        discountedPrice {
          ...Money
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
    channelListing {
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
