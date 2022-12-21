/* eslint-disable */
import * as Types from './types.taxes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@saleor/hooks/graphql';
const defaultOptions = {} as const;
export const ChannelListingProductWithoutPricingFragmentDoc = gql`
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
export const ProductMediaFragmentDoc = gql`
    fragment ProductMedia on ProductMedia {
  id
  alt
  sortOrder
  url
  type
  oembedData
}
    `;
export const WarehouseFragmentDoc = gql`
    fragment Warehouse on Warehouse {
  id
  name
}
    `;
export const StockFragmentDoc = gql`
    fragment Stock on Stock {
  id
  quantity
  quantityAllocated
  warehouse {
    ...Warehouse
  }
}
    ${WarehouseFragmentDoc}`;
export const PreorderFragmentDoc = gql`
    fragment Preorder on PreorderData {
  globalThreshold
  globalSoldUnits
  endDate
}
    `;
export const MoneyFragmentDoc = gql`
    fragment Money on Money {
  amount
  currency
}
    `;
export const ChannelListingProductVariantFragmentDoc = gql`
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
    ${MoneyFragmentDoc}`;
export const ProductDetailsVariantFragmentDoc = gql`
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
    ${StockFragmentDoc}
${PreorderFragmentDoc}
${ChannelListingProductVariantFragmentDoc}`;
export const WeightFragmentDoc = gql`
    fragment Weight on Weight {
  unit
  value
}
    `;
export const MetadataItemFragmentDoc = gql`
    fragment MetadataItem on MetadataItem {
  key
  value
}
    `;
export const MetadataFragmentDoc = gql`
    fragment Metadata on ObjectWithMetadata {
  metadata {
    ...MetadataItem
  }
  privateMetadata {
    ...MetadataItem
  }
}
    ${MetadataItemFragmentDoc}`;
export const PageInfoFragmentDoc = gql`
    fragment PageInfo on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
}
    `;
export const FileFragmentDoc = gql`
    fragment File on File {
  url
  contentType
}
    `;
export const AttributeValueFragmentDoc = gql`
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
    ${FileFragmentDoc}`;
export const AttributeValueDetailsFragmentDoc = gql`
    fragment AttributeValueDetails on AttributeValue {
  ...AttributeValue
  plainText
  richText
}
    ${AttributeValueFragmentDoc}`;
export const AttributeValueListFragmentDoc = gql`
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
    ${PageInfoFragmentDoc}
${AttributeValueDetailsFragmentDoc}`;
export const ProductVariantAttributesFragmentDoc = gql`
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
    ${AttributeValueListFragmentDoc}
${AttributeValueDetailsFragmentDoc}`;
export const ProductDetailsWithTaxesDocument = gql`
    query ProductDetailsWithTaxes($id: ID!, $channel: String, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  product(id: $id, channel: $channel) {
    ...ProductVariantAttributes
    ...Metadata
    name
    slug
    description
    seoTitle
    taxIncluded
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
}
    ${ProductVariantAttributesFragmentDoc}
${MetadataFragmentDoc}
${ChannelListingProductWithoutPricingFragmentDoc}
${ProductMediaFragmentDoc}
${ProductDetailsVariantFragmentDoc}
${WeightFragmentDoc}`;

/**
 * __useProductDetailsWithTaxesQuery__
 *
 * To run a query within a React component, call `useProductDetailsWithTaxesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductDetailsWithTaxesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductDetailsWithTaxesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      channel: // value for 'channel'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useProductDetailsWithTaxesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductDetailsWithTaxesQuery, Types.ProductDetailsWithTaxesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductDetailsWithTaxesQuery, Types.ProductDetailsWithTaxesQueryVariables>(ProductDetailsWithTaxesDocument, options);
      }
export function useProductDetailsWithTaxesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductDetailsWithTaxesQuery, Types.ProductDetailsWithTaxesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductDetailsWithTaxesQuery, Types.ProductDetailsWithTaxesQueryVariables>(ProductDetailsWithTaxesDocument, options);
        }
export type ProductDetailsWithTaxesQueryHookResult = ReturnType<typeof useProductDetailsWithTaxesQuery>;
export type ProductDetailsWithTaxesLazyQueryHookResult = ReturnType<typeof useProductDetailsWithTaxesLazyQuery>;
export type ProductDetailsWithTaxesQueryResult = Apollo.QueryResult<Types.ProductDetailsWithTaxesQuery, Types.ProductDetailsWithTaxesQueryVariables>;