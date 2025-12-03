import * as Types from './types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@dashboard/hooks/graphql';
const defaultOptions = {} as const;
export const AppManifestFragmentDoc = gql`
    fragment AppManifest on Manifest {
  identifier
  version
  about
  name
  appUrl
  configurationUrl
  tokenTargetUrl
  dataPrivacy
  dataPrivacyUrl
  homepageUrl
  supportUrl
  extensions {
    targetName
    permissions {
      code
      name
    }
    mountName
    url
    label
  }
  permissions {
    code
    name
  }
  brand {
    logo {
      default(format: WEBP, size: 64)
    }
  }
}
    `;
export const WebhookFragmentDoc = gql`
    fragment Webhook on Webhook {
  id
  name
  isActive
  app {
    id
    name
  }
}
    `;
export const AppFragmentDoc = gql`
    fragment App on App {
  id
  name
  created
  isActive
  type
  homepageUrl
  appUrl
  manifestUrl
  configurationUrl
  supportUrl
  version
  accessToken
  brand {
    logo {
      default(format: WEBP, size: 64)
    }
  }
  privateMetadata @include(if: $hasManagedAppsPermission) {
    key
    value
  }
  metadata @include(if: $hasManagedAppsPermission) {
    key
    value
  }
  tokens @include(if: $hasManagedAppsPermission) {
    authToken
    id
    name
  }
  webhooks @include(if: $hasManagedAppsPermission) {
    ...Webhook
  }
}
    ${WebhookFragmentDoc}`;
export const AppInstallationFragmentDoc = gql`
    fragment AppInstallation on AppInstallation {
  status
  message
  appName
  manifestUrl
  id
  brand {
    logo {
      default(format: WEBP, size: 64)
    }
  }
}
    `;
export const AppPermissionFragmentDoc = gql`
    fragment AppPermission on Permission {
  name
  code
}
    `;
export const AppEventDeliveriesFragmentDoc = gql`
    fragment AppEventDeliveries on App {
  webhooks @include(if: $canFetchAppEvents) {
    failedDelivers: eventDeliveries(
      first: 1
      filter: {status: FAILED}
      sortBy: {field: CREATED_AT, direction: DESC}
    ) {
      edges {
        node {
          id
          createdAt
          attempts(first: 1, sortBy: {field: CREATED_AT, direction: DESC}) {
            edges {
              node {
                id
                status
                createdAt
              }
            }
          }
        }
      }
    }
    pendingDelivers: eventDeliveries(
      first: 6
      filter: {status: PENDING}
      sortBy: {field: CREATED_AT, direction: DESC}
    ) {
      edges {
        node {
          id
          attempts(first: 6, sortBy: {field: CREATED_AT, direction: DESC}) {
            edges {
              node {
                id
                status
                createdAt
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const AppListItemFragmentDoc = gql`
    fragment AppListItem on App {
  id
  name
  isActive
  type
  appUrl
  manifestUrl
  version
  created
  brand {
    logo {
      default(format: WEBP, size: 64)
    }
  }
  permissions {
    ...AppPermission
  }
  ...AppEventDeliveries
}
    ${AppPermissionFragmentDoc}
${AppEventDeliveriesFragmentDoc}`;
export const EventDeliveryAttemptFragmentDoc = gql`
    fragment EventDeliveryAttempt on EventDeliveryAttempt {
  id
  createdAt
  status
  response
  responseStatusCode
}
    `;
export const InstalledAppFragmentDoc = gql`
    fragment InstalledApp on App {
  id
  identifier
  manifestUrl
  isActive
}
    `;
export const InstalledAppDetailsFragmentDoc = gql`
    fragment InstalledAppDetails on App {
  id
  isActive
  name
  type
  brand {
    logo {
      default(format: WEBP, size: 64)
    }
  }
}
    `;
export const AvailableAttributeFragmentDoc = gql`
    fragment AvailableAttribute on Attribute {
  id
  name
  slug
}
    `;
export const UserPermissionFragmentDoc = gql`
    fragment UserPermission on UserPermission {
  code
  name
}
    `;
export const UserUserPermissionWithSourcePermissionGroupsFragmentDoc = gql`
    fragment UserUserPermissionWithSourcePermissionGroups on UserPermission {
  ...UserPermission
  sourcePermissionGroups(userId: $userId) {
    id
  }
}
    ${UserPermissionFragmentDoc}`;
export const ChannelFragmentDoc = gql`
    fragment Channel on Channel {
  id
  isActive
  name
  slug
  currencyCode
  defaultCountry {
    code
    country
  }
  stockSettings {
    allocationStrategy
  }
}
    `;
export const UserFragmentDoc = gql`
    fragment User on User {
  id
  email
  firstName
  lastName
  isStaff
  dateJoined
  metadata {
    key
    value
  }
  userPermissions {
    ...UserPermission
  }
  avatar(size: 128) {
    url
  }
  accessibleChannels {
    ...Channel
  }
  restrictedAccessToChannels
}
    ${UserPermissionFragmentDoc}
${ChannelFragmentDoc}`;
export const CategoryFragmentDoc = gql`
    fragment Category on Category {
  id
  name
  children {
    totalCount
  }
  products {
    totalCount
  }
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
export const CategoryDetailsFragmentDoc = gql`
    fragment CategoryDetails on Category {
  id
  ...Metadata
  backgroundImage {
    alt
    url
  }
  name
  slug
  description
  seoDescription
  seoTitle
  parent {
    id
  }
}
    ${MetadataFragmentDoc}`;
export const CategoryWithAncestorsFragmentDoc = gql`
    fragment CategoryWithAncestors on Category {
  id
  name
  parent {
    id
    name
  }
  level
  ancestors(first: 1) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;
export const CategoryWithTotalProductsFragmentDoc = gql`
    fragment CategoryWithTotalProducts on Category {
  id
  name
  products {
    totalCount
  }
}
    `;
export const ChannelErrorFragmentDoc = gql`
    fragment ChannelError on ChannelError {
  code
  field
  message
}
    `;
export const WarehouseFragmentDoc = gql`
    fragment Warehouse on Warehouse {
  id
  name
}
    `;
export const ChannelDetailsFragmentDoc = gql`
    fragment ChannelDetails on Channel {
  ...Channel
  hasOrders
  warehouses {
    ...Warehouse
  }
  orderSettings {
    markAsPaidStrategy
    deleteExpiredOrdersAfter
    allowUnpaidOrders
  }
  paymentSettings {
    defaultTransactionFlowStrategy
  }
  checkoutSettings {
    automaticallyCompleteFullyPaidCheckouts
  }
}
    ${ChannelFragmentDoc}
${WarehouseFragmentDoc}`;
export const CollectionFragmentDoc = gql`
    fragment Collection on Collection {
  id
  name
  channelListings {
    isPublished
    publishedAt
    channel {
      id
      name
    }
  }
}
    `;
export const CollectionDetailsFragmentDoc = gql`
    fragment CollectionDetails on Collection {
  ...Collection
  ...Metadata
  backgroundImage {
    alt
    url
  }
  slug
  description
  seoDescription
  seoTitle
}
    ${CollectionFragmentDoc}
${MetadataFragmentDoc}`;
export const ChannelListingProductWithoutPricingFragmentDoc = gql`
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
export const CollectionProductFragmentDoc = gql`
    fragment CollectionProduct on Product {
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
}
    ${ChannelListingProductWithoutPricingFragmentDoc}`;
export const CollectionWithTotalProductsFragmentDoc = gql`
    fragment CollectionWithTotalProducts on Collection {
  id
  name
  products {
    totalCount
  }
}
    `;
export const CustomerFragmentDoc = gql`
    fragment Customer on User {
  id
  email
  firstName
  lastName
}
    `;
export const AddressFragmentDoc = gql`
    fragment Address on Address {
  city
  cityArea
  companyName
  country {
    __typename
    code
    country
  }
  countryArea
  firstName
  id
  lastName
  phone
  postalCode
  streetAddress1
  streetAddress2
}
    `;
export const CustomerDetailsFragmentDoc = gql`
    fragment CustomerDetails on User {
  ...Customer
  dateJoined
  lastLogin
  defaultShippingAddress {
    ...Address
  }
  defaultBillingAddress {
    ...Address
  }
  note
  isActive
}
    ${CustomerFragmentDoc}
${AddressFragmentDoc}`;
export const CustomerAddressesFragmentDoc = gql`
    fragment CustomerAddresses on User {
  ...Customer
  addresses {
    ...Address
  }
  defaultBillingAddress {
    id
  }
  defaultShippingAddress {
    id
  }
}
    ${CustomerFragmentDoc}
${AddressFragmentDoc}`;
export const SaleFragmentDoc = gql`
    fragment Sale on Sale {
  ...Metadata
  id
  name
  type
  startDate
  endDate
  channelListings {
    id
    channel {
      id
      name
      currencyCode
    }
    discountValue
    currency
  }
}
    ${MetadataFragmentDoc}`;
export const PageInfoFragmentDoc = gql`
    fragment PageInfo on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
}
    `;
export const SaleDetailsFragmentDoc = gql`
    fragment SaleDetails on Sale {
  ...Sale
  variantsCount: variants {
    totalCount
  }
  productsCount: products {
    totalCount
  }
  collectionsCount: collections {
    totalCount
  }
  categoriesCount: categories {
    totalCount
  }
  variants(after: $after, before: $before, first: $first, last: $last) @include(if: $includeVariants) {
    edges {
      node {
        id
        name
        product {
          id
          name
          thumbnail {
            url
          }
          productType {
            id
            name
          }
          channelListings {
            ...ChannelListingProductWithoutPricing
          }
        }
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
  products(after: $after, before: $before, first: $first, last: $last) @include(if: $includeProducts) {
    edges {
      node {
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
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
  categories(after: $after, before: $before, first: $first, last: $last) @include(if: $includeCategories) {
    edges {
      node {
        id
        name
        products {
          totalCount
        }
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
  collections(after: $after, before: $before, first: $first, last: $last) @include(if: $includeCollections) {
    edges {
      node {
        id
        name
        products {
          totalCount
        }
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${SaleFragmentDoc}
${ChannelListingProductWithoutPricingFragmentDoc}
${PageInfoFragmentDoc}`;
export const VoucherCodeFragmentDoc = gql`
    fragment VoucherCode on VoucherCode {
  code
  used
  isActive
}
    `;
export const VoucherFragmentDoc = gql`
    fragment Voucher on Voucher {
  ...Metadata
  id
  name
  startDate
  endDate
  usageLimit
  type
  discountValueType
  countries {
    code
    country
  }
  minCheckoutItemsQuantity
  channelListings {
    id
    channel {
      id
      name
      currencyCode
    }
    discountValue
    currency
    minSpent {
      amount
      currency
    }
  }
}
    ${MetadataFragmentDoc}`;
export const VoucherDetailsFragmentDoc = gql`
    fragment VoucherDetails on Voucher {
  ...Voucher
  usageLimit
  used
  applyOncePerOrder
  applyOncePerCustomer
  onlyForStaff
  singleUse
  variantsCount: variants {
    totalCount
  }
  productsCount: products {
    totalCount
  }
  collectionsCount: collections {
    totalCount
  }
  categoriesCount: categories {
    totalCount
  }
  products(after: $after, before: $before, first: $first, last: $last) @include(if: $includeProducts) {
    edges {
      node {
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
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
  collections(after: $after, before: $before, first: $first, last: $last) @include(if: $includeCollections) {
    edges {
      node {
        id
        name
        products {
          totalCount
        }
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
  categories(after: $after, before: $before, first: $first, last: $last) @include(if: $includeCategories) {
    edges {
      node {
        id
        name
        products {
          totalCount
        }
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
  variants(after: $after, before: $before, first: $first, last: $last) @include(if: $includeVariants) {
    edges {
      node {
        id
        name
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
          channelListings {
            ...ChannelListingProductWithoutPricing
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    pageInfo {
      ...PageInfo
      __typename
    }
    __typename
  }
}
    ${VoucherFragmentDoc}
${ChannelListingProductWithoutPricingFragmentDoc}
${PageInfoFragmentDoc}`;
export const PromotionRuleChannelFragmentDoc = gql`
    fragment PromotionRuleChannel on Channel {
  id
  isActive
  name
  slug
  currencyCode
  defaultCountry {
    code
    country
  }
}
    `;
export const PromotionRuleDetailsFragmentDoc = gql`
    fragment PromotionRuleDetails on PromotionRule {
  id
  name
  description
  channels {
    ...PromotionRuleChannel
  }
  giftIds
  rewardType
  rewardValueType
  rewardValue
  cataloguePredicate
  orderPredicate
}
    ${PromotionRuleChannelFragmentDoc}`;
export const PromotionDetailsFragmentDoc = gql`
    fragment PromotionDetails on Promotion {
  id
  name
  type
  description
  startDate
  endDate
  rules {
    ...PromotionRuleDetails
  }
}
    ${PromotionRuleDetailsFragmentDoc}`;
export const PromotionFragmentDoc = gql`
    fragment Promotion on Promotion {
  ...Metadata
  id
  name
  startDate
  endDate
  type
}
    ${MetadataFragmentDoc}`;
export const AttributeErrorFragmentDoc = gql`
    fragment AttributeError on AttributeError {
  code
  field
  message
}
    `;
export const ProductErrorFragmentDoc = gql`
    fragment ProductError on ProductError {
  code
  field
  message
}
    `;
export const ProductErrorWithAttributesFragmentDoc = gql`
    fragment ProductErrorWithAttributes on ProductError {
  ...ProductError
  attributes
}
    ${ProductErrorFragmentDoc}`;
export const ProductChannelListingErrorFragmentDoc = gql`
    fragment ProductChannelListingError on ProductChannelListingError {
  code
  field
  message
  channels
}
    `;
export const CollectionChannelListingErrorFragmentDoc = gql`
    fragment CollectionChannelListingError on CollectionChannelListingError {
  code
  field
  message
  channels
}
    `;
export const AccountErrorFragmentDoc = gql`
    fragment AccountError on AccountError {
  code
  field
  addressType
  message
}
    `;
export const DiscountErrorFragmentDoc = gql`
    fragment DiscountError on DiscountError {
  code
  field
  channels
  message
}
    `;
export const PromotionCreateErrorFragmentDoc = gql`
    fragment PromotionCreateError on PromotionCreateError {
  field
  message
  code
  index
}
    `;
export const PromotionUpdateErrorFragmentDoc = gql`
    fragment PromotionUpdateError on PromotionUpdateError {
  field
  message
  code
}
    `;
export const PromotionDeleteErrorFragmentDoc = gql`
    fragment PromotionDeleteError on PromotionDeleteError {
  field
  message
  code
}
    `;
export const PromotionRuleUpdateErrorFragmentDoc = gql`
    fragment PromotionRuleUpdateError on PromotionRuleUpdateError {
  field
  message
  code
  channels
}
    `;
export const PromotionRuleCreateErrorFragmentDoc = gql`
    fragment PromotionRuleCreateError on PromotionRuleCreateError {
  field
  message
  code
}
    `;
export const PromotionRuleDeleteErrorFragmentDoc = gql`
    fragment PromotionRuleDeleteError on PromotionRuleDeleteError {
  field
  message
  code
}
    `;
export const MenuErrorFragmentDoc = gql`
    fragment MenuError on MenuError {
  code
  field
  message
}
    `;
export const OrderErrorFragmentDoc = gql`
    fragment OrderError on OrderError {
  code
  field
  addressType
  message
  orderLines
}
    `;
export const OrderSettingsErrorFragmentDoc = gql`
    fragment OrderSettingsError on OrderSettingsError {
  code
  field
  message
}
    `;
export const PageErrorFragmentDoc = gql`
    fragment PageError on PageError {
  code
  field
  message
}
    `;
export const PageErrorWithAttributesFragmentDoc = gql`
    fragment PageErrorWithAttributes on PageError {
  ...PageError
  attributes
}
    ${PageErrorFragmentDoc}`;
export const PermissionGroupErrorFragmentDoc = gql`
    fragment PermissionGroupError on PermissionGroupError {
  code
  field
  message
}
    `;
export const BulkProductErrorFragmentDoc = gql`
    fragment BulkProductError on BulkProductError {
  field
  code
  index
  channels
  message
}
    `;
export const ProductVariantBulkErrorFragmentDoc = gql`
    fragment ProductVariantBulkError on ProductVariantBulkError {
  field
  code
  message
  attributes
  values
  warehouses
  channels
}
    `;
export const BulkStockErrorFragmentDoc = gql`
    fragment BulkStockError on BulkStockError {
  code
  field
  index
  message
}
    `;
export const StockErrorFragmentDoc = gql`
    fragment StockError on StockError {
  code
  field
  message
}
    `;
export const ShippingChannelsErrorFragmentDoc = gql`
    fragment ShippingChannelsError on ShippingError {
  code
  field
  channels
  message
}
    `;
export const ShippingErrorFragmentDoc = gql`
    fragment ShippingError on ShippingError {
  code
  field
  message
}
    `;
export const ShopErrorFragmentDoc = gql`
    fragment ShopError on ShopError {
  code
  field
  message
}
    `;
export const StaffErrorFragmentDoc = gql`
    fragment StaffError on StaffError {
  code
  field
  message
}
    `;
export const WarehouseErrorFragmentDoc = gql`
    fragment WarehouseError on WarehouseError {
  code
  field
  message
}
    `;
export const WebhookErrorFragmentDoc = gql`
    fragment WebhookError on WebhookError {
  code
  field
  message
}
    `;
export const InvoiceErrorFragmentDoc = gql`
    fragment InvoiceError on InvoiceError {
  code
  field
  message
}
    `;
export const AppErrorFragmentDoc = gql`
    fragment AppError on AppError {
  field
  message
  code
  permissions
}
    `;
export const ExportErrorFragmentDoc = gql`
    fragment ExportError on ExportError {
  code
  field
  message
}
    `;
export const PluginErrorFragmentDoc = gql`
    fragment PluginError on PluginError {
  code
  field
  message
}
    `;
export const MetadataErrorFragmentDoc = gql`
    fragment MetadataError on MetadataError {
  code
  field
  message
}
    `;
export const CollectionErrorFragmentDoc = gql`
    fragment CollectionError on CollectionError {
  code
  field
  message
}
    `;
export const UploadErrorFragmentDoc = gql`
    fragment UploadError on UploadError {
  code
  field
  message
}
    `;
export const GiftCardErrorFragmentDoc = gql`
    fragment GiftCardError on GiftCardError {
  code
  field
  message
}
    `;
export const GiftCardSettingsErrorFragmentDoc = gql`
    fragment GiftCardSettingsError on GiftCardSettingsError {
  code
  field
  message
}
    `;
export const SaleBulkDeleteErrorFragmentDoc = gql`
    fragment SaleBulkDeleteError on DiscountError {
  code
  field
  message
}
    `;
export const VoucherBulkDeleteErrorFragmentDoc = gql`
    fragment VoucherBulkDeleteError on DiscountError {
  code
  field
  message
}
    `;
export const GiftCardBulkCreateErrorFragmentFragmentDoc = gql`
    fragment GiftCardBulkCreateErrorFragment on GiftCardError {
  code
  field
  message
}
    `;
export const GiftCardCreateErrorFragmentFragmentDoc = gql`
    fragment GiftCardCreateErrorFragment on GiftCardError {
  code
  field
  message
}
    `;
export const PageBulkPublishErrorFragmentFragmentDoc = gql`
    fragment PageBulkPublishErrorFragment on PageError {
  code
  field
  message
}
    `;
export const PageBulkRemoveErrorFragmentFragmentDoc = gql`
    fragment PageBulkRemoveErrorFragment on PageError {
  code
  field
  message
}
    `;
export const PageTypeDeleteErrorFragmentFragmentDoc = gql`
    fragment PageTypeDeleteErrorFragment on PageError {
  code
  field
  message
}
    `;
export const ProductVariantStocksDeleteErrorFragmentDoc = gql`
    fragment ProductVariantStocksDeleteError on StockError {
  code
  field
  message
}
    `;
export const ProductTypeDeleteErrorFragmentFragmentDoc = gql`
    fragment ProductTypeDeleteErrorFragment on ProductError {
  code
  field
  message
}
    `;
export const ProductTypeBulkDeleteErrorFragmentFragmentDoc = gql`
    fragment ProductTypeBulkDeleteErrorFragment on ProductError {
  code
  field
  message
}
    `;
export const ProductTypeBulkUpdateErrorFragmentFragmentDoc = gql`
    fragment ProductTypeBulkUpdateErrorFragment on ProductError {
  code
  field
  message
}
    `;
export const ProductAttributeAssignErrorFragmentFragmentDoc = gql`
    fragment ProductAttributeAssignErrorFragment on ProductError {
  code
  field
  message
}
    `;
export const ProductAttributeUnassignErrorFragmentFragmentDoc = gql`
    fragment ProductAttributeUnassignErrorFragment on ProductError {
  code
  field
  message
}
    `;
export const ProductTypeCreateErrorFragmentFragmentDoc = gql`
    fragment ProductTypeCreateErrorFragment on ProductError {
  code
  field
  message
}
    `;
export const ProductTypeReorderAttributesErrorFragmentFragmentDoc = gql`
    fragment ProductTypeReorderAttributesErrorFragment on ProductError {
  code
  field
  message
}
    `;
export const ProductAttributeAssignmentUpdateErrorFragmentFragmentDoc = gql`
    fragment ProductAttributeAssignmentUpdateErrorFragment on ProductError {
  code
  field
  message
  attributes
}
    `;
export const ShopSettingsUpdateErrorFragmentFragmentDoc = gql`
    fragment ShopSettingsUpdateErrorFragment on ShopError {
  code
  field
  message
}
    `;
export const ShopFetchTaxRatesErrorFragmentFragmentDoc = gql`
    fragment ShopFetchTaxRatesErrorFragment on ShopError {
  code
  field
  message
}
    `;
export const ProductTranslateErrorFragmentFragmentDoc = gql`
    fragment ProductTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const ProductVariantTranslateErrorFragmentFragmentDoc = gql`
    fragment ProductVariantTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const CategoryTranslateErrorFragmentFragmentDoc = gql`
    fragment CategoryTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const CollectionTranslateErrorFragmentFragmentDoc = gql`
    fragment CollectionTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const PageTranslateErrorFragmentFragmentDoc = gql`
    fragment PageTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const VoucherTranslateErrorFragmentFragmentDoc = gql`
    fragment VoucherTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const SaleTranslateErrorFragmentFragmentDoc = gql`
    fragment SaleTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const AttributeTranslateErrorFragmentFragmentDoc = gql`
    fragment AttributeTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const AttributeValueTranslateErrorFragmentFragmentDoc = gql`
    fragment AttributeValueTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const ShippingPriceTranslateErrorFragmentFragmentDoc = gql`
    fragment ShippingPriceTranslateErrorFragment on TranslationError {
  code
  field
  message
}
    `;
export const TaxConfigurationUpdateErrorFragmentDoc = gql`
    fragment TaxConfigurationUpdateError on TaxConfigurationUpdateError {
  field
  code
  message
}
    `;
export const TaxCountryConfigurationUpdateErrorFragmentDoc = gql`
    fragment TaxCountryConfigurationUpdateError on TaxCountryConfigurationUpdateError {
  field
  code
  message
}
    `;
export const TaxCountryConfigurationDeleteErrorFragmentDoc = gql`
    fragment TaxCountryConfigurationDeleteError on TaxCountryConfigurationDeleteError {
  field
  code
  message
}
    `;
export const TaxClassUpdateErrorFragmentDoc = gql`
    fragment TaxClassUpdateError on TaxClassUpdateError {
  field
  code
  message
}
    `;
export const TaxClassCreateErrorFragmentDoc = gql`
    fragment TaxClassCreateError on TaxClassCreateError {
  field
  code
  message
}
    `;
export const TaxClassDeleteErrorFragmentDoc = gql`
    fragment TaxClassDeleteError on TaxClassDeleteError {
  field
  code
  message
}
    `;
export const TransactionRequestActionErrorFragmentDoc = gql`
    fragment TransactionRequestActionError on TransactionRequestActionError {
  field
  message
  code
}
    `;
export const TransactionCreateErrorFragmentDoc = gql`
    fragment TransactionCreateError on TransactionCreateError {
  field
  message
  code
}
    `;
export const OrderGrantRefundCreateErrorFragmentDoc = gql`
    fragment OrderGrantRefundCreateError on OrderGrantRefundCreateError {
  field
  message
  code
  lines {
    field
    message
    code
    lineId
  }
}
    `;
export const OrderGrantRefundUpdateErrorFragmentDoc = gql`
    fragment OrderGrantRefundUpdateError on OrderGrantRefundUpdateError {
  field
  message
  code
  addLines {
    field
    message
    code
    lineId
  }
  removeLines {
    field
    message
    code
    lineId
  }
}
    `;
export const TransactionRequestRefundForGrantedRefundErrorFragmentDoc = gql`
    fragment TransactionRequestRefundForGrantedRefundError on TransactionRequestRefundForGrantedRefundError {
  field
  message
  code
}
    `;
export const GiftCardsSettingsFragmentDoc = gql`
    fragment GiftCardsSettings on GiftCardSettings {
  expiryType
  expiryPeriod {
    type
    amount
  }
}
    `;
export const MoneyFragmentDoc = gql`
    fragment Money on Money {
  amount
  currency
}
    `;
export const GiftCardEventFragmentDoc = gql`
    fragment GiftCardEvent on GiftCardEvent {
  expiryDate
  oldExpiryDate
  id
  date
  type
  message
  email
  orderId
  orderNumber
  tags
  oldTags
  balance {
    initialBalance {
      ...Money
    }
    currentBalance {
      ...Money
    }
    oldInitialBalance {
      ...Money
    }
    oldCurrentBalance {
      ...Money
    }
  }
}
    ${MoneyFragmentDoc}`;
export const UserBaseFragmentDoc = gql`
    fragment UserBase on User {
  id
  firstName
  lastName
}
    `;
export const GiftCardDataFragmentDoc = gql`
    fragment GiftCardData on GiftCard {
  ...Metadata
  last4CodeChars
  boughtInChannel
  createdBy {
    ...UserBase
  }
  product {
    id
    name
  }
  usedBy {
    ...UserBase
  }
  usedByEmail
  createdByEmail
  created
  expiryDate
  lastUsedOn
  isActive
  initialBalance {
    ...Money
  }
  currentBalance {
    ...Money
  }
  id
  tags {
    name
  }
}
    ${MetadataFragmentDoc}
${UserBaseFragmentDoc}
${MoneyFragmentDoc}`;
export const CustomerGiftCardFragmentDoc = gql`
    fragment CustomerGiftCard on GiftCard {
  id
  last4CodeChars
  expiryDate
  isActive
  currentBalance {
    ...Money
  }
}
    ${MoneyFragmentDoc}`;
export const MenuFragmentDoc = gql`
    fragment Menu on Menu {
  id
  name
  items {
    id
  }
}
    `;
export const MenuItemFragmentDoc = gql`
    fragment MenuItem on MenuItem {
  category {
    id
    name
  }
  collection {
    id
    name
  }
  id
  level
  name
  page {
    id
    title
  }
  url
}
    `;
export const MenuItemNestedFragmentDoc = gql`
    fragment MenuItemNested on MenuItem {
  ...MenuItem
  children {
    ...MenuItem
    children {
      ...MenuItem
      children {
        ...MenuItem
        children {
          ...MenuItem
          children {
            ...MenuItem
            children {
              ...MenuItem
            }
          }
        }
      }
    }
  }
}
    ${MenuItemFragmentDoc}`;
export const MenuDetailsFragmentDoc = gql`
    fragment MenuDetails on Menu {
  id
  items {
    ...MenuItemNested
  }
  name
}
    ${MenuItemNestedFragmentDoc}`;
export const OrderLineMetadataFragmentDoc = gql`
    fragment OrderLineMetadata on OrderLine {
  metadata {
    ...MetadataItem
  }
  privateMetadata {
    ...MetadataItem
  }
  variant {
    metadata {
      ...MetadataItem
    }
    privateMetadata @include(if: $hasManageProducts) {
      ...MetadataItem
    }
  }
}
    ${MetadataItemFragmentDoc}`;
export const OrderLineMetadataDetailsFragmentDoc = gql`
    fragment OrderLineMetadataDetails on OrderLine {
  id
  productName
  productSku
  quantity
  thumbnail {
    url
  }
  variant {
    id
    name
  }
  ...OrderLineMetadata
}
    ${OrderLineMetadataFragmentDoc}`;
export const RefundOrderLineFragmentDoc = gql`
    fragment RefundOrderLine on OrderLine {
  id
  productName
  quantity
  unitPrice {
    gross {
      ...Money
    }
  }
  thumbnail(size: 64) {
    url
  }
}
    ${MoneyFragmentDoc}`;
export const TransactionBaseEventFragmentDoc = gql`
    fragment TransactionBaseEvent on TransactionEvent {
  id
  pspReference
  amount {
    ...Money
  }
  externalUrl
  type
  message
  createdAt
  reasonReference {
    id
    title
  }
}
    ${MoneyFragmentDoc}`;
export const TransactionBaseItemFragmentDoc = gql`
    fragment TransactionBaseItem on TransactionItem {
  id
  name
  actions
  events {
    ...TransactionBaseEvent
  }
}
    ${TransactionBaseEventFragmentDoc}`;
export const StaffMemberFragmentDoc = gql`
    fragment StaffMember on User {
  id
  email
  firstName
  isActive
  lastName
}
    `;
export const StaffMemberAvatarFragmentDoc = gql`
    fragment StaffMemberAvatar on User {
  ...StaffMember
  avatar(size: 512) {
    url
  }
}
    ${StaffMemberFragmentDoc}`;
export const AppAvatarFragmentDoc = gql`
    fragment AppAvatar on App {
  id
  name
  brand {
    logo {
      default(format: WEBP, size: 64)
    }
  }
}
    `;
export const TransactionEventFragmentDoc = gql`
    fragment TransactionEvent on TransactionEvent {
  ...TransactionBaseEvent
  createdBy {
    ... on User {
      ...StaffMemberAvatar
    }
    ... on App {
      ...AppAvatar
    }
  }
  externalUrl
}
    ${TransactionBaseEventFragmentDoc}
${StaffMemberAvatarFragmentDoc}
${AppAvatarFragmentDoc}`;
export const TransactionItemFragmentDoc = gql`
    fragment TransactionItem on TransactionItem {
  ...TransactionBaseItem
  pspReference
  externalUrl
  createdAt
  events {
    ...TransactionEvent
  }
  authorizedAmount {
    ...Money
  }
  chargedAmount {
    ...Money
  }
  refundedAmount {
    ...Money
  }
  canceledAmount {
    ...Money
  }
  authorizePendingAmount {
    ...Money
  }
  chargePendingAmount {
    ...Money
  }
  refundPendingAmount {
    ...Money
  }
  cancelPendingAmount {
    ...Money
  }
}
    ${TransactionBaseItemFragmentDoc}
${TransactionEventFragmentDoc}
${MoneyFragmentDoc}`;
export const OrderPaymentFragmentDoc = gql`
    fragment OrderPayment on Payment {
  id
  isActive
  actions
  gateway
  paymentMethodType
  availableCaptureAmount {
    ...Money
  }
  capturedAmount {
    ...Money
  }
  total {
    ...Money
  }
  availableRefundAmount {
    ...Money
  }
  modified
  transactions {
    id
    token
    created
    kind
    isSuccess
  }
}
    ${MoneyFragmentDoc}`;
export const OrderGiftCardEventBalanceFragmentDoc = gql`
    fragment OrderGiftCardEventBalance on GiftCardEventBalance {
  initialBalance {
    ...Money
  }
  currentBalance {
    ...Money
  }
  oldInitialBalance {
    ...Money
  }
  oldCurrentBalance {
    ...Money
  }
}
    ${MoneyFragmentDoc}`;
export const OrderGiftCardFragmentDoc = gql`
    fragment OrderGiftCard on GiftCard {
  id
  last4CodeChars
  events {
    id
    type
    orderId
    date
    balance {
      ...OrderGiftCardEventBalance
    }
  }
}
    ${OrderGiftCardEventBalanceFragmentDoc}`;
export const UserBaseAvatarFragmentDoc = gql`
    fragment UserBaseAvatar on User {
  id
  firstName
  lastName
  email
  avatar {
    url
    alt
  }
}
    `;
export const OrderGrantedRefundFragmentDoc = gql`
    fragment OrderGrantedRefund on OrderGrantedRefund {
  id
  createdAt
  shippingCostsIncluded
  status
  amount {
    currency
    amount
  }
  transactionEvents {
    id
  }
  reason
  reasonReference {
    id
    title
  }
  user {
    ...UserBaseAvatar
  }
  app {
    id
    name
    brand {
      logo {
        default(format: WEBP, size: 64)
      }
    }
  }
  lines {
    id
    quantity
    orderLine {
      id
    }
  }
}
    ${UserBaseAvatarFragmentDoc}`;
export const OrderDiscountFragmentDoc = gql`
    fragment OrderDiscount on OrderDiscount {
  id
  type
  name
  calculationMode: valueType
  value
  reason
  amount {
    ...Money
  }
}
    ${MoneyFragmentDoc}`;
export const OrderEventFragmentDoc = gql`
    fragment OrderEvent on OrderEvent {
  id
  amount
  shippingCostsIncluded
  date
  email
  emailType
  invoiceNumber
  discount {
    valueType
    value
    reason
    amount {
      amount
      currency
    }
    oldValueType
    oldValue
    oldAmount {
      amount
      currency
    }
  }
  relatedOrder {
    id
    number
  }
  related {
    id
  }
  message
  quantity
  transactionReference
  type
  user {
    id
    email
    firstName
    lastName
    avatar(size: 128) {
      url
    }
  }
  app {
    id
    name
    appUrl
    brand {
      logo {
        default(size: 128)
      }
    }
  }
  lines {
    quantity
    itemName
    discount {
      valueType
      value
      reason
      amount {
        amount
        currency
      }
      oldValueType
      oldValue
      oldAmount {
        amount
        currency
      }
    }
    orderLine {
      id
      productName
      variantName
    }
  }
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
export const TaxedMoneyFragmentDoc = gql`
    fragment TaxedMoney on TaxedMoney {
  net {
    ...Money
  }
  gross {
    ...Money
  }
}
    ${MoneyFragmentDoc}`;
export const OrderLineFragmentDoc = gql`
    fragment OrderLine on OrderLine {
  id
  isShippingRequired
  allocations {
    id
    quantity
    warehouse {
      id
      name
    }
  }
  variant {
    id
    name
    quantityAvailable
    preorder {
      endDate
    }
    stocks {
      ...Stock
    }
    product {
      id
      isAvailableForPurchase
    }
  }
  productName
  productSku
  isGift
  quantity
  quantityFulfilled
  quantityToFulfill
  totalPrice {
    ...TaxedMoney
  }
  unitDiscount {
    amount
    currency
  }
  unitDiscountValue
  unitDiscountReason
  unitDiscountType
  undiscountedUnitPrice {
    currency
    gross {
      amount
      currency
    }
    net {
      amount
      currency
    }
  }
  unitPrice {
    gross {
      amount
      currency
    }
    net {
      amount
      currency
    }
  }
  thumbnail {
    url
  }
}
    ${StockFragmentDoc}
${TaxedMoneyFragmentDoc}`;
export const FulfillmentFragmentDoc = gql`
    fragment Fulfillment on Fulfillment {
  ...Metadata
  id
  created
  lines {
    id
    quantity
    orderLine {
      ...OrderLine
    }
  }
  fulfillmentOrder
  status
  trackingNumber
  warehouse {
    id
    name
  }
}
    ${MetadataFragmentDoc}
${OrderLineFragmentDoc}`;
export const InvoiceFragmentDoc = gql`
    fragment Invoice on Invoice {
  id
  number
  createdAt
  url
  status
}
    `;
export const OrderDetailsFragmentDoc = gql`
    fragment OrderDetails on Order {
  id
  displayGrossPrices
  ...Metadata
  billingAddress {
    ...Address
  }
  transactions {
    ...TransactionItem
  }
  payments {
    ...OrderPayment
  }
  giftCards {
    ...OrderGiftCard
  }
  grantedRefunds {
    ...OrderGrantedRefund
  }
  isShippingRequired
  canFinalize
  created
  customerNote
  discounts {
    ...OrderDiscount
  }
  events {
    ...OrderEvent
  }
  fulfillments {
    ...Fulfillment
  }
  lines {
    ...OrderLine
  }
  number
  isPaid
  paymentStatus
  shippingAddress {
    ...Address
  }
  deliveryMethod {
    __typename
    ... on ShippingMethod {
      id
    }
    ... on Warehouse {
      id
      clickAndCollectOption
    }
  }
  shippingMethod {
    id
  }
  shippingMethodName
  collectionPointName
  shippingPrice {
    gross {
      amount
      currency
    }
  }
  status
  subtotal {
    gross {
      ...Money
    }
    net {
      ...Money
    }
  }
  total {
    gross {
      ...Money
    }
    net {
      ...Money
    }
    tax {
      ...Money
    }
  }
  totalRemainingGrant {
    ...Money
  }
  totalGrantedRefund {
    ...Money
  }
  totalRefundPending {
    ...Money
  }
  totalRefunded {
    ...Money
  }
  actions
  totalAuthorizePending {
    ...Money
  }
  totalAuthorized {
    ...Money
  }
  totalCaptured {
    ...Money
  }
  totalCharged {
    ...Money
  }
  totalChargePending {
    ...Money
  }
  totalCanceled {
    ...Money
  }
  totalCancelPending {
    ...Money
  }
  totalBalance {
    ...Money
  }
  undiscountedTotal {
    net {
      ...Money
    }
    gross {
      ...Money
    }
  }
  user {
    id
    email
  }
  userEmail
  shippingMethods {
    id
    name
    price {
      ...Money
    }
    active
    message
  }
  invoices {
    ...Invoice
  }
  channel {
    isActive
    id
    name
    currencyCode
    slug
    defaultCountry {
      code
    }
    orderSettings {
      markAsPaidStrategy
    }
  }
  chargeStatus
  authorizeStatus
}
    ${MetadataFragmentDoc}
${AddressFragmentDoc}
${TransactionItemFragmentDoc}
${OrderPaymentFragmentDoc}
${OrderGiftCardFragmentDoc}
${OrderGrantedRefundFragmentDoc}
${OrderDiscountFragmentDoc}
${OrderEventFragmentDoc}
${FulfillmentFragmentDoc}
${OrderLineFragmentDoc}
${MoneyFragmentDoc}
${InvoiceFragmentDoc}`;
export const OrderLineWithMetadataFragmentDoc = gql`
    fragment OrderLineWithMetadata on OrderLine {
  ...OrderLine
  ...OrderLineMetadata
}
    ${OrderLineFragmentDoc}
${OrderLineMetadataFragmentDoc}`;
export const FulfillmentWithMetadataFragmentDoc = gql`
    fragment FulfillmentWithMetadata on Fulfillment {
  ...Fulfillment
  lines {
    orderLine {
      ...OrderLineWithMetadata
    }
  }
}
    ${FulfillmentFragmentDoc}
${OrderLineWithMetadataFragmentDoc}`;
export const OrderDetailsWithMetadataFragmentDoc = gql`
    fragment OrderDetailsWithMetadata on Order {
  ...OrderDetails
  fulfillments {
    ...FulfillmentWithMetadata
  }
  lines {
    ...OrderLine
  }
}
    ${OrderDetailsFragmentDoc}
${FulfillmentWithMetadataFragmentDoc}
${OrderLineFragmentDoc}`;
export const OrderSettingsFragmentDoc = gql`
    fragment OrderSettings on OrderSettings {
  automaticallyConfirmAllNewOrders
  automaticallyFulfillNonShippableGiftCard
}
    `;
export const ShopOrderSettingsFragmentDoc = gql`
    fragment ShopOrderSettings on Shop {
  fulfillmentAutoApprove
  fulfillmentAllowUnpaid
}
    `;
export const OrderFulfillLineFragmentDoc = gql`
    fragment OrderFulfillLine on OrderLine {
  id
  isShippingRequired
  productName
  quantity
  allocations {
    id
    quantity
    warehouse {
      id
      name
    }
  }
  quantityFulfilled
  quantityToFulfill
  variant {
    id
    name
    sku
    preorder {
      endDate
    }
    attributes {
      values {
        id
        name
      }
    }
    stocks {
      ...Stock
    }
    trackInventory
  }
  thumbnail(size: 64) {
    url
  }
}
    ${StockFragmentDoc}`;
export const OrderLineStockDataFragmentDoc = gql`
    fragment OrderLineStockData on OrderLine {
  id
  allocations {
    quantity
    warehouse {
      id
    }
  }
  quantity
  quantityToFulfill
  variant {
    stocks {
      ...Stock
    }
  }
}
    ${StockFragmentDoc}`;
export const OrderLineGrantRefundFragmentDoc = gql`
    fragment OrderLineGrantRefund on OrderLine {
  id
  thumbnail {
    url
  }
  productName
  quantity
  quantityToFulfill
  variantName
  unitPrice {
    gross {
      ...Money
    }
  }
}
    ${MoneyFragmentDoc}`;
export const OrderFulfillmentGrantRefundFragmentDoc = gql`
    fragment OrderFulfillmentGrantRefund on Fulfillment {
  id
  fulfillmentOrder
  status
  lines {
    id
    quantity
    orderLine {
      ...OrderLineGrantRefund
    }
  }
}
    ${OrderLineGrantRefundFragmentDoc}`;
export const OrderDetailsGrantedRefundFragmentDoc = gql`
    fragment OrderDetailsGrantedRefund on OrderGrantedRefund {
  id
  reason
  reasonReference {
    id
    title
  }
  amount {
    ...Money
  }
  shippingCostsIncluded
  transaction {
    id
  }
  status
  lines {
    id
    quantity
    reason
    orderLine {
      ...OrderLine
    }
  }
}
    ${MoneyFragmentDoc}
${OrderLineFragmentDoc}`;
export const OrderDetailsGrantRefundFragmentDoc = gql`
    fragment OrderDetailsGrantRefund on Order {
  id
  number
  lines {
    ...OrderLineGrantRefund
  }
  fulfillments {
    ...OrderFulfillmentGrantRefund
  }
  shippingPrice {
    gross {
      ...Money
    }
  }
  total {
    gross {
      ...Money
    }
  }
  grantedRefunds {
    ...OrderDetailsGrantedRefund
  }
  transactions {
    ...TransactionItem
  }
}
    ${OrderLineGrantRefundFragmentDoc}
${OrderFulfillmentGrantRefundFragmentDoc}
${MoneyFragmentDoc}
${OrderDetailsGrantedRefundFragmentDoc}
${TransactionItemFragmentDoc}`;
export const ActivitiesFragmentDoc = gql`
    fragment Activities on OrderEvent {
  date
  email
  message
  orderNumber
  type
  user {
    email
  }
}
    `;
export const PageTypeFragmentDoc = gql`
    fragment PageType on PageType {
  id
  name
  hasPages
}
    `;
export const AttributeFragmentDoc = gql`
    fragment Attribute on Attribute {
  id
  name
  slug
  type
  visibleInStorefront
  filterableInDashboard
  filterableInStorefront
  unit
  inputType
}
    `;
export const PageTypeDetailsFragmentDoc = gql`
    fragment PageTypeDetails on PageType {
  ...PageType
  ...Metadata
  attributes {
    ...Attribute
  }
}
    ${PageTypeFragmentDoc}
${MetadataFragmentDoc}
${AttributeFragmentDoc}`;
export const PageFragmentDoc = gql`
    fragment Page on Page {
  id
  title
  slug
  isPublished
  pageType {
    id
    name
  }
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
export const AttributeDetailsFragmentDoc = gql`
    fragment AttributeDetails on Attribute {
  ...Attribute
  availableInGrid
  entityType
  storefrontSearchPosition
  valueRequired
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
  choices(
    first: $firstValues
    after: $afterValues
    last: $lastValues
    before: $beforeValues
  ) {
    ...AttributeValueList
  }
}
    ${AttributeFragmentDoc}
${AttributeValueListFragmentDoc}`;
export const PageSelectedAttributeFragmentDoc = gql`
    fragment PageSelectedAttribute on SelectedAttribute {
  attribute {
    ...AttributeDetails
  }
  values {
    ...AttributeValueDetails
  }
}
    ${AttributeDetailsFragmentDoc}
${AttributeValueDetailsFragmentDoc}`;
export const PageAttributesFragmentDoc = gql`
    fragment PageAttributes on Page {
  attributes {
    ...PageSelectedAttribute
  }
  pageType {
    id
    name
    attributes {
      id
      name
      inputType
      entityType
      valueRequired
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
}
    ${PageSelectedAttributeFragmentDoc}
${AttributeValueListFragmentDoc}`;
export const PageDetailsFragmentDoc = gql`
    fragment PageDetails on Page {
  ...Page
  ...PageAttributes
  ...Metadata
  content
  seoTitle
  seoDescription
  publishedAt
}
    ${PageFragmentDoc}
${PageAttributesFragmentDoc}
${MetadataFragmentDoc}`;
export const PermissionGroupFragmentDoc = gql`
    fragment PermissionGroup on Group {
  id
  name
  userCanManage
  users {
    id
    firstName
    lastName
  }
}
    `;
export const PermissionFragmentDoc = gql`
    fragment Permission on Permission {
  code
  name
}
    `;
export const PermissionGroupMemberFragmentDoc = gql`
    fragment PermissionGroupMember on User {
  ...StaffMember
  avatar(size: 128) {
    url
  }
}
    ${StaffMemberFragmentDoc}`;
export const PermissionGroupDetailsFragmentDoc = gql`
    fragment PermissionGroupDetails on Group {
  ...PermissionGroup
  restrictedAccessToChannels
  accessibleChannels {
    ...Channel
  }
  permissions {
    ...Permission
  }
  users {
    ...PermissionGroupMember
  }
}
    ${PermissionGroupFragmentDoc}
${ChannelFragmentDoc}
${PermissionFragmentDoc}
${PermissionGroupMemberFragmentDoc}`;
export const PluginConfigurationBaseFragmentDoc = gql`
    fragment PluginConfigurationBase on PluginConfiguration {
  active
  channel {
    id
    name
    slug
  }
}
    `;
export const PluginBaseFragmentDoc = gql`
    fragment PluginBase on Plugin {
  id
  name
  description
  channelConfigurations {
    ...PluginConfigurationBase
  }
  globalConfiguration {
    ...PluginConfigurationBase
  }
}
    ${PluginConfigurationBaseFragmentDoc}`;
export const ConfigurationItemFragmentDoc = gql`
    fragment ConfigurationItem on ConfigurationItem {
  name
  value
  type
  helpText
  label
}
    `;
export const PluginConfigurationExtendedFragmentDoc = gql`
    fragment PluginConfigurationExtended on PluginConfiguration {
  ...PluginConfigurationBase
  configuration {
    ...ConfigurationItem
  }
}
    ${PluginConfigurationBaseFragmentDoc}
${ConfigurationItemFragmentDoc}`;
export const PluginsDetailsFragmentDoc = gql`
    fragment PluginsDetails on Plugin {
  id
  name
  description
  globalConfiguration {
    ...PluginConfigurationExtended
  }
  channelConfigurations {
    ...PluginConfigurationExtended
  }
}
    ${PluginConfigurationExtendedFragmentDoc}`;
export const PaymentGatewayFragmentDoc = gql`
    fragment PaymentGateway on PaymentGateway {
  name
  id
}
    `;
export const ProductTypeFragmentDoc = gql`
    fragment ProductType on ProductType {
  id
  name
  slug
  kind
  hasVariants
  isShippingRequired
  taxClass {
    id
    name
  }
}
    `;
export const ProductTypeDetailsFragmentDoc = gql`
    fragment ProductTypeDetails on ProductType {
  ...ProductType
  ...Metadata
  productAttributes {
    ...Attribute
  }
  variantAttributes {
    ...Attribute
  }
  assignedVariantAttributes {
    attribute {
      ...Attribute
    }
    variantSelection
  }
  weight {
    unit
    value
  }
}
    ${ProductTypeFragmentDoc}
${MetadataFragmentDoc}
${AttributeFragmentDoc}`;
export const PriceRangeFragmentDoc = gql`
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
    ${MoneyFragmentDoc}`;
export const ChannelListingProductFragmentDoc = gql`
    fragment ChannelListingProduct on ProductChannelListing {
  ...ChannelListingProductWithoutPricing
  pricing {
    priceRange {
      ...PriceRange
    }
  }
}
    ${ChannelListingProductWithoutPricingFragmentDoc}
${PriceRangeFragmentDoc}`;
export const ProductWithChannelListingsFragmentDoc = gql`
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
    ${ChannelListingProductWithoutPricingFragmentDoc}
${PriceRangeFragmentDoc}`;
export const VariantAttributeFragmentDoc = gql`
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
  choices(
    first: $firstValues
    after: $afterValues
    last: $lastValues
    before: $beforeValues
  ) {
    ...AttributeValueList
  }
}
    ${AttributeValueListFragmentDoc}`;
export const ProductVariantAttributesFragmentDoc = gql`
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
    ${AttributeDetailsFragmentDoc}
${AttributeValueDetailsFragmentDoc}
${VariantAttributeFragmentDoc}`;
export const ProductMediaFragmentDoc = gql`
    fragment ProductMedia on ProductMedia {
  id
  alt
  sortOrder
  url(size: 1024)
  type
  oembedData
}
    `;
export const PreorderFragmentDoc = gql`
    fragment Preorder on PreorderData {
  globalThreshold
  globalSoldUnits
  endDate
}
    `;
export const ChannelListingProductVariantFragmentDoc = gql`
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
    ${AttributeValueDetailsFragmentDoc}
${StockFragmentDoc}
${PreorderFragmentDoc}
${ChannelListingProductVariantFragmentDoc}`;
export const WeightFragmentDoc = gql`
    fragment Weight on Weight {
  unit
  value
}
    `;
export const ProductFragmentDoc = gql`
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
    ${ProductVariantAttributesFragmentDoc}
${MetadataFragmentDoc}
${ChannelListingProductWithoutPricingFragmentDoc}
${ProductMediaFragmentDoc}
${ProductDetailsVariantFragmentDoc}
${WeightFragmentDoc}`;
export const SelectedVariantAttributeFragmentDoc = gql`
    fragment SelectedVariantAttribute on SelectedAttribute {
  attribute {
    ...VariantAttribute
  }
  values {
    ...AttributeValueDetails
  }
}
    ${VariantAttributeFragmentDoc}
${AttributeValueDetailsFragmentDoc}`;
export const ProductVariantFragmentDoc = gql`
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
    ${MetadataFragmentDoc}
${SelectedVariantAttributeFragmentDoc}
${ProductMediaFragmentDoc}
${ChannelListingProductVariantFragmentDoc}
${StockFragmentDoc}
${PreorderFragmentDoc}
${WeightFragmentDoc}`;
export const SearchProductFragmentDoc = gql`
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
    ${ChannelListingProductWithoutPricingFragmentDoc}`;
export const ExportFileFragmentDoc = gql`
    fragment ExportFile on ExportFile {
  id
  status
  url
}
    `;
export const ProductListAttributeFragmentDoc = gql`
    fragment ProductListAttribute on SelectedAttribute {
  attribute {
    id
  }
  values {
    ...AttributeValue
  }
}
    ${AttributeValueFragmentDoc}`;
export const ShippingMethodWithPostalCodesFragmentDoc = gql`
    fragment ShippingMethodWithPostalCodes on ShippingMethodType {
  id
  postalCodeRules {
    id
    inclusionType
    start
    end
  }
}
    `;
export const ShippingMethodTypeFragmentDoc = gql`
    fragment ShippingMethodType on ShippingMethodType {
  ...ShippingMethodWithPostalCodes
  ...Metadata
  taxClass {
    name
    id
  }
  minimumOrderWeight {
    unit
    value
  }
  maximumOrderWeight {
    unit
    value
  }
  minimumDeliveryDays
  maximumDeliveryDays
  name
  description
  type
  channelListings {
    id
    channel {
      id
      name
      currencyCode
    }
    price {
      ...Money
    }
    minimumOrderPrice {
      ...Money
    }
    maximumOrderPrice {
      ...Money
    }
  }
}
    ${ShippingMethodWithPostalCodesFragmentDoc}
${MetadataFragmentDoc}
${MoneyFragmentDoc}`;
export const ShippingMethodWithExcludedProductsFragmentDoc = gql`
    fragment ShippingMethodWithExcludedProducts on ShippingMethodType {
  ...ShippingMethodType
  excludedProducts(before: $before, after: $after, first: $first, last: $last) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    edges {
      node {
        id
        name
        thumbnail {
          url
        }
      }
    }
  }
}
    ${ShippingMethodTypeFragmentDoc}`;
export const CountryFragmentDoc = gql`
    fragment Country on CountryDisplay {
  country
  code
}
    `;
export const ShippingZoneFragmentDoc = gql`
    fragment ShippingZone on ShippingZone {
  ...Metadata
  id
  countries {
    ...Country
  }
  name
  description
  priceRange {
    start {
      ...Money
    }
    stop {
      ...Money
    }
  }
}
    ${MetadataFragmentDoc}
${CountryFragmentDoc}
${MoneyFragmentDoc}`;
export const ShippingZoneDetailsFragmentDoc = gql`
    fragment ShippingZoneDetails on ShippingZone {
  ...ShippingZone
  shippingMethods {
    ...ShippingMethodType
  }
  warehouses {
    id
    name
  }
}
    ${ShippingZoneFragmentDoc}
${ShippingMethodTypeFragmentDoc}`;
export const LanguageFragmentDoc = gql`
    fragment Language on LanguageDisplay {
  code
  language
}
    `;
export const LimitInfoFragmentDoc = gql`
    fragment LimitInfo on Limits {
  channels @include(if: $channels)
  orders @include(if: $orders)
  productVariants @include(if: $productVariants)
  staffUsers @include(if: $staffUsers)
  warehouses @include(if: $warehouses)
}
    `;
export const ShopLimitFragmentDoc = gql`
    fragment ShopLimit on Shop {
  limits {
    currentUsage {
      ...LimitInfo
    }
    allowedUsage {
      ...LimitInfo
    }
  }
}
    ${LimitInfoFragmentDoc}`;
export const ShopFragmentDoc = gql`
    fragment Shop on Shop {
  companyAddress {
    ...Address
  }
  countries {
    code
    country
  }
  customerSetPasswordUrl
  defaultMailSenderAddress
  defaultMailSenderName
  description
  domain {
    host
  }
  name
  reserveStockDurationAnonymousUser
  reserveStockDurationAuthenticatedUser
  limitQuantityPerCheckout
  enableAccountConfirmationByEmail
}
    ${AddressFragmentDoc}`;
export const StaffMemberDetailsFragmentDoc = gql`
    fragment StaffMemberDetails on User {
  ...StaffMember
  permissionGroups {
    id
    name
    userCanManage
  }
  userPermissions {
    code
    name
  }
  avatar(size: 512) {
    url
  }
  metadata {
    key
    value
  }
}
    ${StaffMemberFragmentDoc}`;
export const CountryWithCodeFragmentDoc = gql`
    fragment CountryWithCode on CountryDisplay {
  country
  code
}
    `;
export const TaxConfigurationPerCountryFragmentDoc = gql`
    fragment TaxConfigurationPerCountry on TaxConfigurationPerCountry {
  country {
    ...CountryWithCode
  }
  chargeTaxes
  taxCalculationStrategy
  taxAppId
  displayGrossPrices
}
    ${CountryWithCodeFragmentDoc}`;
export const TaxConfigurationFragmentDoc = gql`
    fragment TaxConfiguration on TaxConfiguration {
  id
  channel {
    id
    name
  }
  displayGrossPrices
  pricesEnteredWithTax
  chargeTaxes
  taxCalculationStrategy
  taxAppId
  countries {
    ...TaxConfigurationPerCountry
  }
}
    ${TaxConfigurationPerCountryFragmentDoc}`;
export const TaxCountryConfigurationFragmentDoc = gql`
    fragment TaxCountryConfiguration on TaxCountryConfiguration {
  country {
    ...CountryWithCode
  }
  taxClassCountryRates {
    rate
    taxClass {
      id
      name
    }
  }
}
    ${CountryWithCodeFragmentDoc}`;
export const TaxClassBaseFragmentDoc = gql`
    fragment TaxClassBase on TaxClass {
  id
  name
}
    `;
export const TaxRateFragmentDoc = gql`
    fragment TaxRate on TaxClassCountryRate {
  country {
    ...CountryWithCode
  }
  rate
}
    ${CountryWithCodeFragmentDoc}`;
export const TaxClassFragmentDoc = gql`
    fragment TaxClass on TaxClass {
  ...TaxClassBase
  countries {
    ...TaxRate
  }
  ...Metadata
}
    ${TaxClassBaseFragmentDoc}
${TaxRateFragmentDoc}
${MetadataFragmentDoc}`;
export const TimePeriodFragmentDoc = gql`
    fragment TimePeriod on TimePeriod {
  amount
  type
}
    `;
export const CategoryTranslationFragmentDoc = gql`
    fragment CategoryTranslation on CategoryTranslatableContent {
  translation(languageCode: $language) {
    id
    description
    language {
      language
    }
    name
    seoDescription
    seoTitle
  }
  category {
    id
    name
    description
    seoDescription
    seoTitle
  }
}
    `;
export const CollectionTranslationFragmentDoc = gql`
    fragment CollectionTranslation on CollectionTranslatableContent {
  collection {
    id
    name
    description
    seoDescription
    seoTitle
  }
  translation(languageCode: $language) {
    id
    description
    language {
      language
    }
    name
    seoDescription
    seoTitle
  }
}
    `;
export const AttributeValueTranslatableFragmentDoc = gql`
    fragment AttributeValueTranslatable on AttributeValueTranslatableContent {
  id
  name
  plainText
  richText
  attributeValue {
    id
  }
  attribute {
    id
    name
  }
  translation(languageCode: $language) {
    id
    name
    plainText
    richText
    language {
      code
      language
    }
  }
}
    `;
export const ProductTranslationFragmentDoc = gql`
    fragment ProductTranslation on ProductTranslatableContent {
  product {
    id
    name
    description
    seoDescription
    seoTitle
  }
  translation(languageCode: $language) {
    id
    seoTitle
    seoDescription
    name
    description
    language {
      code
      language
    }
  }
  attributeValues {
    ...AttributeValueTranslatable
  }
}
    ${AttributeValueTranslatableFragmentDoc}`;
export const ProductVariantTranslationFragmentDoc = gql`
    fragment ProductVariantTranslation on ProductVariantTranslatableContent {
  productVariant {
    id
  }
  name
  translation(languageCode: $language) {
    id
    name
    language {
      code
      language
    }
  }
  attributeValues {
    ...AttributeValueTranslatable
  }
}
    ${AttributeValueTranslatableFragmentDoc}`;
export const SaleTranslationFragmentDoc = gql`
    fragment SaleTranslation on SaleTranslatableContent {
  sale {
    id
    name
  }
  translation(languageCode: $language) {
    id
    language {
      code
      language
    }
    name
  }
}
    `;
export const VoucherTranslationFragmentDoc = gql`
    fragment VoucherTranslation on VoucherTranslatableContent {
  name
  voucher {
    id
    name
  }
  translation(languageCode: $language) {
    id
    language {
      code
      language
    }
    name
  }
}
    `;
export const ShippingMethodTranslationFragmentDoc = gql`
    fragment ShippingMethodTranslation on ShippingMethodTranslatableContent {
  id
  name
  description
  shippingMethod {
    id
  }
  translation(languageCode: $language) {
    id
    language {
      code
      language
    }
    name
    description
  }
}
    `;
export const PageTranslationFragmentDoc = gql`
    fragment PageTranslation on PageTranslatableContent {
  page {
    id
    content
    seoDescription
    seoTitle
    title
  }
  translation(languageCode: $language) {
    id
    content
    seoDescription
    seoTitle
    title
    language {
      code
      language
    }
  }
  attributeValues {
    ...AttributeValueTranslatable
  }
}
    ${AttributeValueTranslatableFragmentDoc}`;
export const PageTranslatableFragmentDoc = gql`
    fragment PageTranslatable on PageTranslatableContent {
  id
  content
  seoDescription
  seoTitle
  title
  translation(languageCode: $language) {
    id
    content
    seoDescription
    seoTitle
    title
    language {
      code
      language
    }
  }
}
    `;
export const AttributeTranslationFragmentDoc = gql`
    fragment AttributeTranslation on AttributeTranslatableContent {
  id
  name
  translation(languageCode: $language) {
    id
    name
  }
  attribute {
    id
    name
    inputType
  }
}
    `;
export const AttributeChoicesTranslationFragmentDoc = gql`
    fragment AttributeChoicesTranslation on AttributeValueCountableConnection {
  pageInfo {
    ...PageInfo
  }
  edges {
    cursor
    node {
      id
      name
      plainText
      richText
      inputType
      translation(languageCode: $language) {
        id
        name
        plainText
        richText
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;
export const AttributeTranslationDetailsFragmentDoc = gql`
    fragment AttributeTranslationDetails on AttributeTranslatableContent {
  translation(languageCode: $language) {
    id
    name
  }
  attribute {
    id
    name
    inputType
    withChoices
    choices(
      first: $firstValues
      after: $afterValues
      last: $lastValues
      before: $beforeValues
    ) {
      ...AttributeChoicesTranslation
    }
  }
}
    ${AttributeChoicesTranslationFragmentDoc}`;
export const MenuItemTranslationFragmentDoc = gql`
    fragment MenuItemTranslation on MenuItemTranslatableContent {
  translation(languageCode: $language) {
    id
    language {
      language
    }
    name
  }
  menuItem {
    id
    name
  }
}
    `;
export const WarehouseWithShippingFragmentDoc = gql`
    fragment WarehouseWithShipping on Warehouse {
  ...Warehouse
  shippingZones(first: 100) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    ${WarehouseFragmentDoc}`;
export const WarehouseDetailsFragmentDoc = gql`
    fragment WarehouseDetails on Warehouse {
  isPrivate
  clickAndCollectOption
  ...WarehouseWithShipping
  address {
    ...Address
  }
  email
}
    ${WarehouseWithShippingFragmentDoc}
${AddressFragmentDoc}`;
export const WebhookDetailsFragmentDoc = gql`
    fragment WebhookDetails on Webhook {
  ...Webhook
  syncEvents {
    eventType
  }
  asyncEvents {
    eventType
  }
  secretKey
  targetUrl
  subscriptionQuery
  customHeaders
}
    ${WebhookFragmentDoc}`;
export const AttributeBulkDeleteDocument = gql`
    mutation AttributeBulkDelete($ids: [ID!]!) {
  attributeBulkDelete(ids: $ids) {
    errors {
      ...AttributeError
    }
  }
}
    ${AttributeErrorFragmentDoc}`;
export type AttributeBulkDeleteMutationFn = Apollo.MutationFunction<Types.AttributeBulkDeleteMutation, Types.AttributeBulkDeleteMutationVariables>;

/**
 * __useAttributeBulkDeleteMutation__
 *
 * To run a mutation, you first call `useAttributeBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttributeBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attributeBulkDeleteMutation, { data, loading, error }] = useAttributeBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useAttributeBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AttributeBulkDeleteMutation, Types.AttributeBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AttributeBulkDeleteMutation, Types.AttributeBulkDeleteMutationVariables>(AttributeBulkDeleteDocument, options);
      }
export type AttributeBulkDeleteMutationHookResult = ReturnType<typeof useAttributeBulkDeleteMutation>;
export type AttributeBulkDeleteMutationResult = Apollo.MutationResult<Types.AttributeBulkDeleteMutation>;
export type AttributeBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.AttributeBulkDeleteMutation, Types.AttributeBulkDeleteMutationVariables>;
export const AttributeDeleteDocument = gql`
    mutation AttributeDelete($id: ID!) {
  attributeDelete(id: $id) {
    errors {
      ...AttributeError
    }
  }
}
    ${AttributeErrorFragmentDoc}`;
export type AttributeDeleteMutationFn = Apollo.MutationFunction<Types.AttributeDeleteMutation, Types.AttributeDeleteMutationVariables>;

/**
 * __useAttributeDeleteMutation__
 *
 * To run a mutation, you first call `useAttributeDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttributeDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attributeDeleteMutation, { data, loading, error }] = useAttributeDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAttributeDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AttributeDeleteMutation, Types.AttributeDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AttributeDeleteMutation, Types.AttributeDeleteMutationVariables>(AttributeDeleteDocument, options);
      }
export type AttributeDeleteMutationHookResult = ReturnType<typeof useAttributeDeleteMutation>;
export type AttributeDeleteMutationResult = Apollo.MutationResult<Types.AttributeDeleteMutation>;
export type AttributeDeleteMutationOptions = Apollo.BaseMutationOptions<Types.AttributeDeleteMutation, Types.AttributeDeleteMutationVariables>;
export const AttributeUpdateDocument = gql`
    mutation AttributeUpdate($id: ID!, $input: AttributeUpdateInput!) {
  attributeUpdate(id: $id, input: $input) {
    attribute {
      ...Attribute
    }
    errors {
      ...AttributeError
    }
  }
}
    ${AttributeFragmentDoc}
${AttributeErrorFragmentDoc}`;
export type AttributeUpdateMutationFn = Apollo.MutationFunction<Types.AttributeUpdateMutation, Types.AttributeUpdateMutationVariables>;

/**
 * __useAttributeUpdateMutation__
 *
 * To run a mutation, you first call `useAttributeUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttributeUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attributeUpdateMutation, { data, loading, error }] = useAttributeUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAttributeUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AttributeUpdateMutation, Types.AttributeUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AttributeUpdateMutation, Types.AttributeUpdateMutationVariables>(AttributeUpdateDocument, options);
      }
export type AttributeUpdateMutationHookResult = ReturnType<typeof useAttributeUpdateMutation>;
export type AttributeUpdateMutationResult = Apollo.MutationResult<Types.AttributeUpdateMutation>;
export type AttributeUpdateMutationOptions = Apollo.BaseMutationOptions<Types.AttributeUpdateMutation, Types.AttributeUpdateMutationVariables>;
export const AttributeValueDeleteDocument = gql`
    mutation AttributeValueDelete($id: ID!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  attributeValueDelete(id: $id) {
    attribute {
      id
      choices(
        first: $firstValues
        after: $afterValues
        last: $lastValues
        before: $beforeValues
      ) {
        ...AttributeValueList
      }
    }
    errors {
      ...AttributeError
    }
  }
}
    ${AttributeValueListFragmentDoc}
${AttributeErrorFragmentDoc}`;
export type AttributeValueDeleteMutationFn = Apollo.MutationFunction<Types.AttributeValueDeleteMutation, Types.AttributeValueDeleteMutationVariables>;

/**
 * __useAttributeValueDeleteMutation__
 *
 * To run a mutation, you first call `useAttributeValueDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttributeValueDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attributeValueDeleteMutation, { data, loading, error }] = useAttributeValueDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useAttributeValueDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AttributeValueDeleteMutation, Types.AttributeValueDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AttributeValueDeleteMutation, Types.AttributeValueDeleteMutationVariables>(AttributeValueDeleteDocument, options);
      }
export type AttributeValueDeleteMutationHookResult = ReturnType<typeof useAttributeValueDeleteMutation>;
export type AttributeValueDeleteMutationResult = Apollo.MutationResult<Types.AttributeValueDeleteMutation>;
export type AttributeValueDeleteMutationOptions = Apollo.BaseMutationOptions<Types.AttributeValueDeleteMutation, Types.AttributeValueDeleteMutationVariables>;
export const AttributeValueUpdateDocument = gql`
    mutation AttributeValueUpdate($id: ID!, $input: AttributeValueUpdateInput!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  attributeValueUpdate(id: $id, input: $input) {
    attribute {
      id
      choices(
        first: $firstValues
        after: $afterValues
        last: $lastValues
        before: $beforeValues
      ) {
        ...AttributeValueList
      }
    }
    errors {
      ...AttributeError
    }
  }
}
    ${AttributeValueListFragmentDoc}
${AttributeErrorFragmentDoc}`;
export type AttributeValueUpdateMutationFn = Apollo.MutationFunction<Types.AttributeValueUpdateMutation, Types.AttributeValueUpdateMutationVariables>;

/**
 * __useAttributeValueUpdateMutation__
 *
 * To run a mutation, you first call `useAttributeValueUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttributeValueUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attributeValueUpdateMutation, { data, loading, error }] = useAttributeValueUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useAttributeValueUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AttributeValueUpdateMutation, Types.AttributeValueUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AttributeValueUpdateMutation, Types.AttributeValueUpdateMutationVariables>(AttributeValueUpdateDocument, options);
      }
export type AttributeValueUpdateMutationHookResult = ReturnType<typeof useAttributeValueUpdateMutation>;
export type AttributeValueUpdateMutationResult = Apollo.MutationResult<Types.AttributeValueUpdateMutation>;
export type AttributeValueUpdateMutationOptions = Apollo.BaseMutationOptions<Types.AttributeValueUpdateMutation, Types.AttributeValueUpdateMutationVariables>;
export const AttributeValueCreateDocument = gql`
    mutation AttributeValueCreate($id: ID!, $input: AttributeValueCreateInput!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  attributeValueCreate(attribute: $id, input: $input) {
    attribute {
      id
      choices(
        first: $firstValues
        after: $afterValues
        last: $lastValues
        before: $beforeValues
      ) {
        ...AttributeValueList
      }
    }
    errors {
      ...AttributeError
    }
  }
}
    ${AttributeValueListFragmentDoc}
${AttributeErrorFragmentDoc}`;
export type AttributeValueCreateMutationFn = Apollo.MutationFunction<Types.AttributeValueCreateMutation, Types.AttributeValueCreateMutationVariables>;

/**
 * __useAttributeValueCreateMutation__
 *
 * To run a mutation, you first call `useAttributeValueCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttributeValueCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attributeValueCreateMutation, { data, loading, error }] = useAttributeValueCreateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useAttributeValueCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AttributeValueCreateMutation, Types.AttributeValueCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AttributeValueCreateMutation, Types.AttributeValueCreateMutationVariables>(AttributeValueCreateDocument, options);
      }
export type AttributeValueCreateMutationHookResult = ReturnType<typeof useAttributeValueCreateMutation>;
export type AttributeValueCreateMutationResult = Apollo.MutationResult<Types.AttributeValueCreateMutation>;
export type AttributeValueCreateMutationOptions = Apollo.BaseMutationOptions<Types.AttributeValueCreateMutation, Types.AttributeValueCreateMutationVariables>;
export const AttributeCreateDocument = gql`
    mutation AttributeCreate($input: AttributeCreateInput!) {
  attributeCreate(input: $input) {
    attribute {
      id
    }
    errors {
      ...AttributeError
    }
  }
}
    ${AttributeErrorFragmentDoc}`;
export type AttributeCreateMutationFn = Apollo.MutationFunction<Types.AttributeCreateMutation, Types.AttributeCreateMutationVariables>;

/**
 * __useAttributeCreateMutation__
 *
 * To run a mutation, you first call `useAttributeCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttributeCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attributeCreateMutation, { data, loading, error }] = useAttributeCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAttributeCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AttributeCreateMutation, Types.AttributeCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AttributeCreateMutation, Types.AttributeCreateMutationVariables>(AttributeCreateDocument, options);
      }
export type AttributeCreateMutationHookResult = ReturnType<typeof useAttributeCreateMutation>;
export type AttributeCreateMutationResult = Apollo.MutationResult<Types.AttributeCreateMutation>;
export type AttributeCreateMutationOptions = Apollo.BaseMutationOptions<Types.AttributeCreateMutation, Types.AttributeCreateMutationVariables>;
export const AttributeValueReorderDocument = gql`
    mutation AttributeValueReorder($id: ID!, $move: ReorderInput!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  attributeReorderValues(attributeId: $id, moves: [$move]) {
    attribute {
      id
      choices(
        first: $firstValues
        after: $afterValues
        last: $lastValues
        before: $beforeValues
      ) {
        pageInfo {
          ...PageInfo
        }
        edges {
          cursor
          node {
            id
          }
        }
      }
    }
    errors {
      ...AttributeError
    }
  }
}
    ${PageInfoFragmentDoc}
${AttributeErrorFragmentDoc}`;
export type AttributeValueReorderMutationFn = Apollo.MutationFunction<Types.AttributeValueReorderMutation, Types.AttributeValueReorderMutationVariables>;

/**
 * __useAttributeValueReorderMutation__
 *
 * To run a mutation, you first call `useAttributeValueReorderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttributeValueReorderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attributeValueReorderMutation, { data, loading, error }] = useAttributeValueReorderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      move: // value for 'move'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useAttributeValueReorderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AttributeValueReorderMutation, Types.AttributeValueReorderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AttributeValueReorderMutation, Types.AttributeValueReorderMutationVariables>(AttributeValueReorderDocument, options);
      }
export type AttributeValueReorderMutationHookResult = ReturnType<typeof useAttributeValueReorderMutation>;
export type AttributeValueReorderMutationResult = Apollo.MutationResult<Types.AttributeValueReorderMutation>;
export type AttributeValueReorderMutationOptions = Apollo.BaseMutationOptions<Types.AttributeValueReorderMutation, Types.AttributeValueReorderMutationVariables>;
export const AttributeDetailsDocument = gql`
    query AttributeDetails($id: ID!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  attribute(id: $id) {
    ...AttributeDetails
    ...Metadata
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
    ${AttributeDetailsFragmentDoc}
${MetadataFragmentDoc}
${AttributeValueListFragmentDoc}`;

/**
 * __useAttributeDetailsQuery__
 *
 * To run a query within a React component, call `useAttributeDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttributeDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttributeDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useAttributeDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AttributeDetailsQuery, Types.AttributeDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AttributeDetailsQuery, Types.AttributeDetailsQueryVariables>(AttributeDetailsDocument, options);
      }
export function useAttributeDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AttributeDetailsQuery, Types.AttributeDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AttributeDetailsQuery, Types.AttributeDetailsQueryVariables>(AttributeDetailsDocument, options);
        }
export type AttributeDetailsQueryHookResult = ReturnType<typeof useAttributeDetailsQuery>;
export type AttributeDetailsLazyQueryHookResult = ReturnType<typeof useAttributeDetailsLazyQuery>;
export type AttributeDetailsQueryResult = Apollo.QueryResult<Types.AttributeDetailsQuery, Types.AttributeDetailsQueryVariables>;
export const AttributeListDocument = gql`
    query AttributeList($filter: AttributeFilterInput, $before: String, $after: String, $first: Int, $last: Int, $sort: AttributeSortingInput) {
  attributes(
    filter: $filter
    before: $before
    after: $after
    first: $first
    last: $last
    sortBy: $sort
  ) {
    edges {
      node {
        ...Attribute
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${AttributeFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useAttributeListQuery__
 *
 * To run a query within a React component, call `useAttributeListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttributeListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttributeListQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useAttributeListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.AttributeListQuery, Types.AttributeListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AttributeListQuery, Types.AttributeListQueryVariables>(AttributeListDocument, options);
      }
export function useAttributeListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AttributeListQuery, Types.AttributeListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AttributeListQuery, Types.AttributeListQueryVariables>(AttributeListDocument, options);
        }
export type AttributeListQueryHookResult = ReturnType<typeof useAttributeListQuery>;
export type AttributeListLazyQueryHookResult = ReturnType<typeof useAttributeListLazyQuery>;
export type AttributeListQueryResult = Apollo.QueryResult<Types.AttributeListQuery, Types.AttributeListQueryVariables>;
export const RequestPasswordResetDocument = gql`
    mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
  requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
    errors {
      ...AccountError
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type RequestPasswordResetMutationFn = Apollo.MutationFunction<Types.RequestPasswordResetMutation, Types.RequestPasswordResetMutationVariables>;

/**
 * __useRequestPasswordResetMutation__
 *
 * To run a mutation, you first call `useRequestPasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestPasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestPasswordResetMutation, { data, loading, error }] = useRequestPasswordResetMutation({
 *   variables: {
 *      email: // value for 'email'
 *      redirectUrl: // value for 'redirectUrl'
 *   },
 * });
 */
export function useRequestPasswordResetMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.RequestPasswordResetMutation, Types.RequestPasswordResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.RequestPasswordResetMutation, Types.RequestPasswordResetMutationVariables>(RequestPasswordResetDocument, options);
      }
export type RequestPasswordResetMutationHookResult = ReturnType<typeof useRequestPasswordResetMutation>;
export type RequestPasswordResetMutationResult = Apollo.MutationResult<Types.RequestPasswordResetMutation>;
export type RequestPasswordResetMutationOptions = Apollo.BaseMutationOptions<Types.RequestPasswordResetMutation, Types.RequestPasswordResetMutationVariables>;
export const AvailableExternalAuthenticationsDocument = gql`
    query AvailableExternalAuthentications {
  shop {
    availableExternalAuthentications {
      id
      name
    }
  }
}
    `;

/**
 * __useAvailableExternalAuthenticationsQuery__
 *
 * To run a query within a React component, call `useAvailableExternalAuthenticationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableExternalAuthenticationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableExternalAuthenticationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableExternalAuthenticationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.AvailableExternalAuthenticationsQuery, Types.AvailableExternalAuthenticationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AvailableExternalAuthenticationsQuery, Types.AvailableExternalAuthenticationsQueryVariables>(AvailableExternalAuthenticationsDocument, options);
      }
export function useAvailableExternalAuthenticationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AvailableExternalAuthenticationsQuery, Types.AvailableExternalAuthenticationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AvailableExternalAuthenticationsQuery, Types.AvailableExternalAuthenticationsQueryVariables>(AvailableExternalAuthenticationsDocument, options);
        }
export type AvailableExternalAuthenticationsQueryHookResult = ReturnType<typeof useAvailableExternalAuthenticationsQuery>;
export type AvailableExternalAuthenticationsLazyQueryHookResult = ReturnType<typeof useAvailableExternalAuthenticationsLazyQuery>;
export type AvailableExternalAuthenticationsQueryResult = Apollo.QueryResult<Types.AvailableExternalAuthenticationsQuery, Types.AvailableExternalAuthenticationsQueryVariables>;
export const UserDetailsDocument = gql`
    query UserDetails {
  me {
    ...User
  }
}
    ${UserFragmentDoc}`;

/**
 * __useUserDetailsQuery__
 *
 * To run a query within a React component, call `useUserDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserDetailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserDetailsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.UserDetailsQuery, Types.UserDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.UserDetailsQuery, Types.UserDetailsQueryVariables>(UserDetailsDocument, options);
      }
export function useUserDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.UserDetailsQuery, Types.UserDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.UserDetailsQuery, Types.UserDetailsQueryVariables>(UserDetailsDocument, options);
        }
export type UserDetailsQueryHookResult = ReturnType<typeof useUserDetailsQuery>;
export type UserDetailsLazyQueryHookResult = ReturnType<typeof useUserDetailsLazyQuery>;
export type UserDetailsQueryResult = Apollo.QueryResult<Types.UserDetailsQuery, Types.UserDetailsQueryVariables>;
export const CategoryDeleteDocument = gql`
    mutation CategoryDelete($id: ID!) {
  categoryDelete(id: $id) {
    errors {
      ...ProductError
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type CategoryDeleteMutationFn = Apollo.MutationFunction<Types.CategoryDeleteMutation, Types.CategoryDeleteMutationVariables>;

/**
 * __useCategoryDeleteMutation__
 *
 * To run a mutation, you first call `useCategoryDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCategoryDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [categoryDeleteMutation, { data, loading, error }] = useCategoryDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCategoryDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CategoryDeleteMutation, Types.CategoryDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CategoryDeleteMutation, Types.CategoryDeleteMutationVariables>(CategoryDeleteDocument, options);
      }
export type CategoryDeleteMutationHookResult = ReturnType<typeof useCategoryDeleteMutation>;
export type CategoryDeleteMutationResult = Apollo.MutationResult<Types.CategoryDeleteMutation>;
export type CategoryDeleteMutationOptions = Apollo.BaseMutationOptions<Types.CategoryDeleteMutation, Types.CategoryDeleteMutationVariables>;
export const CategoryCreateDocument = gql`
    mutation CategoryCreate($parent: ID, $input: CategoryInput!) {
  categoryCreate(parent: $parent, input: $input) {
    category {
      ...CategoryDetails
    }
    errors {
      ...ProductError
    }
  }
}
    ${CategoryDetailsFragmentDoc}
${ProductErrorFragmentDoc}`;
export type CategoryCreateMutationFn = Apollo.MutationFunction<Types.CategoryCreateMutation, Types.CategoryCreateMutationVariables>;

/**
 * __useCategoryCreateMutation__
 *
 * To run a mutation, you first call `useCategoryCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCategoryCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [categoryCreateMutation, { data, loading, error }] = useCategoryCreateMutation({
 *   variables: {
 *      parent: // value for 'parent'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCategoryCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CategoryCreateMutation, Types.CategoryCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CategoryCreateMutation, Types.CategoryCreateMutationVariables>(CategoryCreateDocument, options);
      }
export type CategoryCreateMutationHookResult = ReturnType<typeof useCategoryCreateMutation>;
export type CategoryCreateMutationResult = Apollo.MutationResult<Types.CategoryCreateMutation>;
export type CategoryCreateMutationOptions = Apollo.BaseMutationOptions<Types.CategoryCreateMutation, Types.CategoryCreateMutationVariables>;
export const CategoryUpdateDocument = gql`
    mutation CategoryUpdate($id: ID!, $input: CategoryInput!) {
  categoryUpdate(id: $id, input: $input) {
    category {
      ...CategoryDetails
    }
    errors {
      ...ProductError
    }
  }
}
    ${CategoryDetailsFragmentDoc}
${ProductErrorFragmentDoc}`;
export type CategoryUpdateMutationFn = Apollo.MutationFunction<Types.CategoryUpdateMutation, Types.CategoryUpdateMutationVariables>;

/**
 * __useCategoryUpdateMutation__
 *
 * To run a mutation, you first call `useCategoryUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCategoryUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [categoryUpdateMutation, { data, loading, error }] = useCategoryUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCategoryUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CategoryUpdateMutation, Types.CategoryUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CategoryUpdateMutation, Types.CategoryUpdateMutationVariables>(CategoryUpdateDocument, options);
      }
export type CategoryUpdateMutationHookResult = ReturnType<typeof useCategoryUpdateMutation>;
export type CategoryUpdateMutationResult = Apollo.MutationResult<Types.CategoryUpdateMutation>;
export type CategoryUpdateMutationOptions = Apollo.BaseMutationOptions<Types.CategoryUpdateMutation, Types.CategoryUpdateMutationVariables>;
export const CategoryBulkDeleteDocument = gql`
    mutation CategoryBulkDelete($ids: [ID!]!) {
  categoryBulkDelete(ids: $ids) {
    errors {
      ...ProductError
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type CategoryBulkDeleteMutationFn = Apollo.MutationFunction<Types.CategoryBulkDeleteMutation, Types.CategoryBulkDeleteMutationVariables>;

/**
 * __useCategoryBulkDeleteMutation__
 *
 * To run a mutation, you first call `useCategoryBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCategoryBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [categoryBulkDeleteMutation, { data, loading, error }] = useCategoryBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useCategoryBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CategoryBulkDeleteMutation, Types.CategoryBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CategoryBulkDeleteMutation, Types.CategoryBulkDeleteMutationVariables>(CategoryBulkDeleteDocument, options);
      }
export type CategoryBulkDeleteMutationHookResult = ReturnType<typeof useCategoryBulkDeleteMutation>;
export type CategoryBulkDeleteMutationResult = Apollo.MutationResult<Types.CategoryBulkDeleteMutation>;
export type CategoryBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.CategoryBulkDeleteMutation, Types.CategoryBulkDeleteMutationVariables>;
export const RootCategoriesDocument = gql`
    query RootCategories($first: Int, $after: String, $last: Int, $before: String, $filter: CategoryFilterInput, $sort: CategorySortingInput) {
  categories(
    level: 0
    first: $first
    after: $after
    last: $last
    before: $before
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        ...Category
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${CategoryFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useRootCategoriesQuery__
 *
 * To run a query within a React component, call `useRootCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootCategoriesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useRootCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.RootCategoriesQuery, Types.RootCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.RootCategoriesQuery, Types.RootCategoriesQueryVariables>(RootCategoriesDocument, options);
      }
export function useRootCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.RootCategoriesQuery, Types.RootCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.RootCategoriesQuery, Types.RootCategoriesQueryVariables>(RootCategoriesDocument, options);
        }
export type RootCategoriesQueryHookResult = ReturnType<typeof useRootCategoriesQuery>;
export type RootCategoriesLazyQueryHookResult = ReturnType<typeof useRootCategoriesLazyQuery>;
export type RootCategoriesQueryResult = Apollo.QueryResult<Types.RootCategoriesQuery, Types.RootCategoriesQueryVariables>;
export const CategoryDetailsDocument = gql`
    query CategoryDetails($id: ID!, $first: Int, $after: String, $last: Int, $before: String) {
  category(id: $id) {
    ...CategoryDetails
    children(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          ...Category
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
    products(first: $first, after: $after, last: $last, before: $before) {
      pageInfo {
        ...PageInfo
      }
      edges {
        cursor
        node {
          id
          name
          thumbnail {
            url
          }
        }
      }
    }
  }
}
    ${CategoryDetailsFragmentDoc}
${CategoryFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useCategoryDetailsQuery__
 *
 * To run a query within a React component, call `useCategoryDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useCategoryDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CategoryDetailsQuery, Types.CategoryDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CategoryDetailsQuery, Types.CategoryDetailsQueryVariables>(CategoryDetailsDocument, options);
      }
export function useCategoryDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CategoryDetailsQuery, Types.CategoryDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CategoryDetailsQuery, Types.CategoryDetailsQueryVariables>(CategoryDetailsDocument, options);
        }
export type CategoryDetailsQueryHookResult = ReturnType<typeof useCategoryDetailsQuery>;
export type CategoryDetailsLazyQueryHookResult = ReturnType<typeof useCategoryDetailsLazyQuery>;
export type CategoryDetailsQueryResult = Apollo.QueryResult<Types.CategoryDetailsQuery, Types.CategoryDetailsQueryVariables>;
export const ChannelCreateDocument = gql`
    mutation ChannelCreate($input: ChannelCreateInput!) {
  channelCreate(input: $input) {
    channel {
      ...ChannelDetails
    }
    errors {
      ...ChannelError
    }
  }
}
    ${ChannelDetailsFragmentDoc}
${ChannelErrorFragmentDoc}`;
export type ChannelCreateMutationFn = Apollo.MutationFunction<Types.ChannelCreateMutation, Types.ChannelCreateMutationVariables>;

/**
 * __useChannelCreateMutation__
 *
 * To run a mutation, you first call `useChannelCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelCreateMutation, { data, loading, error }] = useChannelCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChannelCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChannelCreateMutation, Types.ChannelCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChannelCreateMutation, Types.ChannelCreateMutationVariables>(ChannelCreateDocument, options);
      }
export type ChannelCreateMutationHookResult = ReturnType<typeof useChannelCreateMutation>;
export type ChannelCreateMutationResult = Apollo.MutationResult<Types.ChannelCreateMutation>;
export type ChannelCreateMutationOptions = Apollo.BaseMutationOptions<Types.ChannelCreateMutation, Types.ChannelCreateMutationVariables>;
export const ChannelUpdateDocument = gql`
    mutation ChannelUpdate($id: ID!, $input: ChannelUpdateInput!) {
  channelUpdate(id: $id, input: $input) {
    channel {
      ...ChannelDetails
    }
    errors {
      ...ChannelError
    }
  }
}
    ${ChannelDetailsFragmentDoc}
${ChannelErrorFragmentDoc}`;
export type ChannelUpdateMutationFn = Apollo.MutationFunction<Types.ChannelUpdateMutation, Types.ChannelUpdateMutationVariables>;

/**
 * __useChannelUpdateMutation__
 *
 * To run a mutation, you first call `useChannelUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelUpdateMutation, { data, loading, error }] = useChannelUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChannelUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChannelUpdateMutation, Types.ChannelUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChannelUpdateMutation, Types.ChannelUpdateMutationVariables>(ChannelUpdateDocument, options);
      }
export type ChannelUpdateMutationHookResult = ReturnType<typeof useChannelUpdateMutation>;
export type ChannelUpdateMutationResult = Apollo.MutationResult<Types.ChannelUpdateMutation>;
export type ChannelUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ChannelUpdateMutation, Types.ChannelUpdateMutationVariables>;
export const ChannelDeleteDocument = gql`
    mutation ChannelDelete($id: ID!, $input: ChannelDeleteInput) {
  channelDelete(id: $id, input: $input) {
    errors {
      ...ChannelError
    }
  }
}
    ${ChannelErrorFragmentDoc}`;
export type ChannelDeleteMutationFn = Apollo.MutationFunction<Types.ChannelDeleteMutation, Types.ChannelDeleteMutationVariables>;

/**
 * __useChannelDeleteMutation__
 *
 * To run a mutation, you first call `useChannelDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelDeleteMutation, { data, loading, error }] = useChannelDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChannelDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChannelDeleteMutation, Types.ChannelDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChannelDeleteMutation, Types.ChannelDeleteMutationVariables>(ChannelDeleteDocument, options);
      }
export type ChannelDeleteMutationHookResult = ReturnType<typeof useChannelDeleteMutation>;
export type ChannelDeleteMutationResult = Apollo.MutationResult<Types.ChannelDeleteMutation>;
export type ChannelDeleteMutationOptions = Apollo.BaseMutationOptions<Types.ChannelDeleteMutation, Types.ChannelDeleteMutationVariables>;
export const ChannelActivateDocument = gql`
    mutation ChannelActivate($id: ID!) {
  channelActivate(id: $id) {
    channel {
      ...ChannelDetails
    }
    errors {
      ...ChannelError
    }
  }
}
    ${ChannelDetailsFragmentDoc}
${ChannelErrorFragmentDoc}`;
export type ChannelActivateMutationFn = Apollo.MutationFunction<Types.ChannelActivateMutation, Types.ChannelActivateMutationVariables>;

/**
 * __useChannelActivateMutation__
 *
 * To run a mutation, you first call `useChannelActivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelActivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelActivateMutation, { data, loading, error }] = useChannelActivateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChannelActivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChannelActivateMutation, Types.ChannelActivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChannelActivateMutation, Types.ChannelActivateMutationVariables>(ChannelActivateDocument, options);
      }
export type ChannelActivateMutationHookResult = ReturnType<typeof useChannelActivateMutation>;
export type ChannelActivateMutationResult = Apollo.MutationResult<Types.ChannelActivateMutation>;
export type ChannelActivateMutationOptions = Apollo.BaseMutationOptions<Types.ChannelActivateMutation, Types.ChannelActivateMutationVariables>;
export const ChannelDeactivateDocument = gql`
    mutation ChannelDeactivate($id: ID!) {
  channelDeactivate(id: $id) {
    channel {
      ...ChannelDetails
    }
    errors {
      ...ChannelError
    }
  }
}
    ${ChannelDetailsFragmentDoc}
${ChannelErrorFragmentDoc}`;
export type ChannelDeactivateMutationFn = Apollo.MutationFunction<Types.ChannelDeactivateMutation, Types.ChannelDeactivateMutationVariables>;

/**
 * __useChannelDeactivateMutation__
 *
 * To run a mutation, you first call `useChannelDeactivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelDeactivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelDeactivateMutation, { data, loading, error }] = useChannelDeactivateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChannelDeactivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChannelDeactivateMutation, Types.ChannelDeactivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChannelDeactivateMutation, Types.ChannelDeactivateMutationVariables>(ChannelDeactivateDocument, options);
      }
export type ChannelDeactivateMutationHookResult = ReturnType<typeof useChannelDeactivateMutation>;
export type ChannelDeactivateMutationResult = Apollo.MutationResult<Types.ChannelDeactivateMutation>;
export type ChannelDeactivateMutationOptions = Apollo.BaseMutationOptions<Types.ChannelDeactivateMutation, Types.ChannelDeactivateMutationVariables>;
export const ChannelReorderWarehousesDocument = gql`
    mutation ChannelReorderWarehouses($channelId: ID!, $moves: [ReorderInput!]!) {
  channelReorderWarehouses(channelId: $channelId, moves: $moves) {
    channel {
      ...ChannelDetails
    }
    errors {
      ...ChannelError
    }
  }
}
    ${ChannelDetailsFragmentDoc}
${ChannelErrorFragmentDoc}`;
export type ChannelReorderWarehousesMutationFn = Apollo.MutationFunction<Types.ChannelReorderWarehousesMutation, Types.ChannelReorderWarehousesMutationVariables>;

/**
 * __useChannelReorderWarehousesMutation__
 *
 * To run a mutation, you first call `useChannelReorderWarehousesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelReorderWarehousesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelReorderWarehousesMutation, { data, loading, error }] = useChannelReorderWarehousesMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      moves: // value for 'moves'
 *   },
 * });
 */
export function useChannelReorderWarehousesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChannelReorderWarehousesMutation, Types.ChannelReorderWarehousesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChannelReorderWarehousesMutation, Types.ChannelReorderWarehousesMutationVariables>(ChannelReorderWarehousesDocument, options);
      }
export type ChannelReorderWarehousesMutationHookResult = ReturnType<typeof useChannelReorderWarehousesMutation>;
export type ChannelReorderWarehousesMutationResult = Apollo.MutationResult<Types.ChannelReorderWarehousesMutation>;
export type ChannelReorderWarehousesMutationOptions = Apollo.BaseMutationOptions<Types.ChannelReorderWarehousesMutation, Types.ChannelReorderWarehousesMutationVariables>;
export const BaseChannelsDocument = gql`
    query BaseChannels {
  channels {
    ...Channel
  }
}
    ${ChannelFragmentDoc}`;

/**
 * __useBaseChannelsQuery__
 *
 * To run a query within a React component, call `useBaseChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBaseChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBaseChannelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useBaseChannelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>(BaseChannelsDocument, options);
      }
export function useBaseChannelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>(BaseChannelsDocument, options);
        }
export type BaseChannelsQueryHookResult = ReturnType<typeof useBaseChannelsQuery>;
export type BaseChannelsLazyQueryHookResult = ReturnType<typeof useBaseChannelsLazyQuery>;
export type BaseChannelsQueryResult = Apollo.QueryResult<Types.BaseChannelsQuery, Types.BaseChannelsQueryVariables>;
export const ChannelsDocument = gql`
    query Channels {
  channels {
    ...ChannelDetails
  }
}
    ${ChannelDetailsFragmentDoc}`;

/**
 * __useChannelsQuery__
 *
 * To run a query within a React component, call `useChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useChannelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ChannelsQuery, Types.ChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ChannelsQuery, Types.ChannelsQueryVariables>(ChannelsDocument, options);
      }
export function useChannelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ChannelsQuery, Types.ChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ChannelsQuery, Types.ChannelsQueryVariables>(ChannelsDocument, options);
        }
export type ChannelsQueryHookResult = ReturnType<typeof useChannelsQuery>;
export type ChannelsLazyQueryHookResult = ReturnType<typeof useChannelsLazyQuery>;
export type ChannelsQueryResult = Apollo.QueryResult<Types.ChannelsQuery, Types.ChannelsQueryVariables>;
export const ChannelDocument = gql`
    query Channel($id: ID!) {
  channel(id: $id) {
    ...ChannelDetails
  }
}
    ${ChannelDetailsFragmentDoc}`;

/**
 * __useChannelQuery__
 *
 * To run a query within a React component, call `useChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChannelQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ChannelQuery, Types.ChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ChannelQuery, Types.ChannelQueryVariables>(ChannelDocument, options);
      }
export function useChannelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ChannelQuery, Types.ChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ChannelQuery, Types.ChannelQueryVariables>(ChannelDocument, options);
        }
export type ChannelQueryHookResult = ReturnType<typeof useChannelQuery>;
export type ChannelLazyQueryHookResult = ReturnType<typeof useChannelLazyQuery>;
export type ChannelQueryResult = Apollo.QueryResult<Types.ChannelQuery, Types.ChannelQueryVariables>;
export const CollectionUpdateDocument = gql`
    mutation CollectionUpdate($id: ID!, $input: CollectionInput!) {
  collectionUpdate(id: $id, input: $input) {
    collection {
      ...CollectionDetails
    }
    errors {
      ...CollectionError
    }
  }
}
    ${CollectionDetailsFragmentDoc}
${CollectionErrorFragmentDoc}`;
export type CollectionUpdateMutationFn = Apollo.MutationFunction<Types.CollectionUpdateMutation, Types.CollectionUpdateMutationVariables>;

/**
 * __useCollectionUpdateMutation__
 *
 * To run a mutation, you first call `useCollectionUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCollectionUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [collectionUpdateMutation, { data, loading, error }] = useCollectionUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCollectionUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CollectionUpdateMutation, Types.CollectionUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CollectionUpdateMutation, Types.CollectionUpdateMutationVariables>(CollectionUpdateDocument, options);
      }
export type CollectionUpdateMutationHookResult = ReturnType<typeof useCollectionUpdateMutation>;
export type CollectionUpdateMutationResult = Apollo.MutationResult<Types.CollectionUpdateMutation>;
export type CollectionUpdateMutationOptions = Apollo.BaseMutationOptions<Types.CollectionUpdateMutation, Types.CollectionUpdateMutationVariables>;
export const CollectionAssignProductDocument = gql`
    mutation CollectionAssignProduct($collectionId: ID!, $productIds: [ID!]!, $moves: [MoveProductInput!]!, $first: Int, $after: String, $last: Int, $before: String) {
  collectionAddProducts(collectionId: $collectionId, products: $productIds) {
    errors {
      ...CollectionError
    }
  }
  collectionReorderProducts(collectionId: $collectionId, moves: $moves) {
    collection {
      id
      products(
        first: $first
        after: $after
        before: $before
        last: $last
        sortBy: {field: COLLECTION, direction: ASC}
      ) {
        edges {
          node {
            ...CollectionProduct
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
    errors {
      message
    }
  }
}
    ${CollectionErrorFragmentDoc}
${CollectionProductFragmentDoc}`;
export type CollectionAssignProductMutationFn = Apollo.MutationFunction<Types.CollectionAssignProductMutation, Types.CollectionAssignProductMutationVariables>;

/**
 * __useCollectionAssignProductMutation__
 *
 * To run a mutation, you first call `useCollectionAssignProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCollectionAssignProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [collectionAssignProductMutation, { data, loading, error }] = useCollectionAssignProductMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      productIds: // value for 'productIds'
 *      moves: // value for 'moves'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useCollectionAssignProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CollectionAssignProductMutation, Types.CollectionAssignProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CollectionAssignProductMutation, Types.CollectionAssignProductMutationVariables>(CollectionAssignProductDocument, options);
      }
export type CollectionAssignProductMutationHookResult = ReturnType<typeof useCollectionAssignProductMutation>;
export type CollectionAssignProductMutationResult = Apollo.MutationResult<Types.CollectionAssignProductMutation>;
export type CollectionAssignProductMutationOptions = Apollo.BaseMutationOptions<Types.CollectionAssignProductMutation, Types.CollectionAssignProductMutationVariables>;
export const CreateCollectionDocument = gql`
    mutation CreateCollection($input: CollectionCreateInput!) {
  collectionCreate(input: $input) {
    collection {
      ...CollectionDetails
    }
    errors {
      ...CollectionError
    }
  }
}
    ${CollectionDetailsFragmentDoc}
${CollectionErrorFragmentDoc}`;
export type CreateCollectionMutationFn = Apollo.MutationFunction<Types.CreateCollectionMutation, Types.CreateCollectionMutationVariables>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCollectionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CreateCollectionMutation, Types.CreateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CreateCollectionMutation, Types.CreateCollectionMutationVariables>(CreateCollectionDocument, options);
      }
export type CreateCollectionMutationHookResult = ReturnType<typeof useCreateCollectionMutation>;
export type CreateCollectionMutationResult = Apollo.MutationResult<Types.CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<Types.CreateCollectionMutation, Types.CreateCollectionMutationVariables>;
export const RemoveCollectionDocument = gql`
    mutation RemoveCollection($id: ID!) {
  collectionDelete(id: $id) {
    errors {
      ...CollectionError
    }
  }
}
    ${CollectionErrorFragmentDoc}`;
export type RemoveCollectionMutationFn = Apollo.MutationFunction<Types.RemoveCollectionMutation, Types.RemoveCollectionMutationVariables>;

/**
 * __useRemoveCollectionMutation__
 *
 * To run a mutation, you first call `useRemoveCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCollectionMutation, { data, loading, error }] = useRemoveCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveCollectionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.RemoveCollectionMutation, Types.RemoveCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.RemoveCollectionMutation, Types.RemoveCollectionMutationVariables>(RemoveCollectionDocument, options);
      }
export type RemoveCollectionMutationHookResult = ReturnType<typeof useRemoveCollectionMutation>;
export type RemoveCollectionMutationResult = Apollo.MutationResult<Types.RemoveCollectionMutation>;
export type RemoveCollectionMutationOptions = Apollo.BaseMutationOptions<Types.RemoveCollectionMutation, Types.RemoveCollectionMutationVariables>;
export const UnassignCollectionProductDocument = gql`
    mutation UnassignCollectionProduct($collectionId: ID!, $productIds: [ID!]!, $first: Int, $after: String, $last: Int, $before: String) {
  collectionRemoveProducts(collectionId: $collectionId, products: $productIds) {
    collection {
      id
      products(
        first: $first
        after: $after
        before: $before
        last: $last
        sortBy: {field: COLLECTION, direction: ASC}
      ) {
        edges {
          node {
            ...CollectionProduct
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
    errors {
      ...CollectionError
    }
  }
}
    ${CollectionProductFragmentDoc}
${CollectionErrorFragmentDoc}`;
export type UnassignCollectionProductMutationFn = Apollo.MutationFunction<Types.UnassignCollectionProductMutation, Types.UnassignCollectionProductMutationVariables>;

/**
 * __useUnassignCollectionProductMutation__
 *
 * To run a mutation, you first call `useUnassignCollectionProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnassignCollectionProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unassignCollectionProductMutation, { data, loading, error }] = useUnassignCollectionProductMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      productIds: // value for 'productIds'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useUnassignCollectionProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UnassignCollectionProductMutation, Types.UnassignCollectionProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UnassignCollectionProductMutation, Types.UnassignCollectionProductMutationVariables>(UnassignCollectionProductDocument, options);
      }
export type UnassignCollectionProductMutationHookResult = ReturnType<typeof useUnassignCollectionProductMutation>;
export type UnassignCollectionProductMutationResult = Apollo.MutationResult<Types.UnassignCollectionProductMutation>;
export type UnassignCollectionProductMutationOptions = Apollo.BaseMutationOptions<Types.UnassignCollectionProductMutation, Types.UnassignCollectionProductMutationVariables>;
export const CollectionBulkDeleteDocument = gql`
    mutation CollectionBulkDelete($ids: [ID!]!) {
  collectionBulkDelete(ids: $ids) {
    errors {
      ...CollectionError
    }
  }
}
    ${CollectionErrorFragmentDoc}`;
export type CollectionBulkDeleteMutationFn = Apollo.MutationFunction<Types.CollectionBulkDeleteMutation, Types.CollectionBulkDeleteMutationVariables>;

/**
 * __useCollectionBulkDeleteMutation__
 *
 * To run a mutation, you first call `useCollectionBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCollectionBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [collectionBulkDeleteMutation, { data, loading, error }] = useCollectionBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useCollectionBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CollectionBulkDeleteMutation, Types.CollectionBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CollectionBulkDeleteMutation, Types.CollectionBulkDeleteMutationVariables>(CollectionBulkDeleteDocument, options);
      }
export type CollectionBulkDeleteMutationHookResult = ReturnType<typeof useCollectionBulkDeleteMutation>;
export type CollectionBulkDeleteMutationResult = Apollo.MutationResult<Types.CollectionBulkDeleteMutation>;
export type CollectionBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.CollectionBulkDeleteMutation, Types.CollectionBulkDeleteMutationVariables>;
export const CollectionChannelListingUpdateDocument = gql`
    mutation CollectionChannelListingUpdate($id: ID!, $input: CollectionChannelListingUpdateInput!) {
  collectionChannelListingUpdate(id: $id, input: $input) {
    errors {
      ...CollectionChannelListingError
    }
  }
}
    ${CollectionChannelListingErrorFragmentDoc}`;
export type CollectionChannelListingUpdateMutationFn = Apollo.MutationFunction<Types.CollectionChannelListingUpdateMutation, Types.CollectionChannelListingUpdateMutationVariables>;

/**
 * __useCollectionChannelListingUpdateMutation__
 *
 * To run a mutation, you first call `useCollectionChannelListingUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCollectionChannelListingUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [collectionChannelListingUpdateMutation, { data, loading, error }] = useCollectionChannelListingUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCollectionChannelListingUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CollectionChannelListingUpdateMutation, Types.CollectionChannelListingUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CollectionChannelListingUpdateMutation, Types.CollectionChannelListingUpdateMutationVariables>(CollectionChannelListingUpdateDocument, options);
      }
export type CollectionChannelListingUpdateMutationHookResult = ReturnType<typeof useCollectionChannelListingUpdateMutation>;
export type CollectionChannelListingUpdateMutationResult = Apollo.MutationResult<Types.CollectionChannelListingUpdateMutation>;
export type CollectionChannelListingUpdateMutationOptions = Apollo.BaseMutationOptions<Types.CollectionChannelListingUpdateMutation, Types.CollectionChannelListingUpdateMutationVariables>;
export const ReorderProductsInCollectionDocument = gql`
    mutation ReorderProductsInCollection($collectionId: ID!, $moves: [MoveProductInput!]!, $first: Int, $after: String, $last: Int, $before: String) {
  collectionReorderProducts(collectionId: $collectionId, moves: $moves) {
    collection {
      id
      products(
        first: $first
        after: $after
        before: $before
        last: $last
        sortBy: {field: COLLECTION, direction: ASC}
      ) {
        edges {
          node {
            ...CollectionProduct
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
    errors {
      message
    }
  }
}
    ${CollectionProductFragmentDoc}`;
export type ReorderProductsInCollectionMutationFn = Apollo.MutationFunction<Types.ReorderProductsInCollectionMutation, Types.ReorderProductsInCollectionMutationVariables>;

/**
 * __useReorderProductsInCollectionMutation__
 *
 * To run a mutation, you first call `useReorderProductsInCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderProductsInCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderProductsInCollectionMutation, { data, loading, error }] = useReorderProductsInCollectionMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      moves: // value for 'moves'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useReorderProductsInCollectionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ReorderProductsInCollectionMutation, Types.ReorderProductsInCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ReorderProductsInCollectionMutation, Types.ReorderProductsInCollectionMutationVariables>(ReorderProductsInCollectionDocument, options);
      }
export type ReorderProductsInCollectionMutationHookResult = ReturnType<typeof useReorderProductsInCollectionMutation>;
export type ReorderProductsInCollectionMutationResult = Apollo.MutationResult<Types.ReorderProductsInCollectionMutation>;
export type ReorderProductsInCollectionMutationOptions = Apollo.BaseMutationOptions<Types.ReorderProductsInCollectionMutation, Types.ReorderProductsInCollectionMutationVariables>;
export const CollectionListDocument = gql`
    query CollectionList($first: Int, $after: String, $last: Int, $before: String, $filter: CollectionFilterInput, $sort: CollectionSortingInput, $channel: String) {
  collections(
    first: $first
    after: $after
    before: $before
    last: $last
    filter: $filter
    sortBy: $sort
    channel: $channel
  ) {
    edges {
      node {
        ...Collection
        products {
          totalCount
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    ${CollectionFragmentDoc}`;

/**
 * __useCollectionListQuery__
 *
 * To run a query within a React component, call `useCollectionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useCollectionListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.CollectionListQuery, Types.CollectionListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CollectionListQuery, Types.CollectionListQueryVariables>(CollectionListDocument, options);
      }
export function useCollectionListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CollectionListQuery, Types.CollectionListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CollectionListQuery, Types.CollectionListQueryVariables>(CollectionListDocument, options);
        }
export type CollectionListQueryHookResult = ReturnType<typeof useCollectionListQuery>;
export type CollectionListLazyQueryHookResult = ReturnType<typeof useCollectionListLazyQuery>;
export type CollectionListQueryResult = Apollo.QueryResult<Types.CollectionListQuery, Types.CollectionListQueryVariables>;
export const CollectionDetailsDocument = gql`
    query CollectionDetails($id: ID) {
  collection(id: $id) {
    ...CollectionDetails
  }
}
    ${CollectionDetailsFragmentDoc}`;

/**
 * __useCollectionDetailsQuery__
 *
 * To run a query within a React component, call `useCollectionDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionDetailsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.CollectionDetailsQuery, Types.CollectionDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CollectionDetailsQuery, Types.CollectionDetailsQueryVariables>(CollectionDetailsDocument, options);
      }
export function useCollectionDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CollectionDetailsQuery, Types.CollectionDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CollectionDetailsQuery, Types.CollectionDetailsQueryVariables>(CollectionDetailsDocument, options);
        }
export type CollectionDetailsQueryHookResult = ReturnType<typeof useCollectionDetailsQuery>;
export type CollectionDetailsLazyQueryHookResult = ReturnType<typeof useCollectionDetailsLazyQuery>;
export type CollectionDetailsQueryResult = Apollo.QueryResult<Types.CollectionDetailsQuery, Types.CollectionDetailsQueryVariables>;
export const CollectionProductsDocument = gql`
    query CollectionProducts($id: ID!, $first: Int, $after: String, $last: Int, $before: String) {
  collection(id: $id) {
    id
    products(
      first: $first
      after: $after
      before: $before
      last: $last
      sortBy: {field: COLLECTION, direction: ASC}
    ) {
      edges {
        node {
          ...CollectionProduct
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
}
    ${CollectionProductFragmentDoc}`;

/**
 * __useCollectionProductsQuery__
 *
 * To run a query within a React component, call `useCollectionProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionProductsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useCollectionProductsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CollectionProductsQuery, Types.CollectionProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CollectionProductsQuery, Types.CollectionProductsQueryVariables>(CollectionProductsDocument, options);
      }
export function useCollectionProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CollectionProductsQuery, Types.CollectionProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CollectionProductsQuery, Types.CollectionProductsQueryVariables>(CollectionProductsDocument, options);
        }
export type CollectionProductsQueryHookResult = ReturnType<typeof useCollectionProductsQuery>;
export type CollectionProductsLazyQueryHookResult = ReturnType<typeof useCollectionProductsLazyQuery>;
export type CollectionProductsQueryResult = Apollo.QueryResult<Types.CollectionProductsQuery, Types.CollectionProductsQueryVariables>;
export const AddressValidationRulesDocument = gql`
    query addressValidationRules($countryCode: CountryCode!) {
  addressValidationRules(countryCode: $countryCode) {
    countryAreaChoices {
      raw
      verbose
    }
    allowedFields
  }
}
    `;

/**
 * __useAddressValidationRulesQuery__
 *
 * To run a query within a React component, call `useAddressValidationRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddressValidationRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddressValidationRulesQuery({
 *   variables: {
 *      countryCode: // value for 'countryCode'
 *   },
 * });
 */
export function useAddressValidationRulesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AddressValidationRulesQuery, Types.AddressValidationRulesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AddressValidationRulesQuery, Types.AddressValidationRulesQueryVariables>(AddressValidationRulesDocument, options);
      }
export function useAddressValidationRulesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AddressValidationRulesQuery, Types.AddressValidationRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AddressValidationRulesQuery, Types.AddressValidationRulesQueryVariables>(AddressValidationRulesDocument, options);
        }
export type AddressValidationRulesQueryHookResult = ReturnType<typeof useAddressValidationRulesQuery>;
export type AddressValidationRulesLazyQueryHookResult = ReturnType<typeof useAddressValidationRulesLazyQuery>;
export type AddressValidationRulesQueryResult = Apollo.QueryResult<Types.AddressValidationRulesQuery, Types.AddressValidationRulesQueryVariables>;
export const _GetDynamicLeftOperandsDocument = gql`
    query _GetDynamicLeftOperands($first: Int!, $query: String!) {
  attributes(
    first: $first
    search: $query
    where: {type: {eq: PRODUCT_TYPE}, inputType: {oneOf: [DROPDOWN, MULTISELECT, BOOLEAN, NUMERIC, DATE, DATE_TIME, SWATCH, REFERENCE, SINGLE_REFERENCE]}}
  ) {
    edges {
      node {
        id
        name
        slug
        inputType
        entityType
        __typename
      }
      __typename
    }
    __typename
  }
}
    `;

/**
 * __use_GetDynamicLeftOperandsQuery__
 *
 * To run a query within a React component, call `use_GetDynamicLeftOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetDynamicLeftOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetDynamicLeftOperandsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetDynamicLeftOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetDynamicLeftOperandsQuery, Types._GetDynamicLeftOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetDynamicLeftOperandsQuery, Types._GetDynamicLeftOperandsQueryVariables>(_GetDynamicLeftOperandsDocument, options);
      }
export function use_GetDynamicLeftOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetDynamicLeftOperandsQuery, Types._GetDynamicLeftOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetDynamicLeftOperandsQuery, Types._GetDynamicLeftOperandsQueryVariables>(_GetDynamicLeftOperandsDocument, options);
        }
export type _GetDynamicLeftOperandsQueryHookResult = ReturnType<typeof use_GetDynamicLeftOperandsQuery>;
export type _GetDynamicLeftOperandsLazyQueryHookResult = ReturnType<typeof use_GetDynamicLeftOperandsLazyQuery>;
export type _GetDynamicLeftOperandsQueryResult = Apollo.QueryResult<Types._GetDynamicLeftOperandsQuery, Types._GetDynamicLeftOperandsQueryVariables>;
export const _GetChannelOperandsDocument = gql`
    query _GetChannelOperands {
  channels {
    id: slug
    name
    slug
  }
}
    `;

/**
 * __use_GetChannelOperandsQuery__
 *
 * To run a query within a React component, call `use_GetChannelOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetChannelOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetChannelOperandsQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetChannelOperandsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types._GetChannelOperandsQuery, Types._GetChannelOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetChannelOperandsQuery, Types._GetChannelOperandsQueryVariables>(_GetChannelOperandsDocument, options);
      }
export function use_GetChannelOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetChannelOperandsQuery, Types._GetChannelOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetChannelOperandsQuery, Types._GetChannelOperandsQueryVariables>(_GetChannelOperandsDocument, options);
        }
export type _GetChannelOperandsQueryHookResult = ReturnType<typeof use_GetChannelOperandsQuery>;
export type _GetChannelOperandsLazyQueryHookResult = ReturnType<typeof use_GetChannelOperandsLazyQuery>;
export type _GetChannelOperandsQueryResult = Apollo.QueryResult<Types._GetChannelOperandsQuery, Types._GetChannelOperandsQueryVariables>;
export const _GetLegacyChannelOperandsDocument = gql`
    query _GetLegacyChannelOperands {
  channels {
    id
    name
    slug
  }
}
    `;

/**
 * __use_GetLegacyChannelOperandsQuery__
 *
 * To run a query within a React component, call `use_GetLegacyChannelOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetLegacyChannelOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetLegacyChannelOperandsQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetLegacyChannelOperandsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types._GetLegacyChannelOperandsQuery, Types._GetLegacyChannelOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetLegacyChannelOperandsQuery, Types._GetLegacyChannelOperandsQueryVariables>(_GetLegacyChannelOperandsDocument, options);
      }
export function use_GetLegacyChannelOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetLegacyChannelOperandsQuery, Types._GetLegacyChannelOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetLegacyChannelOperandsQuery, Types._GetLegacyChannelOperandsQueryVariables>(_GetLegacyChannelOperandsDocument, options);
        }
export type _GetLegacyChannelOperandsQueryHookResult = ReturnType<typeof use_GetLegacyChannelOperandsQuery>;
export type _GetLegacyChannelOperandsLazyQueryHookResult = ReturnType<typeof use_GetLegacyChannelOperandsLazyQuery>;
export type _GetLegacyChannelOperandsQueryResult = Apollo.QueryResult<Types._GetLegacyChannelOperandsQuery, Types._GetLegacyChannelOperandsQueryVariables>;
export const _SearchCollectionsOperandsDocument = gql`
    query _SearchCollectionsOperands($first: Int!, $collectionsSlugs: [String!]) {
  collections(first: $first, filter: {slugs: $collectionsSlugs}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_SearchCollectionsOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchCollectionsOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchCollectionsOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchCollectionsOperandsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      collectionsSlugs: // value for 'collectionsSlugs'
 *   },
 * });
 */
export function use_SearchCollectionsOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchCollectionsOperandsQuery, Types._SearchCollectionsOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchCollectionsOperandsQuery, Types._SearchCollectionsOperandsQueryVariables>(_SearchCollectionsOperandsDocument, options);
      }
export function use_SearchCollectionsOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchCollectionsOperandsQuery, Types._SearchCollectionsOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchCollectionsOperandsQuery, Types._SearchCollectionsOperandsQueryVariables>(_SearchCollectionsOperandsDocument, options);
        }
export type _SearchCollectionsOperandsQueryHookResult = ReturnType<typeof use_SearchCollectionsOperandsQuery>;
export type _SearchCollectionsOperandsLazyQueryHookResult = ReturnType<typeof use_SearchCollectionsOperandsLazyQuery>;
export type _SearchCollectionsOperandsQueryResult = Apollo.QueryResult<Types._SearchCollectionsOperandsQuery, Types._SearchCollectionsOperandsQueryVariables>;
export const _SearchCategoriesOperandsDocument = gql`
    query _SearchCategoriesOperands($after: String, $first: Int!, $categoriesSlugs: [String!]) {
  categories(after: $after, first: $first, filter: {slugs: $categoriesSlugs}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_SearchCategoriesOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchCategoriesOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchCategoriesOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchCategoriesOperandsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      categoriesSlugs: // value for 'categoriesSlugs'
 *   },
 * });
 */
export function use_SearchCategoriesOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchCategoriesOperandsQuery, Types._SearchCategoriesOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchCategoriesOperandsQuery, Types._SearchCategoriesOperandsQueryVariables>(_SearchCategoriesOperandsDocument, options);
      }
export function use_SearchCategoriesOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchCategoriesOperandsQuery, Types._SearchCategoriesOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchCategoriesOperandsQuery, Types._SearchCategoriesOperandsQueryVariables>(_SearchCategoriesOperandsDocument, options);
        }
export type _SearchCategoriesOperandsQueryHookResult = ReturnType<typeof use_SearchCategoriesOperandsQuery>;
export type _SearchCategoriesOperandsLazyQueryHookResult = ReturnType<typeof use_SearchCategoriesOperandsLazyQuery>;
export type _SearchCategoriesOperandsQueryResult = Apollo.QueryResult<Types._SearchCategoriesOperandsQuery, Types._SearchCategoriesOperandsQueryVariables>;
export const _SearchProductTypesOperandsDocument = gql`
    query _SearchProductTypesOperands($after: String, $first: Int!, $productTypesSlugs: [String!]) {
  productTypes(after: $after, first: $first, filter: {slugs: $productTypesSlugs}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_SearchProductTypesOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchProductTypesOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchProductTypesOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchProductTypesOperandsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      productTypesSlugs: // value for 'productTypesSlugs'
 *   },
 * });
 */
export function use_SearchProductTypesOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchProductTypesOperandsQuery, Types._SearchProductTypesOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchProductTypesOperandsQuery, Types._SearchProductTypesOperandsQueryVariables>(_SearchProductTypesOperandsDocument, options);
      }
export function use_SearchProductTypesOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchProductTypesOperandsQuery, Types._SearchProductTypesOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchProductTypesOperandsQuery, Types._SearchProductTypesOperandsQueryVariables>(_SearchProductTypesOperandsDocument, options);
        }
export type _SearchProductTypesOperandsQueryHookResult = ReturnType<typeof use_SearchProductTypesOperandsQuery>;
export type _SearchProductTypesOperandsLazyQueryHookResult = ReturnType<typeof use_SearchProductTypesOperandsLazyQuery>;
export type _SearchProductTypesOperandsQueryResult = Apollo.QueryResult<Types._SearchProductTypesOperandsQuery, Types._SearchProductTypesOperandsQueryVariables>;
export const _SearchPageTypesOperandsDocument = gql`
    query _SearchPageTypesOperands($first: Int!, $pageTypesSlugs: [String!]) {
  pageTypes(first: $first, filter: {slugs: $pageTypesSlugs}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_SearchPageTypesOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchPageTypesOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchPageTypesOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchPageTypesOperandsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      pageTypesSlugs: // value for 'pageTypesSlugs'
 *   },
 * });
 */
export function use_SearchPageTypesOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchPageTypesOperandsQuery, Types._SearchPageTypesOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchPageTypesOperandsQuery, Types._SearchPageTypesOperandsQueryVariables>(_SearchPageTypesOperandsDocument, options);
      }
export function use_SearchPageTypesOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchPageTypesOperandsQuery, Types._SearchPageTypesOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchPageTypesOperandsQuery, Types._SearchPageTypesOperandsQueryVariables>(_SearchPageTypesOperandsDocument, options);
        }
export type _SearchPageTypesOperandsQueryHookResult = ReturnType<typeof use_SearchPageTypesOperandsQuery>;
export type _SearchPageTypesOperandsLazyQueryHookResult = ReturnType<typeof use_SearchPageTypesOperandsLazyQuery>;
export type _SearchPageTypesOperandsQueryResult = Apollo.QueryResult<Types._SearchPageTypesOperandsQuery, Types._SearchPageTypesOperandsQueryVariables>;
export const _SearchAttributeOperandsDocument = gql`
    query _SearchAttributeOperands($attributesSlugs: [String!], $choicesIds: [ID!], $first: Int!) {
  attributes(first: $first, filter: {slugs: $attributesSlugs}) {
    edges {
      node {
        id
        name
        slug
        inputType
        entityType
        choices(first: 5, filter: {ids: $choicesIds}) {
          edges {
            node {
              slug: id
              id
              name
              originalSlug: slug
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __use_SearchAttributeOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchAttributeOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchAttributeOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchAttributeOperandsQuery({
 *   variables: {
 *      attributesSlugs: // value for 'attributesSlugs'
 *      choicesIds: // value for 'choicesIds'
 *      first: // value for 'first'
 *   },
 * });
 */
export function use_SearchAttributeOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchAttributeOperandsQuery, Types._SearchAttributeOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchAttributeOperandsQuery, Types._SearchAttributeOperandsQueryVariables>(_SearchAttributeOperandsDocument, options);
      }
export function use_SearchAttributeOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchAttributeOperandsQuery, Types._SearchAttributeOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchAttributeOperandsQuery, Types._SearchAttributeOperandsQueryVariables>(_SearchAttributeOperandsDocument, options);
        }
export type _SearchAttributeOperandsQueryHookResult = ReturnType<typeof use_SearchAttributeOperandsQuery>;
export type _SearchAttributeOperandsLazyQueryHookResult = ReturnType<typeof use_SearchAttributeOperandsLazyQuery>;
export type _SearchAttributeOperandsQueryResult = Apollo.QueryResult<Types._SearchAttributeOperandsQuery, Types._SearchAttributeOperandsQueryVariables>;
export const _GetAttributeChoicesDocument = gql`
    query _GetAttributeChoices($slug: String!, $first: Int!, $query: String!) {
  attribute(slug: $slug) {
    choices(first: $first, filter: {search: $query}) {
      edges {
        node {
          slug: id
          id
          name
          originalSlug: slug
        }
      }
    }
  }
}
    `;

/**
 * __use_GetAttributeChoicesQuery__
 *
 * To run a query within a React component, call `use_GetAttributeChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetAttributeChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetAttributeChoicesQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetAttributeChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetAttributeChoicesQuery, Types._GetAttributeChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetAttributeChoicesQuery, Types._GetAttributeChoicesQueryVariables>(_GetAttributeChoicesDocument, options);
      }
export function use_GetAttributeChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetAttributeChoicesQuery, Types._GetAttributeChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetAttributeChoicesQuery, Types._GetAttributeChoicesQueryVariables>(_GetAttributeChoicesDocument, options);
        }
export type _GetAttributeChoicesQueryHookResult = ReturnType<typeof use_GetAttributeChoicesQuery>;
export type _GetAttributeChoicesLazyQueryHookResult = ReturnType<typeof use_GetAttributeChoicesLazyQuery>;
export type _GetAttributeChoicesQueryResult = Apollo.QueryResult<Types._GetAttributeChoicesQuery, Types._GetAttributeChoicesQueryVariables>;
export const _GetCollectionsChoicesDocument = gql`
    query _GetCollectionsChoices($first: Int!, $query: String!) {
  collections(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_GetCollectionsChoicesQuery__
 *
 * To run a query within a React component, call `use_GetCollectionsChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetCollectionsChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetCollectionsChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetCollectionsChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetCollectionsChoicesQuery, Types._GetCollectionsChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetCollectionsChoicesQuery, Types._GetCollectionsChoicesQueryVariables>(_GetCollectionsChoicesDocument, options);
      }
export function use_GetCollectionsChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetCollectionsChoicesQuery, Types._GetCollectionsChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetCollectionsChoicesQuery, Types._GetCollectionsChoicesQueryVariables>(_GetCollectionsChoicesDocument, options);
        }
export type _GetCollectionsChoicesQueryHookResult = ReturnType<typeof use_GetCollectionsChoicesQuery>;
export type _GetCollectionsChoicesLazyQueryHookResult = ReturnType<typeof use_GetCollectionsChoicesLazyQuery>;
export type _GetCollectionsChoicesQueryResult = Apollo.QueryResult<Types._GetCollectionsChoicesQuery, Types._GetCollectionsChoicesQueryVariables>;
export const _GetCategoriesChoicesDocument = gql`
    query _GetCategoriesChoices($first: Int!, $query: String!) {
  categories(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_GetCategoriesChoicesQuery__
 *
 * To run a query within a React component, call `use_GetCategoriesChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetCategoriesChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetCategoriesChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetCategoriesChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetCategoriesChoicesQuery, Types._GetCategoriesChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetCategoriesChoicesQuery, Types._GetCategoriesChoicesQueryVariables>(_GetCategoriesChoicesDocument, options);
      }
export function use_GetCategoriesChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetCategoriesChoicesQuery, Types._GetCategoriesChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetCategoriesChoicesQuery, Types._GetCategoriesChoicesQueryVariables>(_GetCategoriesChoicesDocument, options);
        }
export type _GetCategoriesChoicesQueryHookResult = ReturnType<typeof use_GetCategoriesChoicesQuery>;
export type _GetCategoriesChoicesLazyQueryHookResult = ReturnType<typeof use_GetCategoriesChoicesLazyQuery>;
export type _GetCategoriesChoicesQueryResult = Apollo.QueryResult<Types._GetCategoriesChoicesQuery, Types._GetCategoriesChoicesQueryVariables>;
export const _GetProductTypesChoicesDocument = gql`
    query _GetProductTypesChoices($first: Int!, $query: String!) {
  productTypes(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_GetProductTypesChoicesQuery__
 *
 * To run a query within a React component, call `use_GetProductTypesChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetProductTypesChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetProductTypesChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetProductTypesChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetProductTypesChoicesQuery, Types._GetProductTypesChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetProductTypesChoicesQuery, Types._GetProductTypesChoicesQueryVariables>(_GetProductTypesChoicesDocument, options);
      }
export function use_GetProductTypesChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetProductTypesChoicesQuery, Types._GetProductTypesChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetProductTypesChoicesQuery, Types._GetProductTypesChoicesQueryVariables>(_GetProductTypesChoicesDocument, options);
        }
export type _GetProductTypesChoicesQueryHookResult = ReturnType<typeof use_GetProductTypesChoicesQuery>;
export type _GetProductTypesChoicesLazyQueryHookResult = ReturnType<typeof use_GetProductTypesChoicesLazyQuery>;
export type _GetProductTypesChoicesQueryResult = Apollo.QueryResult<Types._GetProductTypesChoicesQuery, Types._GetProductTypesChoicesQueryVariables>;
export const _GetPageTypesChoicesDocument = gql`
    query _GetPageTypesChoices($first: Int!, $query: String!) {
  pageTypes(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_GetPageTypesChoicesQuery__
 *
 * To run a query within a React component, call `use_GetPageTypesChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetPageTypesChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetPageTypesChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetPageTypesChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetPageTypesChoicesQuery, Types._GetPageTypesChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetPageTypesChoicesQuery, Types._GetPageTypesChoicesQueryVariables>(_GetPageTypesChoicesDocument, options);
      }
export function use_GetPageTypesChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetPageTypesChoicesQuery, Types._GetPageTypesChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetPageTypesChoicesQuery, Types._GetPageTypesChoicesQueryVariables>(_GetPageTypesChoicesDocument, options);
        }
export type _GetPageTypesChoicesQueryHookResult = ReturnType<typeof use_GetPageTypesChoicesQuery>;
export type _GetPageTypesChoicesLazyQueryHookResult = ReturnType<typeof use_GetPageTypesChoicesLazyQuery>;
export type _GetPageTypesChoicesQueryResult = Apollo.QueryResult<Types._GetPageTypesChoicesQuery, Types._GetPageTypesChoicesQueryVariables>;
export const _GetPagesChoicesDocument = gql`
    query _GetPagesChoices($first: Int!, $query: String!) {
  pages(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name: title
        slug
        originalSlug: slug
      }
    }
  }
}
    `;

/**
 * __use_GetPagesChoicesQuery__
 *
 * To run a query within a React component, call `use_GetPagesChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetPagesChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetPagesChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetPagesChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetPagesChoicesQuery, Types._GetPagesChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetPagesChoicesQuery, Types._GetPagesChoicesQueryVariables>(_GetPagesChoicesDocument, options);
      }
export function use_GetPagesChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetPagesChoicesQuery, Types._GetPagesChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetPagesChoicesQuery, Types._GetPagesChoicesQueryVariables>(_GetPagesChoicesDocument, options);
        }
export type _GetPagesChoicesQueryHookResult = ReturnType<typeof use_GetPagesChoicesQuery>;
export type _GetPagesChoicesLazyQueryHookResult = ReturnType<typeof use_GetPagesChoicesLazyQuery>;
export type _GetPagesChoicesQueryResult = Apollo.QueryResult<Types._GetPagesChoicesQuery, Types._GetPagesChoicesQueryVariables>;
export const _GetProductChoicesDocument = gql`
    query _GetProductChoices($first: Int!, $query: String!) {
  products(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_GetProductChoicesQuery__
 *
 * To run a query within a React component, call `use_GetProductChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetProductChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetProductChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetProductChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetProductChoicesQuery, Types._GetProductChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetProductChoicesQuery, Types._GetProductChoicesQueryVariables>(_GetProductChoicesDocument, options);
      }
export function use_GetProductChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetProductChoicesQuery, Types._GetProductChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetProductChoicesQuery, Types._GetProductChoicesQueryVariables>(_GetProductChoicesDocument, options);
        }
export type _GetProductChoicesQueryHookResult = ReturnType<typeof use_GetProductChoicesQuery>;
export type _GetProductChoicesLazyQueryHookResult = ReturnType<typeof use_GetProductChoicesLazyQuery>;
export type _GetProductChoicesQueryResult = Apollo.QueryResult<Types._GetProductChoicesQuery, Types._GetProductChoicesQueryVariables>;
export const _GetProductVariantChoicesDocument = gql`
    query _GetProductVariantChoices($first: Int!, $query: String!) {
  productVariants(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
        slug: id
        originalSlug: name
        product {
          name
        }
      }
    }
  }
}
    `;

/**
 * __use_GetProductVariantChoicesQuery__
 *
 * To run a query within a React component, call `use_GetProductVariantChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetProductVariantChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetProductVariantChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetProductVariantChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetProductVariantChoicesQuery, Types._GetProductVariantChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetProductVariantChoicesQuery, Types._GetProductVariantChoicesQueryVariables>(_GetProductVariantChoicesDocument, options);
      }
export function use_GetProductVariantChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetProductVariantChoicesQuery, Types._GetProductVariantChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetProductVariantChoicesQuery, Types._GetProductVariantChoicesQueryVariables>(_GetProductVariantChoicesDocument, options);
        }
export type _GetProductVariantChoicesQueryHookResult = ReturnType<typeof use_GetProductVariantChoicesQuery>;
export type _GetProductVariantChoicesLazyQueryHookResult = ReturnType<typeof use_GetProductVariantChoicesLazyQuery>;
export type _GetProductVariantChoicesQueryResult = Apollo.QueryResult<Types._GetProductVariantChoicesQuery, Types._GetProductVariantChoicesQueryVariables>;
export const _GetGiftCardTagsChoicesDocument = gql`
    query _GetGiftCardTagsChoices($first: Int!, $query: String!) {
  giftCardTags(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

/**
 * __use_GetGiftCardTagsChoicesQuery__
 *
 * To run a query within a React component, call `use_GetGiftCardTagsChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetGiftCardTagsChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetGiftCardTagsChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetGiftCardTagsChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetGiftCardTagsChoicesQuery, Types._GetGiftCardTagsChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetGiftCardTagsChoicesQuery, Types._GetGiftCardTagsChoicesQueryVariables>(_GetGiftCardTagsChoicesDocument, options);
      }
export function use_GetGiftCardTagsChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetGiftCardTagsChoicesQuery, Types._GetGiftCardTagsChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetGiftCardTagsChoicesQuery, Types._GetGiftCardTagsChoicesQueryVariables>(_GetGiftCardTagsChoicesDocument, options);
        }
export type _GetGiftCardTagsChoicesQueryHookResult = ReturnType<typeof use_GetGiftCardTagsChoicesQuery>;
export type _GetGiftCardTagsChoicesLazyQueryHookResult = ReturnType<typeof use_GetGiftCardTagsChoicesLazyQuery>;
export type _GetGiftCardTagsChoicesQueryResult = Apollo.QueryResult<Types._GetGiftCardTagsChoicesQuery, Types._GetGiftCardTagsChoicesQueryVariables>;
export const _GetCustomersChoicesDocument = gql`
    query _GetCustomersChoices($first: Int!, $query: String!) {
  customers(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        email
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __use_GetCustomersChoicesQuery__
 *
 * To run a query within a React component, call `use_GetCustomersChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetCustomersChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetCustomersChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetCustomersChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetCustomersChoicesQuery, Types._GetCustomersChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetCustomersChoicesQuery, Types._GetCustomersChoicesQueryVariables>(_GetCustomersChoicesDocument, options);
      }
export function use_GetCustomersChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetCustomersChoicesQuery, Types._GetCustomersChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetCustomersChoicesQuery, Types._GetCustomersChoicesQueryVariables>(_GetCustomersChoicesDocument, options);
        }
export type _GetCustomersChoicesQueryHookResult = ReturnType<typeof use_GetCustomersChoicesQuery>;
export type _GetCustomersChoicesLazyQueryHookResult = ReturnType<typeof use_GetCustomersChoicesLazyQuery>;
export type _GetCustomersChoicesQueryResult = Apollo.QueryResult<Types._GetCustomersChoicesQuery, Types._GetCustomersChoicesQueryVariables>;
export const _SearchCustomersOperandsDocument = gql`
    query _SearchCustomersOperands($first: Int!, $customersIds: [ID!]) {
  customers(first: $first, filter: {ids: $customersIds}) {
    edges {
      node {
        id
        email
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __use_SearchCustomersOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchCustomersOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchCustomersOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchCustomersOperandsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      customersIds: // value for 'customersIds'
 *   },
 * });
 */
export function use_SearchCustomersOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchCustomersOperandsQuery, Types._SearchCustomersOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchCustomersOperandsQuery, Types._SearchCustomersOperandsQueryVariables>(_SearchCustomersOperandsDocument, options);
      }
export function use_SearchCustomersOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchCustomersOperandsQuery, Types._SearchCustomersOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchCustomersOperandsQuery, Types._SearchCustomersOperandsQueryVariables>(_SearchCustomersOperandsDocument, options);
        }
export type _SearchCustomersOperandsQueryHookResult = ReturnType<typeof use_SearchCustomersOperandsQuery>;
export type _SearchCustomersOperandsLazyQueryHookResult = ReturnType<typeof use_SearchCustomersOperandsLazyQuery>;
export type _SearchCustomersOperandsQueryResult = Apollo.QueryResult<Types._SearchCustomersOperandsQuery, Types._SearchCustomersOperandsQueryVariables>;
export const _SearchPageOperandsDocument = gql`
    query _SearchPageOperands($first: Int!, $pageSlugs: [String!]) {
  pages(first: $first, filter: {slugs: $pageSlugs}) {
    edges {
      node {
        id
        name: title
        slug
        originalSlug: slug
      }
    }
  }
}
    `;

/**
 * __use_SearchPageOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchPageOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchPageOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchPageOperandsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      pageSlugs: // value for 'pageSlugs'
 *   },
 * });
 */
export function use_SearchPageOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchPageOperandsQuery, Types._SearchPageOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchPageOperandsQuery, Types._SearchPageOperandsQueryVariables>(_SearchPageOperandsDocument, options);
      }
export function use_SearchPageOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchPageOperandsQuery, Types._SearchPageOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchPageOperandsQuery, Types._SearchPageOperandsQueryVariables>(_SearchPageOperandsDocument, options);
        }
export type _SearchPageOperandsQueryHookResult = ReturnType<typeof use_SearchPageOperandsQuery>;
export type _SearchPageOperandsLazyQueryHookResult = ReturnType<typeof use_SearchPageOperandsLazyQuery>;
export type _SearchPageOperandsQueryResult = Apollo.QueryResult<Types._SearchPageOperandsQuery, Types._SearchPageOperandsQueryVariables>;
export const _SearchProductOperandsDocument = gql`
    query _SearchProductOperands($first: Int!, $productSlugs: [String!]) {
  products(first: $first, where: {slug: {oneOf: $productSlugs}}) {
    edges {
      node {
        id
        name
        slug
        originalSlug: slug
      }
    }
  }
}
    `;

/**
 * __use_SearchProductOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchProductOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchProductOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchProductOperandsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      productSlugs: // value for 'productSlugs'
 *   },
 * });
 */
export function use_SearchProductOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchProductOperandsQuery, Types._SearchProductOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchProductOperandsQuery, Types._SearchProductOperandsQueryVariables>(_SearchProductOperandsDocument, options);
      }
export function use_SearchProductOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchProductOperandsQuery, Types._SearchProductOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchProductOperandsQuery, Types._SearchProductOperandsQueryVariables>(_SearchProductOperandsDocument, options);
        }
export type _SearchProductOperandsQueryHookResult = ReturnType<typeof use_SearchProductOperandsQuery>;
export type _SearchProductOperandsLazyQueryHookResult = ReturnType<typeof use_SearchProductOperandsLazyQuery>;
export type _SearchProductOperandsQueryResult = Apollo.QueryResult<Types._SearchProductOperandsQuery, Types._SearchProductOperandsQueryVariables>;
export const _SearchProductVariantOperandsDocument = gql`
    query _SearchProductVariantOperands($first: Int!, $ids: [ID!]) {
  productVariants(first: $first, where: {ids: $ids}) {
    edges {
      node {
        id
        name
        slug: id
        originalSlug: name
        product {
          name
        }
      }
    }
  }
}
    `;

/**
 * __use_SearchProductVariantOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchProductVariantOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchProductVariantOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchProductVariantOperandsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function use_SearchProductVariantOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchProductVariantOperandsQuery, Types._SearchProductVariantOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchProductVariantOperandsQuery, Types._SearchProductVariantOperandsQueryVariables>(_SearchProductVariantOperandsDocument, options);
      }
export function use_SearchProductVariantOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchProductVariantOperandsQuery, Types._SearchProductVariantOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchProductVariantOperandsQuery, Types._SearchProductVariantOperandsQueryVariables>(_SearchProductVariantOperandsDocument, options);
        }
export type _SearchProductVariantOperandsQueryHookResult = ReturnType<typeof use_SearchProductVariantOperandsQuery>;
export type _SearchProductVariantOperandsLazyQueryHookResult = ReturnType<typeof use_SearchProductVariantOperandsLazyQuery>;
export type _SearchProductVariantOperandsQueryResult = Apollo.QueryResult<Types._SearchProductVariantOperandsQuery, Types._SearchProductVariantOperandsQueryVariables>;
export const _GetWarehouseChoicesDocument = gql`
    query _GetWarehouseChoices($first: Int!, $query: String!) {
  warehouses(first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_GetWarehouseChoicesQuery__
 *
 * To run a query within a React component, call `use_GetWarehouseChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetWarehouseChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetWarehouseChoicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function use_GetWarehouseChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._GetWarehouseChoicesQuery, Types._GetWarehouseChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._GetWarehouseChoicesQuery, Types._GetWarehouseChoicesQueryVariables>(_GetWarehouseChoicesDocument, options);
      }
export function use_GetWarehouseChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._GetWarehouseChoicesQuery, Types._GetWarehouseChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._GetWarehouseChoicesQuery, Types._GetWarehouseChoicesQueryVariables>(_GetWarehouseChoicesDocument, options);
        }
export type _GetWarehouseChoicesQueryHookResult = ReturnType<typeof use_GetWarehouseChoicesQuery>;
export type _GetWarehouseChoicesLazyQueryHookResult = ReturnType<typeof use_GetWarehouseChoicesLazyQuery>;
export type _GetWarehouseChoicesQueryResult = Apollo.QueryResult<Types._GetWarehouseChoicesQuery, Types._GetWarehouseChoicesQueryVariables>;
export const _SearchWarehouseOperandsDocument = gql`
    query _SearchWarehouseOperands($first: Int!, $warehouseSlugs: [String!]) {
  warehouses(first: $first, filter: {slugs: $warehouseSlugs}) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

/**
 * __use_SearchWarehouseOperandsQuery__
 *
 * To run a query within a React component, call `use_SearchWarehouseOperandsQuery` and pass it any options that fit your needs.
 * When your component renders, `use_SearchWarehouseOperandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_SearchWarehouseOperandsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      warehouseSlugs: // value for 'warehouseSlugs'
 *   },
 * });
 */
export function use_SearchWarehouseOperandsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types._SearchWarehouseOperandsQuery, Types._SearchWarehouseOperandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types._SearchWarehouseOperandsQuery, Types._SearchWarehouseOperandsQueryVariables>(_SearchWarehouseOperandsDocument, options);
      }
export function use_SearchWarehouseOperandsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types._SearchWarehouseOperandsQuery, Types._SearchWarehouseOperandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types._SearchWarehouseOperandsQuery, Types._SearchWarehouseOperandsQueryVariables>(_SearchWarehouseOperandsDocument, options);
        }
export type _SearchWarehouseOperandsQueryHookResult = ReturnType<typeof use_SearchWarehouseOperandsQuery>;
export type _SearchWarehouseOperandsLazyQueryHookResult = ReturnType<typeof use_SearchWarehouseOperandsLazyQuery>;
export type _SearchWarehouseOperandsQueryResult = Apollo.QueryResult<Types._SearchWarehouseOperandsQuery, Types._SearchWarehouseOperandsQueryVariables>;
export const TriggerWebhookDryRunDocument = gql`
    mutation TriggerWebhookDryRun($objectId: ID!, $query: String!) {
  webhookDryRun(objectId: $objectId, query: $query) {
    payload
    errors {
      field
      message
    }
  }
}
    `;
export type TriggerWebhookDryRunMutationFn = Apollo.MutationFunction<Types.TriggerWebhookDryRunMutation, Types.TriggerWebhookDryRunMutationVariables>;

/**
 * __useTriggerWebhookDryRunMutation__
 *
 * To run a mutation, you first call `useTriggerWebhookDryRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTriggerWebhookDryRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [triggerWebhookDryRunMutation, { data, loading, error }] = useTriggerWebhookDryRunMutation({
 *   variables: {
 *      objectId: // value for 'objectId'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useTriggerWebhookDryRunMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.TriggerWebhookDryRunMutation, Types.TriggerWebhookDryRunMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.TriggerWebhookDryRunMutation, Types.TriggerWebhookDryRunMutationVariables>(TriggerWebhookDryRunDocument, options);
      }
export type TriggerWebhookDryRunMutationHookResult = ReturnType<typeof useTriggerWebhookDryRunMutation>;
export type TriggerWebhookDryRunMutationResult = Apollo.MutationResult<Types.TriggerWebhookDryRunMutation>;
export type TriggerWebhookDryRunMutationOptions = Apollo.BaseMutationOptions<Types.TriggerWebhookDryRunMutation, Types.TriggerWebhookDryRunMutationVariables>;
export const CheckoutListDocument = gql`
    query CheckoutList($first: Int, $after: String, $last: Int, $before: String) {
  checkouts(before: $before, after: $after, first: $first, last: $last) {
    edges {
      cursor
      node {
        id
        created
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useCheckoutListQuery__
 *
 * To run a query within a React component, call `useCheckoutListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckoutListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckoutListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useCheckoutListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.CheckoutListQuery, Types.CheckoutListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CheckoutListQuery, Types.CheckoutListQueryVariables>(CheckoutListDocument, options);
      }
export function useCheckoutListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CheckoutListQuery, Types.CheckoutListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CheckoutListQuery, Types.CheckoutListQueryVariables>(CheckoutListDocument, options);
        }
export type CheckoutListQueryHookResult = ReturnType<typeof useCheckoutListQuery>;
export type CheckoutListLazyQueryHookResult = ReturnType<typeof useCheckoutListLazyQuery>;
export type CheckoutListQueryResult = Apollo.QueryResult<Types.CheckoutListQuery, Types.CheckoutListQueryVariables>;
export const ChannelListDocument = gql`
    query ChannelList {
  channels {
    id
    name
  }
}
    `;

/**
 * __useChannelListQuery__
 *
 * To run a query within a React component, call `useChannelListQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelListQuery({
 *   variables: {
 *   },
 * });
 */
export function useChannelListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ChannelListQuery, Types.ChannelListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ChannelListQuery, Types.ChannelListQueryVariables>(ChannelListDocument, options);
      }
export function useChannelListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ChannelListQuery, Types.ChannelListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ChannelListQuery, Types.ChannelListQueryVariables>(ChannelListDocument, options);
        }
export type ChannelListQueryHookResult = ReturnType<typeof useChannelListQuery>;
export type ChannelListLazyQueryHookResult = ReturnType<typeof useChannelListLazyQuery>;
export type ChannelListQueryResult = Apollo.QueryResult<Types.ChannelListQuery, Types.ChannelListQueryVariables>;
export const NavigatorSearchDocument = gql`
    query NavigatorSearch($query: String!) {
  orders(first: 2, filter: {search: $query}) {
    edges {
      node {
        id
        number
        status
        updatedAt
        paymentStatus
        chargeStatus
        total {
          gross {
            amount
            currency
          }
        }
      }
    }
  }
  categories(first: 2, filter: {search: $query}) {
    edges {
      node {
        id
        name
        updatedAt
        backgroundImage(size: 64) {
          url
          alt
        }
        products(first: 1) {
          totalCount
        }
        parent {
          id
          name
        }
        level
        ancestors(first: 1) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
  collections(first: 2, filter: {search: $query}) {
    edges {
      node {
        id
        name
        products(first: 1) {
          totalCount
        }
        backgroundImage(size: 64) {
          url
          alt
        }
      }
    }
  }
  products(first: 2, filter: {search: $query}) {
    edges {
      node {
        id
        category {
          name
        }
        name
        updatedAt
        thumbnail(size: 64) {
          alt
          url
        }
      }
    }
  }
  productVariants(first: 2, filter: {search: $query}) {
    edges {
      node {
        id
        name
        sku
        updatedAt
        media {
          alt
          url(size: 64)
        }
        product {
          id
          name
          category {
            name
          }
        }
      }
    }
  }
  models: pages(first: 2, filter: {search: $query}) {
    edges {
      node {
        id
        title
        publishedAt
        pageType {
          name
        }
      }
    }
  }
  modelTypes: pageTypes(first: 2, filter: {search: $query}) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useNavigatorSearchQuery__
 *
 * To run a query within a React component, call `useNavigatorSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useNavigatorSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNavigatorSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useNavigatorSearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.NavigatorSearchQuery, Types.NavigatorSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.NavigatorSearchQuery, Types.NavigatorSearchQueryVariables>(NavigatorSearchDocument, options);
      }
export function useNavigatorSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.NavigatorSearchQuery, Types.NavigatorSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.NavigatorSearchQuery, Types.NavigatorSearchQueryVariables>(NavigatorSearchDocument, options);
        }
export type NavigatorSearchQueryHookResult = ReturnType<typeof useNavigatorSearchQuery>;
export type NavigatorSearchLazyQueryHookResult = ReturnType<typeof useNavigatorSearchLazyQuery>;
export type NavigatorSearchQueryResult = Apollo.QueryResult<Types.NavigatorSearchQuery, Types.NavigatorSearchQueryVariables>;
export const ShopInfoDocument = gql`
    query ShopInfo {
  shop {
    countries {
      ...CountryWithCode
    }
    defaultCountry {
      ...CountryWithCode
    }
    defaultWeightUnit
    domain {
      host
      url
    }
    languages {
      ...Language
    }
    name
    trackInventoryByDefault
    permissions {
      ...Permission
    }
    version
  }
}
    ${CountryWithCodeFragmentDoc}
${LanguageFragmentDoc}
${PermissionFragmentDoc}`;

/**
 * __useShopInfoQuery__
 *
 * To run a query within a React component, call `useShopInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useShopInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShopInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useShopInfoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ShopInfoQuery, Types.ShopInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ShopInfoQuery, Types.ShopInfoQueryVariables>(ShopInfoDocument, options);
      }
export function useShopInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ShopInfoQuery, Types.ShopInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ShopInfoQuery, Types.ShopInfoQueryVariables>(ShopInfoDocument, options);
        }
export type ShopInfoQueryHookResult = ReturnType<typeof useShopInfoQuery>;
export type ShopInfoLazyQueryHookResult = ReturnType<typeof useShopInfoLazyQuery>;
export type ShopInfoQueryResult = Apollo.QueryResult<Types.ShopInfoQuery, Types.ShopInfoQueryVariables>;
export const ShopCountriesDocument = gql`
    query ShopCountries($filter: CountryFilterInput) {
  shop {
    countries(filter: $filter) {
      code
      country
    }
  }
}
    `;

/**
 * __useShopCountriesQuery__
 *
 * To run a query within a React component, call `useShopCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useShopCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShopCountriesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useShopCountriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ShopCountriesQuery, Types.ShopCountriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ShopCountriesQuery, Types.ShopCountriesQueryVariables>(ShopCountriesDocument, options);
      }
export function useShopCountriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ShopCountriesQuery, Types.ShopCountriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ShopCountriesQuery, Types.ShopCountriesQueryVariables>(ShopCountriesDocument, options);
        }
export type ShopCountriesQueryHookResult = ReturnType<typeof useShopCountriesQuery>;
export type ShopCountriesLazyQueryHookResult = ReturnType<typeof useShopCountriesLazyQuery>;
export type ShopCountriesQueryResult = Apollo.QueryResult<Types.ShopCountriesQuery, Types.ShopCountriesQueryVariables>;
export const RefreshLimitsDocument = gql`
    query RefreshLimits($channels: Boolean!, $orders: Boolean!, $productVariants: Boolean!, $staffUsers: Boolean!, $warehouses: Boolean!) {
  shop {
    ...ShopLimit
  }
}
    ${ShopLimitFragmentDoc}`;

/**
 * __useRefreshLimitsQuery__
 *
 * To run a query within a React component, call `useRefreshLimitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRefreshLimitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRefreshLimitsQuery({
 *   variables: {
 *      channels: // value for 'channels'
 *      orders: // value for 'orders'
 *      productVariants: // value for 'productVariants'
 *      staffUsers: // value for 'staffUsers'
 *      warehouses: // value for 'warehouses'
 *   },
 * });
 */
export function useRefreshLimitsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.RefreshLimitsQuery, Types.RefreshLimitsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.RefreshLimitsQuery, Types.RefreshLimitsQueryVariables>(RefreshLimitsDocument, options);
      }
export function useRefreshLimitsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.RefreshLimitsQuery, Types.RefreshLimitsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.RefreshLimitsQuery, Types.RefreshLimitsQueryVariables>(RefreshLimitsDocument, options);
        }
export type RefreshLimitsQueryHookResult = ReturnType<typeof useRefreshLimitsQuery>;
export type RefreshLimitsLazyQueryHookResult = ReturnType<typeof useRefreshLimitsLazyQuery>;
export type RefreshLimitsQueryResult = Apollo.QueryResult<Types.RefreshLimitsQuery, Types.RefreshLimitsQueryVariables>;
export const CheckExportFileStatusDocument = gql`
    query CheckExportFileStatus($id: ID!) {
  exportFile(id: $id) {
    id
    status
  }
}
    `;

/**
 * __useCheckExportFileStatusQuery__
 *
 * To run a query within a React component, call `useCheckExportFileStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckExportFileStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckExportFileStatusQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCheckExportFileStatusQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CheckExportFileStatusQuery, Types.CheckExportFileStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CheckExportFileStatusQuery, Types.CheckExportFileStatusQueryVariables>(CheckExportFileStatusDocument, options);
      }
export function useCheckExportFileStatusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CheckExportFileStatusQuery, Types.CheckExportFileStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CheckExportFileStatusQuery, Types.CheckExportFileStatusQueryVariables>(CheckExportFileStatusDocument, options);
        }
export type CheckExportFileStatusQueryHookResult = ReturnType<typeof useCheckExportFileStatusQuery>;
export type CheckExportFileStatusLazyQueryHookResult = ReturnType<typeof useCheckExportFileStatusLazyQuery>;
export type CheckExportFileStatusQueryResult = Apollo.QueryResult<Types.CheckExportFileStatusQuery, Types.CheckExportFileStatusQueryVariables>;
export const CheckOrderInvoicesStatusDocument = gql`
    query CheckOrderInvoicesStatus($id: ID!) {
  order(id: $id) {
    id
    invoices {
      ...Invoice
    }
  }
}
    ${InvoiceFragmentDoc}`;

/**
 * __useCheckOrderInvoicesStatusQuery__
 *
 * To run a query within a React component, call `useCheckOrderInvoicesStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckOrderInvoicesStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckOrderInvoicesStatusQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCheckOrderInvoicesStatusQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CheckOrderInvoicesStatusQuery, Types.CheckOrderInvoicesStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CheckOrderInvoicesStatusQuery, Types.CheckOrderInvoicesStatusQueryVariables>(CheckOrderInvoicesStatusDocument, options);
      }
export function useCheckOrderInvoicesStatusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CheckOrderInvoicesStatusQuery, Types.CheckOrderInvoicesStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CheckOrderInvoicesStatusQuery, Types.CheckOrderInvoicesStatusQueryVariables>(CheckOrderInvoicesStatusDocument, options);
        }
export type CheckOrderInvoicesStatusQueryHookResult = ReturnType<typeof useCheckOrderInvoicesStatusQuery>;
export type CheckOrderInvoicesStatusLazyQueryHookResult = ReturnType<typeof useCheckOrderInvoicesStatusLazyQuery>;
export type CheckOrderInvoicesStatusQueryResult = Apollo.QueryResult<Types.CheckOrderInvoicesStatusQuery, Types.CheckOrderInvoicesStatusQueryVariables>;
export const UpdateCustomerDocument = gql`
    mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
  customerUpdate(id: $id, input: $input) {
    errors {
      ...AccountError
    }
    user {
      ...CustomerDetails
    }
  }
}
    ${AccountErrorFragmentDoc}
${CustomerDetailsFragmentDoc}`;
export type UpdateCustomerMutationFn = Apollo.MutationFunction<Types.UpdateCustomerMutation, Types.UpdateCustomerMutationVariables>;

/**
 * __useUpdateCustomerMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerMutation, { data, loading, error }] = useUpdateCustomerMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCustomerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateCustomerMutation, Types.UpdateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateCustomerMutation, Types.UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
      }
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = Apollo.MutationResult<Types.UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = Apollo.BaseMutationOptions<Types.UpdateCustomerMutation, Types.UpdateCustomerMutationVariables>;
export const CreateCustomerDocument = gql`
    mutation CreateCustomer($input: UserCreateInput!) {
  customerCreate(input: $input) {
    errors {
      ...AccountError
    }
    user {
      id
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type CreateCustomerMutationFn = Apollo.MutationFunction<Types.CreateCustomerMutation, Types.CreateCustomerMutationVariables>;

/**
 * __useCreateCustomerMutation__
 *
 * To run a mutation, you first call `useCreateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerMutation, { data, loading, error }] = useCreateCustomerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCustomerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CreateCustomerMutation, Types.CreateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CreateCustomerMutation, Types.CreateCustomerMutationVariables>(CreateCustomerDocument, options);
      }
export type CreateCustomerMutationHookResult = ReturnType<typeof useCreateCustomerMutation>;
export type CreateCustomerMutationResult = Apollo.MutationResult<Types.CreateCustomerMutation>;
export type CreateCustomerMutationOptions = Apollo.BaseMutationOptions<Types.CreateCustomerMutation, Types.CreateCustomerMutationVariables>;
export const RemoveCustomerDocument = gql`
    mutation RemoveCustomer($id: ID!) {
  customerDelete(id: $id) {
    errors {
      ...AccountError
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type RemoveCustomerMutationFn = Apollo.MutationFunction<Types.RemoveCustomerMutation, Types.RemoveCustomerMutationVariables>;

/**
 * __useRemoveCustomerMutation__
 *
 * To run a mutation, you first call `useRemoveCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCustomerMutation, { data, loading, error }] = useRemoveCustomerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveCustomerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.RemoveCustomerMutation, Types.RemoveCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.RemoveCustomerMutation, Types.RemoveCustomerMutationVariables>(RemoveCustomerDocument, options);
      }
export type RemoveCustomerMutationHookResult = ReturnType<typeof useRemoveCustomerMutation>;
export type RemoveCustomerMutationResult = Apollo.MutationResult<Types.RemoveCustomerMutation>;
export type RemoveCustomerMutationOptions = Apollo.BaseMutationOptions<Types.RemoveCustomerMutation, Types.RemoveCustomerMutationVariables>;
export const SetCustomerDefaultAddressDocument = gql`
    mutation SetCustomerDefaultAddress($addressId: ID!, $userId: ID!, $type: AddressTypeEnum!) {
  addressSetDefault(addressId: $addressId, userId: $userId, type: $type) {
    errors {
      ...AccountError
    }
    user {
      ...CustomerAddresses
    }
  }
}
    ${AccountErrorFragmentDoc}
${CustomerAddressesFragmentDoc}`;
export type SetCustomerDefaultAddressMutationFn = Apollo.MutationFunction<Types.SetCustomerDefaultAddressMutation, Types.SetCustomerDefaultAddressMutationVariables>;

/**
 * __useSetCustomerDefaultAddressMutation__
 *
 * To run a mutation, you first call `useSetCustomerDefaultAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCustomerDefaultAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCustomerDefaultAddressMutation, { data, loading, error }] = useSetCustomerDefaultAddressMutation({
 *   variables: {
 *      addressId: // value for 'addressId'
 *      userId: // value for 'userId'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useSetCustomerDefaultAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.SetCustomerDefaultAddressMutation, Types.SetCustomerDefaultAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.SetCustomerDefaultAddressMutation, Types.SetCustomerDefaultAddressMutationVariables>(SetCustomerDefaultAddressDocument, options);
      }
export type SetCustomerDefaultAddressMutationHookResult = ReturnType<typeof useSetCustomerDefaultAddressMutation>;
export type SetCustomerDefaultAddressMutationResult = Apollo.MutationResult<Types.SetCustomerDefaultAddressMutation>;
export type SetCustomerDefaultAddressMutationOptions = Apollo.BaseMutationOptions<Types.SetCustomerDefaultAddressMutation, Types.SetCustomerDefaultAddressMutationVariables>;
export const CreateCustomerAddressDocument = gql`
    mutation CreateCustomerAddress($id: ID!, $input: AddressInput!) {
  addressCreate(userId: $id, input: $input) {
    errors {
      ...AccountError
    }
    address {
      ...Address
    }
    user {
      ...CustomerAddresses
    }
  }
}
    ${AccountErrorFragmentDoc}
${AddressFragmentDoc}
${CustomerAddressesFragmentDoc}`;
export type CreateCustomerAddressMutationFn = Apollo.MutationFunction<Types.CreateCustomerAddressMutation, Types.CreateCustomerAddressMutationVariables>;

/**
 * __useCreateCustomerAddressMutation__
 *
 * To run a mutation, you first call `useCreateCustomerAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerAddressMutation, { data, loading, error }] = useCreateCustomerAddressMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCustomerAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CreateCustomerAddressMutation, Types.CreateCustomerAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CreateCustomerAddressMutation, Types.CreateCustomerAddressMutationVariables>(CreateCustomerAddressDocument, options);
      }
export type CreateCustomerAddressMutationHookResult = ReturnType<typeof useCreateCustomerAddressMutation>;
export type CreateCustomerAddressMutationResult = Apollo.MutationResult<Types.CreateCustomerAddressMutation>;
export type CreateCustomerAddressMutationOptions = Apollo.BaseMutationOptions<Types.CreateCustomerAddressMutation, Types.CreateCustomerAddressMutationVariables>;
export const UpdateCustomerAddressDocument = gql`
    mutation UpdateCustomerAddress($id: ID!, $input: AddressInput!) {
  addressUpdate(id: $id, input: $input) {
    errors {
      ...AccountError
    }
    address {
      ...Address
    }
  }
}
    ${AccountErrorFragmentDoc}
${AddressFragmentDoc}`;
export type UpdateCustomerAddressMutationFn = Apollo.MutationFunction<Types.UpdateCustomerAddressMutation, Types.UpdateCustomerAddressMutationVariables>;

/**
 * __useUpdateCustomerAddressMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerAddressMutation, { data, loading, error }] = useUpdateCustomerAddressMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCustomerAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateCustomerAddressMutation, Types.UpdateCustomerAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateCustomerAddressMutation, Types.UpdateCustomerAddressMutationVariables>(UpdateCustomerAddressDocument, options);
      }
export type UpdateCustomerAddressMutationHookResult = ReturnType<typeof useUpdateCustomerAddressMutation>;
export type UpdateCustomerAddressMutationResult = Apollo.MutationResult<Types.UpdateCustomerAddressMutation>;
export type UpdateCustomerAddressMutationOptions = Apollo.BaseMutationOptions<Types.UpdateCustomerAddressMutation, Types.UpdateCustomerAddressMutationVariables>;
export const RemoveCustomerAddressDocument = gql`
    mutation RemoveCustomerAddress($id: ID!) {
  addressDelete(id: $id) {
    errors {
      ...AccountError
    }
    user {
      ...CustomerAddresses
    }
  }
}
    ${AccountErrorFragmentDoc}
${CustomerAddressesFragmentDoc}`;
export type RemoveCustomerAddressMutationFn = Apollo.MutationFunction<Types.RemoveCustomerAddressMutation, Types.RemoveCustomerAddressMutationVariables>;

/**
 * __useRemoveCustomerAddressMutation__
 *
 * To run a mutation, you first call `useRemoveCustomerAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCustomerAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCustomerAddressMutation, { data, loading, error }] = useRemoveCustomerAddressMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveCustomerAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.RemoveCustomerAddressMutation, Types.RemoveCustomerAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.RemoveCustomerAddressMutation, Types.RemoveCustomerAddressMutationVariables>(RemoveCustomerAddressDocument, options);
      }
export type RemoveCustomerAddressMutationHookResult = ReturnType<typeof useRemoveCustomerAddressMutation>;
export type RemoveCustomerAddressMutationResult = Apollo.MutationResult<Types.RemoveCustomerAddressMutation>;
export type RemoveCustomerAddressMutationOptions = Apollo.BaseMutationOptions<Types.RemoveCustomerAddressMutation, Types.RemoveCustomerAddressMutationVariables>;
export const BulkRemoveCustomersDocument = gql`
    mutation BulkRemoveCustomers($ids: [ID!]!) {
  customerBulkDelete(ids: $ids) {
    errors {
      ...AccountError
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type BulkRemoveCustomersMutationFn = Apollo.MutationFunction<Types.BulkRemoveCustomersMutation, Types.BulkRemoveCustomersMutationVariables>;

/**
 * __useBulkRemoveCustomersMutation__
 *
 * To run a mutation, you first call `useBulkRemoveCustomersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkRemoveCustomersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkRemoveCustomersMutation, { data, loading, error }] = useBulkRemoveCustomersMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useBulkRemoveCustomersMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.BulkRemoveCustomersMutation, Types.BulkRemoveCustomersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.BulkRemoveCustomersMutation, Types.BulkRemoveCustomersMutationVariables>(BulkRemoveCustomersDocument, options);
      }
export type BulkRemoveCustomersMutationHookResult = ReturnType<typeof useBulkRemoveCustomersMutation>;
export type BulkRemoveCustomersMutationResult = Apollo.MutationResult<Types.BulkRemoveCustomersMutation>;
export type BulkRemoveCustomersMutationOptions = Apollo.BaseMutationOptions<Types.BulkRemoveCustomersMutation, Types.BulkRemoveCustomersMutationVariables>;
export const ListCustomersDocument = gql`
    query ListCustomers($after: String, $before: String, $first: Int, $last: Int, $filter: CustomerFilterInput, $sort: UserSortingInput, $PERMISSION_MANAGE_ORDERS: Boolean!) {
  customers(
    after: $after
    before: $before
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        ...Customer
        orders @include(if: $PERMISSION_MANAGE_ORDERS) {
          totalCount
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    ${CustomerFragmentDoc}`;

/**
 * __useListCustomersQuery__
 *
 * To run a query within a React component, call `useListCustomersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListCustomersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListCustomersQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      PERMISSION_MANAGE_ORDERS: // value for 'PERMISSION_MANAGE_ORDERS'
 *   },
 * });
 */
export function useListCustomersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ListCustomersQuery, Types.ListCustomersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ListCustomersQuery, Types.ListCustomersQueryVariables>(ListCustomersDocument, options);
      }
export function useListCustomersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ListCustomersQuery, Types.ListCustomersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ListCustomersQuery, Types.ListCustomersQueryVariables>(ListCustomersDocument, options);
        }
export type ListCustomersQueryHookResult = ReturnType<typeof useListCustomersQuery>;
export type ListCustomersLazyQueryHookResult = ReturnType<typeof useListCustomersLazyQuery>;
export type ListCustomersQueryResult = Apollo.QueryResult<Types.ListCustomersQuery, Types.ListCustomersQueryVariables>;
export const CustomerDetailsDocument = gql`
    query CustomerDetails($id: ID!, $PERMISSION_MANAGE_ORDERS: Boolean!, $PERMISSION_MANAGE_STAFF: Boolean!) {
  user(id: $id) {
    ...CustomerDetails
    metadata {
      ...MetadataItem
    }
    privateMetadata @include(if: $PERMISSION_MANAGE_STAFF) {
      ...MetadataItem
    }
    orders(first: 5) @include(if: $PERMISSION_MANAGE_ORDERS) {
      edges {
        node {
          id
          created
          number
          paymentStatus
          total {
            gross {
              currency
              amount
            }
          }
          chargeStatus
        }
      }
    }
    lastPlacedOrder: orders(first: 1) @include(if: $PERMISSION_MANAGE_ORDERS) {
      edges {
        node {
          id
          created
        }
      }
    }
  }
}
    ${CustomerDetailsFragmentDoc}
${MetadataItemFragmentDoc}`;

/**
 * __useCustomerDetailsQuery__
 *
 * To run a query within a React component, call `useCustomerDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      PERMISSION_MANAGE_ORDERS: // value for 'PERMISSION_MANAGE_ORDERS'
 *      PERMISSION_MANAGE_STAFF: // value for 'PERMISSION_MANAGE_STAFF'
 *   },
 * });
 */
export function useCustomerDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CustomerDetailsQuery, Types.CustomerDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CustomerDetailsQuery, Types.CustomerDetailsQueryVariables>(CustomerDetailsDocument, options);
      }
export function useCustomerDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CustomerDetailsQuery, Types.CustomerDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CustomerDetailsQuery, Types.CustomerDetailsQueryVariables>(CustomerDetailsDocument, options);
        }
export type CustomerDetailsQueryHookResult = ReturnType<typeof useCustomerDetailsQuery>;
export type CustomerDetailsLazyQueryHookResult = ReturnType<typeof useCustomerDetailsLazyQuery>;
export type CustomerDetailsQueryResult = Apollo.QueryResult<Types.CustomerDetailsQuery, Types.CustomerDetailsQueryVariables>;
export const CustomerAddressesDocument = gql`
    query CustomerAddresses($id: ID!) {
  user(id: $id) {
    ...CustomerAddresses
  }
}
    ${CustomerAddressesFragmentDoc}`;

/**
 * __useCustomerAddressesQuery__
 *
 * To run a query within a React component, call `useCustomerAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerAddressesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCustomerAddressesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CustomerAddressesQuery, Types.CustomerAddressesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CustomerAddressesQuery, Types.CustomerAddressesQueryVariables>(CustomerAddressesDocument, options);
      }
export function useCustomerAddressesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CustomerAddressesQuery, Types.CustomerAddressesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CustomerAddressesQuery, Types.CustomerAddressesQueryVariables>(CustomerAddressesDocument, options);
        }
export type CustomerAddressesQueryHookResult = ReturnType<typeof useCustomerAddressesQuery>;
export type CustomerAddressesLazyQueryHookResult = ReturnType<typeof useCustomerAddressesLazyQuery>;
export type CustomerAddressesQueryResult = Apollo.QueryResult<Types.CustomerAddressesQuery, Types.CustomerAddressesQueryVariables>;
export const CustomerCreateDataDocument = gql`
    query CustomerCreateData {
  shop {
    countries {
      code
      country
    }
  }
}
    `;

/**
 * __useCustomerCreateDataQuery__
 *
 * To run a query within a React component, call `useCustomerCreateDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerCreateDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerCreateDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useCustomerCreateDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.CustomerCreateDataQuery, Types.CustomerCreateDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CustomerCreateDataQuery, Types.CustomerCreateDataQueryVariables>(CustomerCreateDataDocument, options);
      }
export function useCustomerCreateDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CustomerCreateDataQuery, Types.CustomerCreateDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CustomerCreateDataQuery, Types.CustomerCreateDataQueryVariables>(CustomerCreateDataDocument, options);
        }
export type CustomerCreateDataQueryHookResult = ReturnType<typeof useCustomerCreateDataQuery>;
export type CustomerCreateDataLazyQueryHookResult = ReturnType<typeof useCustomerCreateDataLazyQuery>;
export type CustomerCreateDataQueryResult = Apollo.QueryResult<Types.CustomerCreateDataQuery, Types.CustomerCreateDataQueryVariables>;
export const VoucherChannelListingUpdateDocument = gql`
    mutation VoucherChannelListingUpdate($id: ID!, $input: VoucherChannelListingInput!) {
  voucherChannelListingUpdate(id: $id, input: $input) {
    errors {
      ...DiscountError
    }
    voucher {
      ...Voucher
    }
  }
}
    ${DiscountErrorFragmentDoc}
${VoucherFragmentDoc}`;
export type VoucherChannelListingUpdateMutationFn = Apollo.MutationFunction<Types.VoucherChannelListingUpdateMutation, Types.VoucherChannelListingUpdateMutationVariables>;

/**
 * __useVoucherChannelListingUpdateMutation__
 *
 * To run a mutation, you first call `useVoucherChannelListingUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoucherChannelListingUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voucherChannelListingUpdateMutation, { data, loading, error }] = useVoucherChannelListingUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVoucherChannelListingUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VoucherChannelListingUpdateMutation, Types.VoucherChannelListingUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VoucherChannelListingUpdateMutation, Types.VoucherChannelListingUpdateMutationVariables>(VoucherChannelListingUpdateDocument, options);
      }
export type VoucherChannelListingUpdateMutationHookResult = ReturnType<typeof useVoucherChannelListingUpdateMutation>;
export type VoucherChannelListingUpdateMutationResult = Apollo.MutationResult<Types.VoucherChannelListingUpdateMutation>;
export type VoucherChannelListingUpdateMutationOptions = Apollo.BaseMutationOptions<Types.VoucherChannelListingUpdateMutation, Types.VoucherChannelListingUpdateMutationVariables>;
export const VoucherUpdateDocument = gql`
    mutation VoucherUpdate($input: VoucherInput!, $id: ID!) {
  voucherUpdate(id: $id, input: $input) {
    errors {
      ...DiscountError
      voucherCodes
    }
    voucher {
      ...Voucher
    }
  }
}
    ${DiscountErrorFragmentDoc}
${VoucherFragmentDoc}`;
export type VoucherUpdateMutationFn = Apollo.MutationFunction<Types.VoucherUpdateMutation, Types.VoucherUpdateMutationVariables>;

/**
 * __useVoucherUpdateMutation__
 *
 * To run a mutation, you first call `useVoucherUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoucherUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voucherUpdateMutation, { data, loading, error }] = useVoucherUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVoucherUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VoucherUpdateMutation, Types.VoucherUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VoucherUpdateMutation, Types.VoucherUpdateMutationVariables>(VoucherUpdateDocument, options);
      }
export type VoucherUpdateMutationHookResult = ReturnType<typeof useVoucherUpdateMutation>;
export type VoucherUpdateMutationResult = Apollo.MutationResult<Types.VoucherUpdateMutation>;
export type VoucherUpdateMutationOptions = Apollo.BaseMutationOptions<Types.VoucherUpdateMutation, Types.VoucherUpdateMutationVariables>;
export const VoucherCataloguesAddDocument = gql`
    mutation VoucherCataloguesAdd($input: CatalogueInput!, $id: ID!, $after: String, $before: String, $first: Int, $last: Int, $includeProducts: Boolean!, $includeCollections: Boolean!, $includeCategories: Boolean!, $includeVariants: Boolean!) {
  voucherCataloguesAdd(id: $id, input: $input) {
    errors {
      ...DiscountError
    }
    voucher {
      ...VoucherDetails
    }
  }
}
    ${DiscountErrorFragmentDoc}
${VoucherDetailsFragmentDoc}`;
export type VoucherCataloguesAddMutationFn = Apollo.MutationFunction<Types.VoucherCataloguesAddMutation, Types.VoucherCataloguesAddMutationVariables>;

/**
 * __useVoucherCataloguesAddMutation__
 *
 * To run a mutation, you first call `useVoucherCataloguesAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoucherCataloguesAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voucherCataloguesAddMutation, { data, loading, error }] = useVoucherCataloguesAddMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      includeProducts: // value for 'includeProducts'
 *      includeCollections: // value for 'includeCollections'
 *      includeCategories: // value for 'includeCategories'
 *      includeVariants: // value for 'includeVariants'
 *   },
 * });
 */
export function useVoucherCataloguesAddMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VoucherCataloguesAddMutation, Types.VoucherCataloguesAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VoucherCataloguesAddMutation, Types.VoucherCataloguesAddMutationVariables>(VoucherCataloguesAddDocument, options);
      }
export type VoucherCataloguesAddMutationHookResult = ReturnType<typeof useVoucherCataloguesAddMutation>;
export type VoucherCataloguesAddMutationResult = Apollo.MutationResult<Types.VoucherCataloguesAddMutation>;
export type VoucherCataloguesAddMutationOptions = Apollo.BaseMutationOptions<Types.VoucherCataloguesAddMutation, Types.VoucherCataloguesAddMutationVariables>;
export const VoucherCataloguesRemoveDocument = gql`
    mutation VoucherCataloguesRemove($input: CatalogueInput!, $id: ID!, $after: String, $before: String, $first: Int, $last: Int, $includeProducts: Boolean!, $includeCollections: Boolean!, $includeCategories: Boolean!, $includeVariants: Boolean!) {
  voucherCataloguesRemove(id: $id, input: $input) {
    errors {
      ...DiscountError
    }
    voucher {
      ...VoucherDetails
    }
  }
}
    ${DiscountErrorFragmentDoc}
${VoucherDetailsFragmentDoc}`;
export type VoucherCataloguesRemoveMutationFn = Apollo.MutationFunction<Types.VoucherCataloguesRemoveMutation, Types.VoucherCataloguesRemoveMutationVariables>;

/**
 * __useVoucherCataloguesRemoveMutation__
 *
 * To run a mutation, you first call `useVoucherCataloguesRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoucherCataloguesRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voucherCataloguesRemoveMutation, { data, loading, error }] = useVoucherCataloguesRemoveMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      includeProducts: // value for 'includeProducts'
 *      includeCollections: // value for 'includeCollections'
 *      includeCategories: // value for 'includeCategories'
 *      includeVariants: // value for 'includeVariants'
 *   },
 * });
 */
export function useVoucherCataloguesRemoveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VoucherCataloguesRemoveMutation, Types.VoucherCataloguesRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VoucherCataloguesRemoveMutation, Types.VoucherCataloguesRemoveMutationVariables>(VoucherCataloguesRemoveDocument, options);
      }
export type VoucherCataloguesRemoveMutationHookResult = ReturnType<typeof useVoucherCataloguesRemoveMutation>;
export type VoucherCataloguesRemoveMutationResult = Apollo.MutationResult<Types.VoucherCataloguesRemoveMutation>;
export type VoucherCataloguesRemoveMutationOptions = Apollo.BaseMutationOptions<Types.VoucherCataloguesRemoveMutation, Types.VoucherCataloguesRemoveMutationVariables>;
export const VoucherCreateDocument = gql`
    mutation VoucherCreate($input: VoucherInput!) {
  voucherCreate(input: $input) {
    errors {
      ...DiscountError
      voucherCodes
    }
    voucher {
      ...Voucher
    }
  }
}
    ${DiscountErrorFragmentDoc}
${VoucherFragmentDoc}`;
export type VoucherCreateMutationFn = Apollo.MutationFunction<Types.VoucherCreateMutation, Types.VoucherCreateMutationVariables>;

/**
 * __useVoucherCreateMutation__
 *
 * To run a mutation, you first call `useVoucherCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoucherCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voucherCreateMutation, { data, loading, error }] = useVoucherCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVoucherCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VoucherCreateMutation, Types.VoucherCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VoucherCreateMutation, Types.VoucherCreateMutationVariables>(VoucherCreateDocument, options);
      }
export type VoucherCreateMutationHookResult = ReturnType<typeof useVoucherCreateMutation>;
export type VoucherCreateMutationResult = Apollo.MutationResult<Types.VoucherCreateMutation>;
export type VoucherCreateMutationOptions = Apollo.BaseMutationOptions<Types.VoucherCreateMutation, Types.VoucherCreateMutationVariables>;
export const VoucherDeleteDocument = gql`
    mutation VoucherDelete($id: ID!) {
  voucherDelete(id: $id) {
    errors {
      ...DiscountError
      voucherCodes
    }
  }
}
    ${DiscountErrorFragmentDoc}`;
export type VoucherDeleteMutationFn = Apollo.MutationFunction<Types.VoucherDeleteMutation, Types.VoucherDeleteMutationVariables>;

/**
 * __useVoucherDeleteMutation__
 *
 * To run a mutation, you first call `useVoucherDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoucherDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voucherDeleteMutation, { data, loading, error }] = useVoucherDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVoucherDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VoucherDeleteMutation, Types.VoucherDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VoucherDeleteMutation, Types.VoucherDeleteMutationVariables>(VoucherDeleteDocument, options);
      }
export type VoucherDeleteMutationHookResult = ReturnType<typeof useVoucherDeleteMutation>;
export type VoucherDeleteMutationResult = Apollo.MutationResult<Types.VoucherDeleteMutation>;
export type VoucherDeleteMutationOptions = Apollo.BaseMutationOptions<Types.VoucherDeleteMutation, Types.VoucherDeleteMutationVariables>;
export const VoucherBulkDeleteDocument = gql`
    mutation VoucherBulkDelete($ids: [ID!]!) {
  voucherBulkDelete(ids: $ids) {
    errors {
      ...VoucherBulkDeleteError
    }
  }
}
    ${VoucherBulkDeleteErrorFragmentDoc}`;
export type VoucherBulkDeleteMutationFn = Apollo.MutationFunction<Types.VoucherBulkDeleteMutation, Types.VoucherBulkDeleteMutationVariables>;

/**
 * __useVoucherBulkDeleteMutation__
 *
 * To run a mutation, you first call `useVoucherBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoucherBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voucherBulkDeleteMutation, { data, loading, error }] = useVoucherBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useVoucherBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VoucherBulkDeleteMutation, Types.VoucherBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VoucherBulkDeleteMutation, Types.VoucherBulkDeleteMutationVariables>(VoucherBulkDeleteDocument, options);
      }
export type VoucherBulkDeleteMutationHookResult = ReturnType<typeof useVoucherBulkDeleteMutation>;
export type VoucherBulkDeleteMutationResult = Apollo.MutationResult<Types.VoucherBulkDeleteMutation>;
export type VoucherBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.VoucherBulkDeleteMutation, Types.VoucherBulkDeleteMutationVariables>;
export const PromotionCreateDocument = gql`
    mutation PromotionCreate($input: PromotionCreateInput!) {
  promotionCreate(input: $input) {
    errors {
      ...PromotionCreateError
    }
    promotion {
      ...PromotionDetails
    }
  }
}
    ${PromotionCreateErrorFragmentDoc}
${PromotionDetailsFragmentDoc}`;
export type PromotionCreateMutationFn = Apollo.MutationFunction<Types.PromotionCreateMutation, Types.PromotionCreateMutationVariables>;

/**
 * __usePromotionCreateMutation__
 *
 * To run a mutation, you first call `usePromotionCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromotionCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promotionCreateMutation, { data, loading, error }] = usePromotionCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePromotionCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PromotionCreateMutation, Types.PromotionCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PromotionCreateMutation, Types.PromotionCreateMutationVariables>(PromotionCreateDocument, options);
      }
export type PromotionCreateMutationHookResult = ReturnType<typeof usePromotionCreateMutation>;
export type PromotionCreateMutationResult = Apollo.MutationResult<Types.PromotionCreateMutation>;
export type PromotionCreateMutationOptions = Apollo.BaseMutationOptions<Types.PromotionCreateMutation, Types.PromotionCreateMutationVariables>;
export const PromotionUpdateDocument = gql`
    mutation PromotionUpdate($id: ID!, $input: PromotionUpdateInput!) {
  promotionUpdate(id: $id, input: $input) {
    errors {
      ...PromotionUpdateError
    }
    promotion {
      ...PromotionDetails
    }
  }
}
    ${PromotionUpdateErrorFragmentDoc}
${PromotionDetailsFragmentDoc}`;
export type PromotionUpdateMutationFn = Apollo.MutationFunction<Types.PromotionUpdateMutation, Types.PromotionUpdateMutationVariables>;

/**
 * __usePromotionUpdateMutation__
 *
 * To run a mutation, you first call `usePromotionUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromotionUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promotionUpdateMutation, { data, loading, error }] = usePromotionUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePromotionUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PromotionUpdateMutation, Types.PromotionUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PromotionUpdateMutation, Types.PromotionUpdateMutationVariables>(PromotionUpdateDocument, options);
      }
export type PromotionUpdateMutationHookResult = ReturnType<typeof usePromotionUpdateMutation>;
export type PromotionUpdateMutationResult = Apollo.MutationResult<Types.PromotionUpdateMutation>;
export type PromotionUpdateMutationOptions = Apollo.BaseMutationOptions<Types.PromotionUpdateMutation, Types.PromotionUpdateMutationVariables>;
export const PromotionDeleteDocument = gql`
    mutation PromotionDelete($id: ID!) {
  promotionDelete(id: $id) {
    errors {
      ...PromotionDeleteError
    }
  }
}
    ${PromotionDeleteErrorFragmentDoc}`;
export type PromotionDeleteMutationFn = Apollo.MutationFunction<Types.PromotionDeleteMutation, Types.PromotionDeleteMutationVariables>;

/**
 * __usePromotionDeleteMutation__
 *
 * To run a mutation, you first call `usePromotionDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromotionDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promotionDeleteMutation, { data, loading, error }] = usePromotionDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePromotionDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PromotionDeleteMutation, Types.PromotionDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PromotionDeleteMutation, Types.PromotionDeleteMutationVariables>(PromotionDeleteDocument, options);
      }
export type PromotionDeleteMutationHookResult = ReturnType<typeof usePromotionDeleteMutation>;
export type PromotionDeleteMutationResult = Apollo.MutationResult<Types.PromotionDeleteMutation>;
export type PromotionDeleteMutationOptions = Apollo.BaseMutationOptions<Types.PromotionDeleteMutation, Types.PromotionDeleteMutationVariables>;
export const PromotionRuleUpdateDocument = gql`
    mutation PromotionRuleUpdate($id: ID!, $input: PromotionRuleUpdateInput!) {
  promotionRuleUpdate(id: $id, input: $input) {
    errors {
      ...PromotionRuleUpdateError
    }
    promotionRule {
      ...PromotionRuleDetails
    }
  }
}
    ${PromotionRuleUpdateErrorFragmentDoc}
${PromotionRuleDetailsFragmentDoc}`;
export type PromotionRuleUpdateMutationFn = Apollo.MutationFunction<Types.PromotionRuleUpdateMutation, Types.PromotionRuleUpdateMutationVariables>;

/**
 * __usePromotionRuleUpdateMutation__
 *
 * To run a mutation, you first call `usePromotionRuleUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromotionRuleUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promotionRuleUpdateMutation, { data, loading, error }] = usePromotionRuleUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePromotionRuleUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PromotionRuleUpdateMutation, Types.PromotionRuleUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PromotionRuleUpdateMutation, Types.PromotionRuleUpdateMutationVariables>(PromotionRuleUpdateDocument, options);
      }
export type PromotionRuleUpdateMutationHookResult = ReturnType<typeof usePromotionRuleUpdateMutation>;
export type PromotionRuleUpdateMutationResult = Apollo.MutationResult<Types.PromotionRuleUpdateMutation>;
export type PromotionRuleUpdateMutationOptions = Apollo.BaseMutationOptions<Types.PromotionRuleUpdateMutation, Types.PromotionRuleUpdateMutationVariables>;
export const PromotionRuleCreateDocument = gql`
    mutation PromotionRuleCreate($input: PromotionRuleCreateInput!) {
  promotionRuleCreate(input: $input) {
    errors {
      ...PromotionRuleCreateError
    }
    promotionRule {
      ...PromotionRuleDetails
    }
  }
}
    ${PromotionRuleCreateErrorFragmentDoc}
${PromotionRuleDetailsFragmentDoc}`;
export type PromotionRuleCreateMutationFn = Apollo.MutationFunction<Types.PromotionRuleCreateMutation, Types.PromotionRuleCreateMutationVariables>;

/**
 * __usePromotionRuleCreateMutation__
 *
 * To run a mutation, you first call `usePromotionRuleCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromotionRuleCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promotionRuleCreateMutation, { data, loading, error }] = usePromotionRuleCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePromotionRuleCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PromotionRuleCreateMutation, Types.PromotionRuleCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PromotionRuleCreateMutation, Types.PromotionRuleCreateMutationVariables>(PromotionRuleCreateDocument, options);
      }
export type PromotionRuleCreateMutationHookResult = ReturnType<typeof usePromotionRuleCreateMutation>;
export type PromotionRuleCreateMutationResult = Apollo.MutationResult<Types.PromotionRuleCreateMutation>;
export type PromotionRuleCreateMutationOptions = Apollo.BaseMutationOptions<Types.PromotionRuleCreateMutation, Types.PromotionRuleCreateMutationVariables>;
export const PromotionRuleDeleteDocument = gql`
    mutation PromotionRuleDelete($id: ID!) {
  promotionRuleDelete(id: $id) {
    errors {
      ...PromotionRuleDeleteError
    }
    promotionRule {
      id
    }
  }
}
    ${PromotionRuleDeleteErrorFragmentDoc}`;
export type PromotionRuleDeleteMutationFn = Apollo.MutationFunction<Types.PromotionRuleDeleteMutation, Types.PromotionRuleDeleteMutationVariables>;

/**
 * __usePromotionRuleDeleteMutation__
 *
 * To run a mutation, you first call `usePromotionRuleDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromotionRuleDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promotionRuleDeleteMutation, { data, loading, error }] = usePromotionRuleDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePromotionRuleDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PromotionRuleDeleteMutation, Types.PromotionRuleDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PromotionRuleDeleteMutation, Types.PromotionRuleDeleteMutationVariables>(PromotionRuleDeleteDocument, options);
      }
export type PromotionRuleDeleteMutationHookResult = ReturnType<typeof usePromotionRuleDeleteMutation>;
export type PromotionRuleDeleteMutationResult = Apollo.MutationResult<Types.PromotionRuleDeleteMutation>;
export type PromotionRuleDeleteMutationOptions = Apollo.BaseMutationOptions<Types.PromotionRuleDeleteMutation, Types.PromotionRuleDeleteMutationVariables>;
export const SaleListDocument = gql`
    query SaleList($after: String, $before: String, $first: Int, $last: Int, $filter: SaleFilterInput, $sort: SaleSortingInput, $channel: String) {
  sales(
    after: $after
    before: $before
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
    channel: $channel
  ) {
    edges {
      node {
        ...Sale
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${SaleFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSaleListQuery__
 *
 * To run a query within a React component, call `useSaleListQuery` and pass it any options that fit your needs.
 * When your component renders, `useSaleListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSaleListQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useSaleListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.SaleListQuery, Types.SaleListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SaleListQuery, Types.SaleListQueryVariables>(SaleListDocument, options);
      }
export function useSaleListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SaleListQuery, Types.SaleListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SaleListQuery, Types.SaleListQueryVariables>(SaleListDocument, options);
        }
export type SaleListQueryHookResult = ReturnType<typeof useSaleListQuery>;
export type SaleListLazyQueryHookResult = ReturnType<typeof useSaleListLazyQuery>;
export type SaleListQueryResult = Apollo.QueryResult<Types.SaleListQuery, Types.SaleListQueryVariables>;
export const PromotionsListDocument = gql`
    query PromotionsList($after: String, $before: String, $first: Int, $last: Int, $where: PromotionWhereInput, $sort: PromotionSortingInput) {
  promotions(
    after: $after
    before: $before
    first: $first
    last: $last
    where: $where
    sortBy: $sort
  ) {
    edges {
      node {
        ...Promotion
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PromotionFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __usePromotionsListQuery__
 *
 * To run a query within a React component, call `usePromotionsListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePromotionsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePromotionsListQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      where: // value for 'where'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function usePromotionsListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.PromotionsListQuery, Types.PromotionsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PromotionsListQuery, Types.PromotionsListQueryVariables>(PromotionsListDocument, options);
      }
export function usePromotionsListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PromotionsListQuery, Types.PromotionsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PromotionsListQuery, Types.PromotionsListQueryVariables>(PromotionsListDocument, options);
        }
export type PromotionsListQueryHookResult = ReturnType<typeof usePromotionsListQuery>;
export type PromotionsListLazyQueryHookResult = ReturnType<typeof usePromotionsListLazyQuery>;
export type PromotionsListQueryResult = Apollo.QueryResult<Types.PromotionsListQuery, Types.PromotionsListQueryVariables>;
export const VoucherListDocument = gql`
    query VoucherList($after: String, $before: String, $first: Int, $last: Int, $filter: VoucherFilterInput, $sort: VoucherSortingInput, $channel: String) {
  vouchers(
    after: $after
    before: $before
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
    channel: $channel
  ) {
    edges {
      node {
        ...Voucher
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${VoucherFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useVoucherListQuery__
 *
 * To run a query within a React component, call `useVoucherListQuery` and pass it any options that fit your needs.
 * When your component renders, `useVoucherListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVoucherListQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useVoucherListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.VoucherListQuery, Types.VoucherListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.VoucherListQuery, Types.VoucherListQueryVariables>(VoucherListDocument, options);
      }
export function useVoucherListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.VoucherListQuery, Types.VoucherListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.VoucherListQuery, Types.VoucherListQueryVariables>(VoucherListDocument, options);
        }
export type VoucherListQueryHookResult = ReturnType<typeof useVoucherListQuery>;
export type VoucherListLazyQueryHookResult = ReturnType<typeof useVoucherListLazyQuery>;
export type VoucherListQueryResult = Apollo.QueryResult<Types.VoucherListQuery, Types.VoucherListQueryVariables>;
export const SaleDetailsDocument = gql`
    query SaleDetails($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $includeVariants: Boolean!, $includeProducts: Boolean!, $includeCollections: Boolean!, $includeCategories: Boolean!) {
  sale(id: $id) {
    ...SaleDetails
  }
}
    ${SaleDetailsFragmentDoc}`;

/**
 * __useSaleDetailsQuery__
 *
 * To run a query within a React component, call `useSaleDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSaleDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSaleDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      includeVariants: // value for 'includeVariants'
 *      includeProducts: // value for 'includeProducts'
 *      includeCollections: // value for 'includeCollections'
 *      includeCategories: // value for 'includeCategories'
 *   },
 * });
 */
export function useSaleDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SaleDetailsQuery, Types.SaleDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SaleDetailsQuery, Types.SaleDetailsQueryVariables>(SaleDetailsDocument, options);
      }
export function useSaleDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SaleDetailsQuery, Types.SaleDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SaleDetailsQuery, Types.SaleDetailsQueryVariables>(SaleDetailsDocument, options);
        }
export type SaleDetailsQueryHookResult = ReturnType<typeof useSaleDetailsQuery>;
export type SaleDetailsLazyQueryHookResult = ReturnType<typeof useSaleDetailsLazyQuery>;
export type SaleDetailsQueryResult = Apollo.QueryResult<Types.SaleDetailsQuery, Types.SaleDetailsQueryVariables>;
export const VoucherDetailsDocument = gql`
    query VoucherDetails($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $includeProducts: Boolean!, $includeCollections: Boolean!, $includeCategories: Boolean!, $includeVariants: Boolean!) {
  voucher(id: $id) {
    ...VoucherDetails
  }
}
    ${VoucherDetailsFragmentDoc}`;

/**
 * __useVoucherDetailsQuery__
 *
 * To run a query within a React component, call `useVoucherDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVoucherDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVoucherDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      includeProducts: // value for 'includeProducts'
 *      includeCollections: // value for 'includeCollections'
 *      includeCategories: // value for 'includeCategories'
 *      includeVariants: // value for 'includeVariants'
 *   },
 * });
 */
export function useVoucherDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.VoucherDetailsQuery, Types.VoucherDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.VoucherDetailsQuery, Types.VoucherDetailsQueryVariables>(VoucherDetailsDocument, options);
      }
export function useVoucherDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.VoucherDetailsQuery, Types.VoucherDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.VoucherDetailsQuery, Types.VoucherDetailsQueryVariables>(VoucherDetailsDocument, options);
        }
export type VoucherDetailsQueryHookResult = ReturnType<typeof useVoucherDetailsQuery>;
export type VoucherDetailsLazyQueryHookResult = ReturnType<typeof useVoucherDetailsLazyQuery>;
export type VoucherDetailsQueryResult = Apollo.QueryResult<Types.VoucherDetailsQuery, Types.VoucherDetailsQueryVariables>;
export const VoucherCodesDocument = gql`
    query VoucherCodes($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  voucher(id: $id) {
    codes(first: $first, last: $last, before: $before, after: $after) {
      edges {
        node {
          ...VoucherCode
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
}
    ${VoucherCodeFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useVoucherCodesQuery__
 *
 * To run a query within a React component, call `useVoucherCodesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVoucherCodesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVoucherCodesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useVoucherCodesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.VoucherCodesQuery, Types.VoucherCodesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.VoucherCodesQuery, Types.VoucherCodesQueryVariables>(VoucherCodesDocument, options);
      }
export function useVoucherCodesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.VoucherCodesQuery, Types.VoucherCodesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.VoucherCodesQuery, Types.VoucherCodesQueryVariables>(VoucherCodesDocument, options);
        }
export type VoucherCodesQueryHookResult = ReturnType<typeof useVoucherCodesQuery>;
export type VoucherCodesLazyQueryHookResult = ReturnType<typeof useVoucherCodesLazyQuery>;
export type VoucherCodesQueryResult = Apollo.QueryResult<Types.VoucherCodesQuery, Types.VoucherCodesQueryVariables>;
export const PromotionDetailsDocument = gql`
    query PromotionDetails($id: ID!) {
  promotion(id: $id) {
    ...PromotionDetails
  }
}
    ${PromotionDetailsFragmentDoc}`;

/**
 * __usePromotionDetailsQuery__
 *
 * To run a query within a React component, call `usePromotionDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePromotionDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePromotionDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePromotionDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PromotionDetailsQuery, Types.PromotionDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PromotionDetailsQuery, Types.PromotionDetailsQueryVariables>(PromotionDetailsDocument, options);
      }
export function usePromotionDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PromotionDetailsQuery, Types.PromotionDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PromotionDetailsQuery, Types.PromotionDetailsQueryVariables>(PromotionDetailsDocument, options);
        }
export type PromotionDetailsQueryHookResult = ReturnType<typeof usePromotionDetailsQuery>;
export type PromotionDetailsLazyQueryHookResult = ReturnType<typeof usePromotionDetailsLazyQuery>;
export type PromotionDetailsQueryResult = Apollo.QueryResult<Types.PromotionDetailsQuery, Types.PromotionDetailsQueryVariables>;
export const RuleConditionsSelectedOptionsDetailsDocument = gql`
    query RuleConditionsSelectedOptionsDetails($categoriesIds: [ID!], $collectionsIds: [ID!], $productsIds: [ID!], $variantsIds: [ID!]) {
  categories(first: 100, where: {ids: $categoriesIds}) {
    edges {
      node {
        id
        name
      }
    }
  }
  collections(first: 100, where: {ids: $collectionsIds}) {
    edges {
      node {
        id
        name
      }
    }
  }
  products(first: 100, where: {ids: $productsIds}) {
    edges {
      node {
        id
        name
      }
    }
  }
  productVariants(first: 100, where: {ids: $variantsIds}) {
    edges {
      node {
        id
        name
        product {
          name
        }
      }
    }
  }
}
    `;

/**
 * __useRuleConditionsSelectedOptionsDetailsQuery__
 *
 * To run a query within a React component, call `useRuleConditionsSelectedOptionsDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRuleConditionsSelectedOptionsDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRuleConditionsSelectedOptionsDetailsQuery({
 *   variables: {
 *      categoriesIds: // value for 'categoriesIds'
 *      collectionsIds: // value for 'collectionsIds'
 *      productsIds: // value for 'productsIds'
 *      variantsIds: // value for 'variantsIds'
 *   },
 * });
 */
export function useRuleConditionsSelectedOptionsDetailsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.RuleConditionsSelectedOptionsDetailsQuery, Types.RuleConditionsSelectedOptionsDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.RuleConditionsSelectedOptionsDetailsQuery, Types.RuleConditionsSelectedOptionsDetailsQueryVariables>(RuleConditionsSelectedOptionsDetailsDocument, options);
      }
export function useRuleConditionsSelectedOptionsDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.RuleConditionsSelectedOptionsDetailsQuery, Types.RuleConditionsSelectedOptionsDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.RuleConditionsSelectedOptionsDetailsQuery, Types.RuleConditionsSelectedOptionsDetailsQueryVariables>(RuleConditionsSelectedOptionsDetailsDocument, options);
        }
export type RuleConditionsSelectedOptionsDetailsQueryHookResult = ReturnType<typeof useRuleConditionsSelectedOptionsDetailsQuery>;
export type RuleConditionsSelectedOptionsDetailsLazyQueryHookResult = ReturnType<typeof useRuleConditionsSelectedOptionsDetailsLazyQuery>;
export type RuleConditionsSelectedOptionsDetailsQueryResult = Apollo.QueryResult<Types.RuleConditionsSelectedOptionsDetailsQuery, Types.RuleConditionsSelectedOptionsDetailsQueryVariables>;
export const GiftLabelsDocument = gql`
    query GiftLabels($ids: [ID!]) {
  productVariants(first: 100, where: {ids: $ids}) {
    edges {
      node {
        id
        name
        product {
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGiftLabelsQuery__
 *
 * To run a query within a React component, call `useGiftLabelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftLabelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftLabelsQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useGiftLabelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.GiftLabelsQuery, Types.GiftLabelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GiftLabelsQuery, Types.GiftLabelsQueryVariables>(GiftLabelsDocument, options);
      }
export function useGiftLabelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GiftLabelsQuery, Types.GiftLabelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GiftLabelsQuery, Types.GiftLabelsQueryVariables>(GiftLabelsDocument, options);
        }
export type GiftLabelsQueryHookResult = ReturnType<typeof useGiftLabelsQuery>;
export type GiftLabelsLazyQueryHookResult = ReturnType<typeof useGiftLabelsLazyQuery>;
export type GiftLabelsQueryResult = Apollo.QueryResult<Types.GiftLabelsQuery, Types.GiftLabelsQueryVariables>;
export const PromotionDetailsQueryDocument = gql`
    query PromotionDetailsQuery($id: ID!) {
  promotion(id: $id) {
    id
    name
    description
    startDate
    endDate
    type
    rules {
      id
      name
      description
      channels {
        ...PromotionRuleChannel
      }
      giftIds
      rewardType
      rewardValueType
      rewardValue
      cataloguePredicate
      orderPredicate
    }
  }
}
    ${PromotionRuleChannelFragmentDoc}`;

/**
 * __usePromotionDetailsQueryQuery__
 *
 * To run a query within a React component, call `usePromotionDetailsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePromotionDetailsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePromotionDetailsQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePromotionDetailsQueryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PromotionDetailsQueryQuery, Types.PromotionDetailsQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PromotionDetailsQueryQuery, Types.PromotionDetailsQueryQueryVariables>(PromotionDetailsQueryDocument, options);
      }
export function usePromotionDetailsQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PromotionDetailsQueryQuery, Types.PromotionDetailsQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PromotionDetailsQueryQuery, Types.PromotionDetailsQueryQueryVariables>(PromotionDetailsQueryDocument, options);
        }
export type PromotionDetailsQueryQueryHookResult = ReturnType<typeof usePromotionDetailsQueryQuery>;
export type PromotionDetailsQueryLazyQueryHookResult = ReturnType<typeof usePromotionDetailsQueryLazyQuery>;
export type PromotionDetailsQueryQueryResult = Apollo.QueryResult<Types.PromotionDetailsQueryQuery, Types.PromotionDetailsQueryQueryVariables>;
export const AppFailedPendingWebhooksDocument = gql`
    query AppFailedPendingWebhooks($canFetchAppEvents: Boolean!) {
  apps(first: 50, filter: {type: THIRDPARTY}) {
    edges {
      node {
        id
        ...AppEventDeliveries
      }
    }
  }
}
    ${AppEventDeliveriesFragmentDoc}`;

/**
 * __useAppFailedPendingWebhooksQuery__
 *
 * To run a query within a React component, call `useAppFailedPendingWebhooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppFailedPendingWebhooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppFailedPendingWebhooksQuery({
 *   variables: {
 *      canFetchAppEvents: // value for 'canFetchAppEvents'
 *   },
 * });
 */
export function useAppFailedPendingWebhooksQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AppFailedPendingWebhooksQuery, Types.AppFailedPendingWebhooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AppFailedPendingWebhooksQuery, Types.AppFailedPendingWebhooksQueryVariables>(AppFailedPendingWebhooksDocument, options);
      }
export function useAppFailedPendingWebhooksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AppFailedPendingWebhooksQuery, Types.AppFailedPendingWebhooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AppFailedPendingWebhooksQuery, Types.AppFailedPendingWebhooksQueryVariables>(AppFailedPendingWebhooksDocument, options);
        }
export type AppFailedPendingWebhooksQueryHookResult = ReturnType<typeof useAppFailedPendingWebhooksQuery>;
export type AppFailedPendingWebhooksLazyQueryHookResult = ReturnType<typeof useAppFailedPendingWebhooksLazyQuery>;
export type AppFailedPendingWebhooksQueryResult = Apollo.QueryResult<Types.AppFailedPendingWebhooksQuery, Types.AppFailedPendingWebhooksQueryVariables>;
export const AppDeleteFailedInstallationDocument = gql`
    mutation AppDeleteFailedInstallation($id: ID!) {
  appDeleteFailedInstallation(id: $id) {
    appInstallation {
      id
      status
      appName
      message
    }
    errors {
      ...AppError
    }
  }
}
    ${AppErrorFragmentDoc}`;
export type AppDeleteFailedInstallationMutationFn = Apollo.MutationFunction<Types.AppDeleteFailedInstallationMutation, Types.AppDeleteFailedInstallationMutationVariables>;

/**
 * __useAppDeleteFailedInstallationMutation__
 *
 * To run a mutation, you first call `useAppDeleteFailedInstallationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppDeleteFailedInstallationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appDeleteFailedInstallationMutation, { data, loading, error }] = useAppDeleteFailedInstallationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAppDeleteFailedInstallationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppDeleteFailedInstallationMutation, Types.AppDeleteFailedInstallationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppDeleteFailedInstallationMutation, Types.AppDeleteFailedInstallationMutationVariables>(AppDeleteFailedInstallationDocument, options);
      }
export type AppDeleteFailedInstallationMutationHookResult = ReturnType<typeof useAppDeleteFailedInstallationMutation>;
export type AppDeleteFailedInstallationMutationResult = Apollo.MutationResult<Types.AppDeleteFailedInstallationMutation>;
export type AppDeleteFailedInstallationMutationOptions = Apollo.BaseMutationOptions<Types.AppDeleteFailedInstallationMutation, Types.AppDeleteFailedInstallationMutationVariables>;
export const WebhookCreateDocument = gql`
    mutation WebhookCreate($input: WebhookCreateInput!) {
  webhookCreate(input: $input) {
    errors {
      ...WebhookError
    }
    webhook {
      ...WebhookDetails
    }
  }
}
    ${WebhookErrorFragmentDoc}
${WebhookDetailsFragmentDoc}`;
export type WebhookCreateMutationFn = Apollo.MutationFunction<Types.WebhookCreateMutation, Types.WebhookCreateMutationVariables>;

/**
 * __useWebhookCreateMutation__
 *
 * To run a mutation, you first call `useWebhookCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWebhookCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [webhookCreateMutation, { data, loading, error }] = useWebhookCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useWebhookCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.WebhookCreateMutation, Types.WebhookCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.WebhookCreateMutation, Types.WebhookCreateMutationVariables>(WebhookCreateDocument, options);
      }
export type WebhookCreateMutationHookResult = ReturnType<typeof useWebhookCreateMutation>;
export type WebhookCreateMutationResult = Apollo.MutationResult<Types.WebhookCreateMutation>;
export type WebhookCreateMutationOptions = Apollo.BaseMutationOptions<Types.WebhookCreateMutation, Types.WebhookCreateMutationVariables>;
export const WebhookUpdateDocument = gql`
    mutation WebhookUpdate($id: ID!, $input: WebhookUpdateInput!) {
  webhookUpdate(id: $id, input: $input) {
    errors {
      ...WebhookError
    }
    webhook {
      ...WebhookDetails
    }
  }
}
    ${WebhookErrorFragmentDoc}
${WebhookDetailsFragmentDoc}`;
export type WebhookUpdateMutationFn = Apollo.MutationFunction<Types.WebhookUpdateMutation, Types.WebhookUpdateMutationVariables>;

/**
 * __useWebhookUpdateMutation__
 *
 * To run a mutation, you first call `useWebhookUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWebhookUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [webhookUpdateMutation, { data, loading, error }] = useWebhookUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useWebhookUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.WebhookUpdateMutation, Types.WebhookUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.WebhookUpdateMutation, Types.WebhookUpdateMutationVariables>(WebhookUpdateDocument, options);
      }
export type WebhookUpdateMutationHookResult = ReturnType<typeof useWebhookUpdateMutation>;
export type WebhookUpdateMutationResult = Apollo.MutationResult<Types.WebhookUpdateMutation>;
export type WebhookUpdateMutationOptions = Apollo.BaseMutationOptions<Types.WebhookUpdateMutation, Types.WebhookUpdateMutationVariables>;
export const WebhookDeleteDocument = gql`
    mutation WebhookDelete($id: ID!) {
  webhookDelete(id: $id) {
    errors {
      ...WebhookError
    }
  }
}
    ${WebhookErrorFragmentDoc}`;
export type WebhookDeleteMutationFn = Apollo.MutationFunction<Types.WebhookDeleteMutation, Types.WebhookDeleteMutationVariables>;

/**
 * __useWebhookDeleteMutation__
 *
 * To run a mutation, you first call `useWebhookDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWebhookDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [webhookDeleteMutation, { data, loading, error }] = useWebhookDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWebhookDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.WebhookDeleteMutation, Types.WebhookDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.WebhookDeleteMutation, Types.WebhookDeleteMutationVariables>(WebhookDeleteDocument, options);
      }
export type WebhookDeleteMutationHookResult = ReturnType<typeof useWebhookDeleteMutation>;
export type WebhookDeleteMutationResult = Apollo.MutationResult<Types.WebhookDeleteMutation>;
export type WebhookDeleteMutationOptions = Apollo.BaseMutationOptions<Types.WebhookDeleteMutation, Types.WebhookDeleteMutationVariables>;
export const PluginUpdateDocument = gql`
    mutation PluginUpdate($channelId: ID, $id: ID!, $input: PluginUpdateInput!) {
  pluginUpdate(channelId: $channelId, id: $id, input: $input) {
    errors {
      ...PluginError
    }
    plugin {
      ...PluginsDetails
    }
  }
}
    ${PluginErrorFragmentDoc}
${PluginsDetailsFragmentDoc}`;
export type PluginUpdateMutationFn = Apollo.MutationFunction<Types.PluginUpdateMutation, Types.PluginUpdateMutationVariables>;

/**
 * __usePluginUpdateMutation__
 *
 * To run a mutation, you first call `usePluginUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePluginUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pluginUpdateMutation, { data, loading, error }] = usePluginUpdateMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePluginUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PluginUpdateMutation, Types.PluginUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PluginUpdateMutation, Types.PluginUpdateMutationVariables>(PluginUpdateDocument, options);
      }
export type PluginUpdateMutationHookResult = ReturnType<typeof usePluginUpdateMutation>;
export type PluginUpdateMutationResult = Apollo.MutationResult<Types.PluginUpdateMutation>;
export type PluginUpdateMutationOptions = Apollo.BaseMutationOptions<Types.PluginUpdateMutation, Types.PluginUpdateMutationVariables>;
export const AppCreateDocument = gql`
    mutation AppCreate($input: AppInput!, $hasManagedAppsPermission: Boolean = true) {
  appCreate(input: $input) {
    authToken
    app {
      ...App
    }
    errors {
      ...AppError
    }
  }
}
    ${AppFragmentDoc}
${AppErrorFragmentDoc}`;
export type AppCreateMutationFn = Apollo.MutationFunction<Types.AppCreateMutation, Types.AppCreateMutationVariables>;

/**
 * __useAppCreateMutation__
 *
 * To run a mutation, you first call `useAppCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appCreateMutation, { data, loading, error }] = useAppCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      hasManagedAppsPermission: // value for 'hasManagedAppsPermission'
 *   },
 * });
 */
export function useAppCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppCreateMutation, Types.AppCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppCreateMutation, Types.AppCreateMutationVariables>(AppCreateDocument, options);
      }
export type AppCreateMutationHookResult = ReturnType<typeof useAppCreateMutation>;
export type AppCreateMutationResult = Apollo.MutationResult<Types.AppCreateMutation>;
export type AppCreateMutationOptions = Apollo.BaseMutationOptions<Types.AppCreateMutation, Types.AppCreateMutationVariables>;
export const AppDeleteDocument = gql`
    mutation AppDelete($id: ID!, $hasManagedAppsPermission: Boolean = true) {
  appDelete(id: $id) {
    app {
      ...App
    }
    errors {
      ...AppError
    }
  }
}
    ${AppFragmentDoc}
${AppErrorFragmentDoc}`;
export type AppDeleteMutationFn = Apollo.MutationFunction<Types.AppDeleteMutation, Types.AppDeleteMutationVariables>;

/**
 * __useAppDeleteMutation__
 *
 * To run a mutation, you first call `useAppDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appDeleteMutation, { data, loading, error }] = useAppDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      hasManagedAppsPermission: // value for 'hasManagedAppsPermission'
 *   },
 * });
 */
export function useAppDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppDeleteMutation, Types.AppDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppDeleteMutation, Types.AppDeleteMutationVariables>(AppDeleteDocument, options);
      }
export type AppDeleteMutationHookResult = ReturnType<typeof useAppDeleteMutation>;
export type AppDeleteMutationResult = Apollo.MutationResult<Types.AppDeleteMutation>;
export type AppDeleteMutationOptions = Apollo.BaseMutationOptions<Types.AppDeleteMutation, Types.AppDeleteMutationVariables>;
export const AppFetchDocument = gql`
    mutation AppFetch($manifestUrl: String!) {
  appFetchManifest(manifestUrl: $manifestUrl) {
    manifest {
      ...AppManifest
    }
    errors {
      ...AppError
    }
  }
}
    ${AppManifestFragmentDoc}
${AppErrorFragmentDoc}`;
export type AppFetchMutationFn = Apollo.MutationFunction<Types.AppFetchMutation, Types.AppFetchMutationVariables>;

/**
 * __useAppFetchMutation__
 *
 * To run a mutation, you first call `useAppFetchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppFetchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appFetchMutation, { data, loading, error }] = useAppFetchMutation({
 *   variables: {
 *      manifestUrl: // value for 'manifestUrl'
 *   },
 * });
 */
export function useAppFetchMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppFetchMutation, Types.AppFetchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppFetchMutation, Types.AppFetchMutationVariables>(AppFetchDocument, options);
      }
export type AppFetchMutationHookResult = ReturnType<typeof useAppFetchMutation>;
export type AppFetchMutationResult = Apollo.MutationResult<Types.AppFetchMutation>;
export type AppFetchMutationOptions = Apollo.BaseMutationOptions<Types.AppFetchMutation, Types.AppFetchMutationVariables>;
export const AppInstallDocument = gql`
    mutation AppInstall($input: AppInstallInput!) {
  appInstall(input: $input) {
    appInstallation {
      id
      status
      appName
      manifestUrl
    }
    errors {
      ...AppError
    }
  }
}
    ${AppErrorFragmentDoc}`;
export type AppInstallMutationFn = Apollo.MutationFunction<Types.AppInstallMutation, Types.AppInstallMutationVariables>;

/**
 * __useAppInstallMutation__
 *
 * To run a mutation, you first call `useAppInstallMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppInstallMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appInstallMutation, { data, loading, error }] = useAppInstallMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAppInstallMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppInstallMutation, Types.AppInstallMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppInstallMutation, Types.AppInstallMutationVariables>(AppInstallDocument, options);
      }
export type AppInstallMutationHookResult = ReturnType<typeof useAppInstallMutation>;
export type AppInstallMutationResult = Apollo.MutationResult<Types.AppInstallMutation>;
export type AppInstallMutationOptions = Apollo.BaseMutationOptions<Types.AppInstallMutation, Types.AppInstallMutationVariables>;
export const AppRetryInstallDocument = gql`
    mutation AppRetryInstall($id: ID!) {
  appRetryInstall(id: $id) {
    appInstallation {
      id
      status
      appName
      manifestUrl
    }
    errors {
      ...AppError
    }
  }
}
    ${AppErrorFragmentDoc}`;
export type AppRetryInstallMutationFn = Apollo.MutationFunction<Types.AppRetryInstallMutation, Types.AppRetryInstallMutationVariables>;

/**
 * __useAppRetryInstallMutation__
 *
 * To run a mutation, you first call `useAppRetryInstallMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppRetryInstallMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appRetryInstallMutation, { data, loading, error }] = useAppRetryInstallMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAppRetryInstallMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppRetryInstallMutation, Types.AppRetryInstallMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppRetryInstallMutation, Types.AppRetryInstallMutationVariables>(AppRetryInstallDocument, options);
      }
export type AppRetryInstallMutationHookResult = ReturnType<typeof useAppRetryInstallMutation>;
export type AppRetryInstallMutationResult = Apollo.MutationResult<Types.AppRetryInstallMutation>;
export type AppRetryInstallMutationOptions = Apollo.BaseMutationOptions<Types.AppRetryInstallMutation, Types.AppRetryInstallMutationVariables>;
export const AppUpdateDocument = gql`
    mutation AppUpdate($id: ID!, $input: AppInput!, $hasManagedAppsPermission: Boolean = true) {
  appUpdate(id: $id, input: $input) {
    app {
      ...App
      permissions {
        code
        name
      }
    }
    errors {
      ...AppError
      message
      permissions
    }
  }
}
    ${AppFragmentDoc}
${AppErrorFragmentDoc}`;
export type AppUpdateMutationFn = Apollo.MutationFunction<Types.AppUpdateMutation, Types.AppUpdateMutationVariables>;

/**
 * __useAppUpdateMutation__
 *
 * To run a mutation, you first call `useAppUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appUpdateMutation, { data, loading, error }] = useAppUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      hasManagedAppsPermission: // value for 'hasManagedAppsPermission'
 *   },
 * });
 */
export function useAppUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppUpdateMutation, Types.AppUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppUpdateMutation, Types.AppUpdateMutationVariables>(AppUpdateDocument, options);
      }
export type AppUpdateMutationHookResult = ReturnType<typeof useAppUpdateMutation>;
export type AppUpdateMutationResult = Apollo.MutationResult<Types.AppUpdateMutation>;
export type AppUpdateMutationOptions = Apollo.BaseMutationOptions<Types.AppUpdateMutation, Types.AppUpdateMutationVariables>;
export const AppTokenCreateDocument = gql`
    mutation AppTokenCreate($input: AppTokenInput!) {
  appTokenCreate(input: $input) {
    appToken {
      name
      authToken
      id
    }
    authToken
    errors {
      ...AppError
    }
  }
}
    ${AppErrorFragmentDoc}`;
export type AppTokenCreateMutationFn = Apollo.MutationFunction<Types.AppTokenCreateMutation, Types.AppTokenCreateMutationVariables>;

/**
 * __useAppTokenCreateMutation__
 *
 * To run a mutation, you first call `useAppTokenCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppTokenCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appTokenCreateMutation, { data, loading, error }] = useAppTokenCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAppTokenCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppTokenCreateMutation, Types.AppTokenCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppTokenCreateMutation, Types.AppTokenCreateMutationVariables>(AppTokenCreateDocument, options);
      }
export type AppTokenCreateMutationHookResult = ReturnType<typeof useAppTokenCreateMutation>;
export type AppTokenCreateMutationResult = Apollo.MutationResult<Types.AppTokenCreateMutation>;
export type AppTokenCreateMutationOptions = Apollo.BaseMutationOptions<Types.AppTokenCreateMutation, Types.AppTokenCreateMutationVariables>;
export const AppTokenDeleteDocument = gql`
    mutation AppTokenDelete($id: ID!) {
  appTokenDelete(id: $id) {
    appToken {
      name
      authToken
      id
    }
    errors {
      ...AppError
    }
  }
}
    ${AppErrorFragmentDoc}`;
export type AppTokenDeleteMutationFn = Apollo.MutationFunction<Types.AppTokenDeleteMutation, Types.AppTokenDeleteMutationVariables>;

/**
 * __useAppTokenDeleteMutation__
 *
 * To run a mutation, you first call `useAppTokenDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppTokenDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appTokenDeleteMutation, { data, loading, error }] = useAppTokenDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAppTokenDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppTokenDeleteMutation, Types.AppTokenDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppTokenDeleteMutation, Types.AppTokenDeleteMutationVariables>(AppTokenDeleteDocument, options);
      }
export type AppTokenDeleteMutationHookResult = ReturnType<typeof useAppTokenDeleteMutation>;
export type AppTokenDeleteMutationResult = Apollo.MutationResult<Types.AppTokenDeleteMutation>;
export type AppTokenDeleteMutationOptions = Apollo.BaseMutationOptions<Types.AppTokenDeleteMutation, Types.AppTokenDeleteMutationVariables>;
export const AppActivateDocument = gql`
    mutation AppActivate($id: ID!) {
  appActivate(id: $id) {
    errors {
      ...AppError
    }
  }
}
    ${AppErrorFragmentDoc}`;
export type AppActivateMutationFn = Apollo.MutationFunction<Types.AppActivateMutation, Types.AppActivateMutationVariables>;

/**
 * __useAppActivateMutation__
 *
 * To run a mutation, you first call `useAppActivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppActivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appActivateMutation, { data, loading, error }] = useAppActivateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAppActivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppActivateMutation, Types.AppActivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppActivateMutation, Types.AppActivateMutationVariables>(AppActivateDocument, options);
      }
export type AppActivateMutationHookResult = ReturnType<typeof useAppActivateMutation>;
export type AppActivateMutationResult = Apollo.MutationResult<Types.AppActivateMutation>;
export type AppActivateMutationOptions = Apollo.BaseMutationOptions<Types.AppActivateMutation, Types.AppActivateMutationVariables>;
export const AppDeactivateDocument = gql`
    mutation AppDeactivate($id: ID!) {
  appDeactivate(id: $id) {
    errors {
      ...AppError
    }
  }
}
    ${AppErrorFragmentDoc}`;
export type AppDeactivateMutationFn = Apollo.MutationFunction<Types.AppDeactivateMutation, Types.AppDeactivateMutationVariables>;

/**
 * __useAppDeactivateMutation__
 *
 * To run a mutation, you first call `useAppDeactivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppDeactivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appDeactivateMutation, { data, loading, error }] = useAppDeactivateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAppDeactivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppDeactivateMutation, Types.AppDeactivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppDeactivateMutation, Types.AppDeactivateMutationVariables>(AppDeactivateDocument, options);
      }
export type AppDeactivateMutationHookResult = ReturnType<typeof useAppDeactivateMutation>;
export type AppDeactivateMutationResult = Apollo.MutationResult<Types.AppDeactivateMutation>;
export type AppDeactivateMutationOptions = Apollo.BaseMutationOptions<Types.AppDeactivateMutation, Types.AppDeactivateMutationVariables>;
export const AppUpdatePermissionsDocument = gql`
    mutation AppUpdatePermissions($id: ID!, $permissions: [PermissionEnum!]!) {
  appUpdate(id: $id, input: {permissions: $permissions}) {
    app {
      permissions {
        code
        name
      }
    }
    errors {
      ...AppError
    }
  }
}
    ${AppErrorFragmentDoc}`;
export type AppUpdatePermissionsMutationFn = Apollo.MutationFunction<Types.AppUpdatePermissionsMutation, Types.AppUpdatePermissionsMutationVariables>;

/**
 * __useAppUpdatePermissionsMutation__
 *
 * To run a mutation, you first call `useAppUpdatePermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppUpdatePermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appUpdatePermissionsMutation, { data, loading, error }] = useAppUpdatePermissionsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      permissions: // value for 'permissions'
 *   },
 * });
 */
export function useAppUpdatePermissionsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AppUpdatePermissionsMutation, Types.AppUpdatePermissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AppUpdatePermissionsMutation, Types.AppUpdatePermissionsMutationVariables>(AppUpdatePermissionsDocument, options);
      }
export type AppUpdatePermissionsMutationHookResult = ReturnType<typeof useAppUpdatePermissionsMutation>;
export type AppUpdatePermissionsMutationResult = Apollo.MutationResult<Types.AppUpdatePermissionsMutation>;
export type AppUpdatePermissionsMutationOptions = Apollo.BaseMutationOptions<Types.AppUpdatePermissionsMutation, Types.AppUpdatePermissionsMutationVariables>;
export const InstalledAppsDocument = gql`
    query InstalledApps($before: String, $after: String, $first: Int, $last: Int, $filter: AppFilterInput) {
  apps(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      node {
        ...InstalledApp
      }
    }
  }
}
    ${InstalledAppFragmentDoc}`;

/**
 * __useInstalledAppsQuery__
 *
 * To run a query within a React component, call `useInstalledAppsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInstalledAppsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInstalledAppsQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useInstalledAppsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.InstalledAppsQuery, Types.InstalledAppsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.InstalledAppsQuery, Types.InstalledAppsQueryVariables>(InstalledAppsDocument, options);
      }
export function useInstalledAppsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.InstalledAppsQuery, Types.InstalledAppsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.InstalledAppsQuery, Types.InstalledAppsQueryVariables>(InstalledAppsDocument, options);
        }
export type InstalledAppsQueryHookResult = ReturnType<typeof useInstalledAppsQuery>;
export type InstalledAppsLazyQueryHookResult = ReturnType<typeof useInstalledAppsLazyQuery>;
export type InstalledAppsQueryResult = Apollo.QueryResult<Types.InstalledAppsQuery, Types.InstalledAppsQueryVariables>;
export const InstalledAppsListDocument = gql`
    query InstalledAppsList($before: String, $after: String, $first: Int, $last: Int, $filter: AppFilterInput) {
  apps(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      node {
        ...InstalledAppDetails
      }
    }
  }
}
    ${InstalledAppDetailsFragmentDoc}`;

/**
 * __useInstalledAppsListQuery__
 *
 * To run a query within a React component, call `useInstalledAppsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useInstalledAppsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInstalledAppsListQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useInstalledAppsListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.InstalledAppsListQuery, Types.InstalledAppsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.InstalledAppsListQuery, Types.InstalledAppsListQueryVariables>(InstalledAppsListDocument, options);
      }
export function useInstalledAppsListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.InstalledAppsListQuery, Types.InstalledAppsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.InstalledAppsListQuery, Types.InstalledAppsListQueryVariables>(InstalledAppsListDocument, options);
        }
export type InstalledAppsListQueryHookResult = ReturnType<typeof useInstalledAppsListQuery>;
export type InstalledAppsListLazyQueryHookResult = ReturnType<typeof useInstalledAppsListLazyQuery>;
export type InstalledAppsListQueryResult = Apollo.QueryResult<Types.InstalledAppsListQuery, Types.InstalledAppsListQueryVariables>;
export const EventDeliveryDocument = gql`
    query EventDelivery($before: String, $after: String, $first: Int, $last: Int, $filter: AppFilterInput, $canFetchAppEvents: Boolean!) {
  apps(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        ...AppEventDeliveries
      }
    }
  }
}
    ${AppEventDeliveriesFragmentDoc}`;

/**
 * __useEventDeliveryQuery__
 *
 * To run a query within a React component, call `useEventDeliveryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventDeliveryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventDeliveryQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      canFetchAppEvents: // value for 'canFetchAppEvents'
 *   },
 * });
 */
export function useEventDeliveryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.EventDeliveryQuery, Types.EventDeliveryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.EventDeliveryQuery, Types.EventDeliveryQueryVariables>(EventDeliveryDocument, options);
      }
export function useEventDeliveryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.EventDeliveryQuery, Types.EventDeliveryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.EventDeliveryQuery, Types.EventDeliveryQueryVariables>(EventDeliveryDocument, options);
        }
export type EventDeliveryQueryHookResult = ReturnType<typeof useEventDeliveryQuery>;
export type EventDeliveryLazyQueryHookResult = ReturnType<typeof useEventDeliveryLazyQuery>;
export type EventDeliveryQueryResult = Apollo.QueryResult<Types.EventDeliveryQuery, Types.EventDeliveryQueryVariables>;
export const AppsInstallationsDocument = gql`
    query AppsInstallations {
  appsInstallations {
    ...AppInstallation
  }
}
    ${AppInstallationFragmentDoc}`;

/**
 * __useAppsInstallationsQuery__
 *
 * To run a query within a React component, call `useAppsInstallationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppsInstallationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppsInstallationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppsInstallationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.AppsInstallationsQuery, Types.AppsInstallationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AppsInstallationsQuery, Types.AppsInstallationsQueryVariables>(AppsInstallationsDocument, options);
      }
export function useAppsInstallationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AppsInstallationsQuery, Types.AppsInstallationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AppsInstallationsQuery, Types.AppsInstallationsQueryVariables>(AppsInstallationsDocument, options);
        }
export type AppsInstallationsQueryHookResult = ReturnType<typeof useAppsInstallationsQuery>;
export type AppsInstallationsLazyQueryHookResult = ReturnType<typeof useAppsInstallationsLazyQuery>;
export type AppsInstallationsQueryResult = Apollo.QueryResult<Types.AppsInstallationsQuery, Types.AppsInstallationsQueryVariables>;
export const AppDocument = gql`
    query App($id: ID!, $hasManagedAppsPermission: Boolean!) {
  app(id: $id) {
    ...App
    aboutApp
    author
    permissions {
      code
      name
    }
    dataPrivacy
    dataPrivacyUrl
    brand {
      logo {
        default(size: 64, format: WEBP)
      }
    }
  }
}
    ${AppFragmentDoc}`;

/**
 * __useAppQuery__
 *
 * To run a query within a React component, call `useAppQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppQuery({
 *   variables: {
 *      id: // value for 'id'
 *      hasManagedAppsPermission: // value for 'hasManagedAppsPermission'
 *   },
 * });
 */
export function useAppQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AppQuery, Types.AppQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AppQuery, Types.AppQueryVariables>(AppDocument, options);
      }
export function useAppLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AppQuery, Types.AppQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AppQuery, Types.AppQueryVariables>(AppDocument, options);
        }
export type AppQueryHookResult = ReturnType<typeof useAppQuery>;
export type AppLazyQueryHookResult = ReturnType<typeof useAppLazyQuery>;
export type AppQueryResult = Apollo.QueryResult<Types.AppQuery, Types.AppQueryVariables>;
export const ExtensionListDocument = gql`
    query ExtensionList($filter: AppExtensionFilterInput!) {
  appExtensions(filter: $filter, first: 100) {
    edges {
      node {
        id
        label
        url
        mountName
        targetName
        settings
        accessToken
        permissions {
          code
        }
        app {
          id
          appUrl
          name
          brand {
            logo {
              default(size: 32, format: WEBP)
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useExtensionListQuery__
 *
 * To run a query within a React component, call `useExtensionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useExtensionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExtensionListQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useExtensionListQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ExtensionListQuery, Types.ExtensionListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ExtensionListQuery, Types.ExtensionListQueryVariables>(ExtensionListDocument, options);
      }
export function useExtensionListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ExtensionListQuery, Types.ExtensionListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ExtensionListQuery, Types.ExtensionListQueryVariables>(ExtensionListDocument, options);
        }
export type ExtensionListQueryHookResult = ReturnType<typeof useExtensionListQuery>;
export type ExtensionListLazyQueryHookResult = ReturnType<typeof useExtensionListLazyQuery>;
export type ExtensionListQueryResult = Apollo.QueryResult<Types.ExtensionListQuery, Types.ExtensionListQueryVariables>;
export const AppWebhookDeliveriesDocument = gql`
    query AppWebhookDeliveries($appId: ID!) {
  app(id: $appId) {
    webhooks {
      id
      name
      isActive
      syncEvents {
        name
      }
      asyncEvents {
        name
      }
      eventDeliveries(first: 10, sortBy: {field: CREATED_AT, direction: DESC}) {
        edges {
          node {
            id
            createdAt
            status
            eventType
            attempts(first: 10, sortBy: {field: CREATED_AT, direction: DESC}) {
              edges {
                node {
                  ...EventDeliveryAttempt
                }
              }
            }
          }
        }
      }
    }
  }
}
    ${EventDeliveryAttemptFragmentDoc}`;

/**
 * __useAppWebhookDeliveriesQuery__
 *
 * To run a query within a React component, call `useAppWebhookDeliveriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppWebhookDeliveriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppWebhookDeliveriesQuery({
 *   variables: {
 *      appId: // value for 'appId'
 *   },
 * });
 */
export function useAppWebhookDeliveriesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AppWebhookDeliveriesQuery, Types.AppWebhookDeliveriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AppWebhookDeliveriesQuery, Types.AppWebhookDeliveriesQueryVariables>(AppWebhookDeliveriesDocument, options);
      }
export function useAppWebhookDeliveriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AppWebhookDeliveriesQuery, Types.AppWebhookDeliveriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AppWebhookDeliveriesQuery, Types.AppWebhookDeliveriesQueryVariables>(AppWebhookDeliveriesDocument, options);
        }
export type AppWebhookDeliveriesQueryHookResult = ReturnType<typeof useAppWebhookDeliveriesQuery>;
export type AppWebhookDeliveriesLazyQueryHookResult = ReturnType<typeof useAppWebhookDeliveriesLazyQuery>;
export type AppWebhookDeliveriesQueryResult = Apollo.QueryResult<Types.AppWebhookDeliveriesQuery, Types.AppWebhookDeliveriesQueryVariables>;
export const WebhookDetailsDocument = gql`
    query WebhookDetails($id: ID!) {
  webhook(id: $id) {
    ...WebhookDetails
  }
}
    ${WebhookDetailsFragmentDoc}`;

/**
 * __useWebhookDetailsQuery__
 *
 * To run a query within a React component, call `useWebhookDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWebhookDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWebhookDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWebhookDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.WebhookDetailsQuery, Types.WebhookDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.WebhookDetailsQuery, Types.WebhookDetailsQueryVariables>(WebhookDetailsDocument, options);
      }
export function useWebhookDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.WebhookDetailsQuery, Types.WebhookDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.WebhookDetailsQuery, Types.WebhookDetailsQueryVariables>(WebhookDetailsDocument, options);
        }
export type WebhookDetailsQueryHookResult = ReturnType<typeof useWebhookDetailsQuery>;
export type WebhookDetailsLazyQueryHookResult = ReturnType<typeof useWebhookDetailsLazyQuery>;
export type WebhookDetailsQueryResult = Apollo.QueryResult<Types.WebhookDetailsQuery, Types.WebhookDetailsQueryVariables>;
export const PluginsDocument = gql`
    query Plugins($first: Int, $after: String, $last: Int, $before: String, $filter: PluginFilterInput, $sort: PluginSortingInput) {
  plugins(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        ...PluginBase
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
    ${PluginBaseFragmentDoc}`;

/**
 * __usePluginsQuery__
 *
 * To run a query within a React component, call `usePluginsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePluginsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePluginsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function usePluginsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.PluginsQuery, Types.PluginsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PluginsQuery, Types.PluginsQueryVariables>(PluginsDocument, options);
      }
export function usePluginsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PluginsQuery, Types.PluginsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PluginsQuery, Types.PluginsQueryVariables>(PluginsDocument, options);
        }
export type PluginsQueryHookResult = ReturnType<typeof usePluginsQuery>;
export type PluginsLazyQueryHookResult = ReturnType<typeof usePluginsLazyQuery>;
export type PluginsQueryResult = Apollo.QueryResult<Types.PluginsQuery, Types.PluginsQueryVariables>;
export const PluginDocument = gql`
    query Plugin($id: ID!) {
  plugin(id: $id) {
    ...PluginsDetails
  }
}
    ${PluginsDetailsFragmentDoc}`;

/**
 * __usePluginQuery__
 *
 * To run a query within a React component, call `usePluginQuery` and pass it any options that fit your needs.
 * When your component renders, `usePluginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePluginQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePluginQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PluginQuery, Types.PluginQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PluginQuery, Types.PluginQueryVariables>(PluginDocument, options);
      }
export function usePluginLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PluginQuery, Types.PluginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PluginQuery, Types.PluginQueryVariables>(PluginDocument, options);
        }
export type PluginQueryHookResult = ReturnType<typeof usePluginQuery>;
export type PluginLazyQueryHookResult = ReturnType<typeof usePluginLazyQuery>;
export type PluginQueryResult = Apollo.QueryResult<Types.PluginQuery, Types.PluginQueryVariables>;
export const AppsListDocument = gql`
    query AppsList($before: String, $after: String, $first: Int, $last: Int, $sort: AppSortingInput, $filter: AppFilterInput, $canFetchAppEvents: Boolean!) {
  apps(
    before: $before
    after: $after
    first: $first
    last: $last
    sortBy: $sort
    filter: $filter
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      node {
        ...AppListItem
      }
    }
  }
}
    ${AppListItemFragmentDoc}`;

/**
 * __useAppsListQuery__
 *
 * To run a query within a React component, call `useAppsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppsListQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      sort: // value for 'sort'
 *      filter: // value for 'filter'
 *      canFetchAppEvents: // value for 'canFetchAppEvents'
 *   },
 * });
 */
export function useAppsListQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AppsListQuery, Types.AppsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AppsListQuery, Types.AppsListQueryVariables>(AppsListDocument, options);
      }
export function useAppsListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AppsListQuery, Types.AppsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AppsListQuery, Types.AppsListQueryVariables>(AppsListDocument, options);
        }
export type AppsListQueryHookResult = ReturnType<typeof useAppsListQuery>;
export type AppsListLazyQueryHookResult = ReturnType<typeof useAppsListLazyQuery>;
export type AppsListQueryResult = Apollo.QueryResult<Types.AppsListQuery, Types.AppsListQueryVariables>;
export const FileUploadDocument = gql`
    mutation FileUpload($file: Upload!) {
  fileUpload(file: $file) {
    uploadedFile {
      ...File
    }
    errors {
      ...UploadError
    }
  }
}
    ${FileFragmentDoc}
${UploadErrorFragmentDoc}`;
export type FileUploadMutationFn = Apollo.MutationFunction<Types.FileUploadMutation, Types.FileUploadMutationVariables>;

/**
 * __useFileUploadMutation__
 *
 * To run a mutation, you first call `useFileUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFileUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fileUploadMutation, { data, loading, error }] = useFileUploadMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useFileUploadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.FileUploadMutation, Types.FileUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.FileUploadMutation, Types.FileUploadMutationVariables>(FileUploadDocument, options);
      }
export type FileUploadMutationHookResult = ReturnType<typeof useFileUploadMutation>;
export type FileUploadMutationResult = Apollo.MutationResult<Types.FileUploadMutation>;
export type FileUploadMutationOptions = Apollo.BaseMutationOptions<Types.FileUploadMutation, Types.FileUploadMutationVariables>;
export const GiftCardBulkCreateDocument = gql`
    mutation GiftCardBulkCreate($input: GiftCardBulkCreateInput!) {
  giftCardBulkCreate(input: $input) {
    giftCards {
      id
    }
    errors {
      ...GiftCardBulkCreateErrorFragment
    }
  }
}
    ${GiftCardBulkCreateErrorFragmentFragmentDoc}`;
export type GiftCardBulkCreateMutationFn = Apollo.MutationFunction<Types.GiftCardBulkCreateMutation, Types.GiftCardBulkCreateMutationVariables>;

/**
 * __useGiftCardBulkCreateMutation__
 *
 * To run a mutation, you first call `useGiftCardBulkCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardBulkCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardBulkCreateMutation, { data, loading, error }] = useGiftCardBulkCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGiftCardBulkCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardBulkCreateMutation, Types.GiftCardBulkCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardBulkCreateMutation, Types.GiftCardBulkCreateMutationVariables>(GiftCardBulkCreateDocument, options);
      }
export type GiftCardBulkCreateMutationHookResult = ReturnType<typeof useGiftCardBulkCreateMutation>;
export type GiftCardBulkCreateMutationResult = Apollo.MutationResult<Types.GiftCardBulkCreateMutation>;
export type GiftCardBulkCreateMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardBulkCreateMutation, Types.GiftCardBulkCreateMutationVariables>;
export const GiftCardCreateDocument = gql`
    mutation GiftCardCreate($input: GiftCardCreateInput!) {
  giftCardCreate(input: $input) {
    giftCard {
      code
    }
    errors {
      ...GiftCardCreateErrorFragment
    }
  }
}
    ${GiftCardCreateErrorFragmentFragmentDoc}`;
export type GiftCardCreateMutationFn = Apollo.MutationFunction<Types.GiftCardCreateMutation, Types.GiftCardCreateMutationVariables>;

/**
 * __useGiftCardCreateMutation__
 *
 * To run a mutation, you first call `useGiftCardCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardCreateMutation, { data, loading, error }] = useGiftCardCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGiftCardCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardCreateMutation, Types.GiftCardCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardCreateMutation, Types.GiftCardCreateMutationVariables>(GiftCardCreateDocument, options);
      }
export type GiftCardCreateMutationHookResult = ReturnType<typeof useGiftCardCreateMutation>;
export type GiftCardCreateMutationResult = Apollo.MutationResult<Types.GiftCardCreateMutation>;
export type GiftCardCreateMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardCreateMutation, Types.GiftCardCreateMutationVariables>;
export const ChannelCurrenciesDocument = gql`
    query ChannelCurrencies {
  shop {
    channelCurrencies
  }
}
    `;

/**
 * __useChannelCurrenciesQuery__
 *
 * To run a query within a React component, call `useChannelCurrenciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelCurrenciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelCurrenciesQuery({
 *   variables: {
 *   },
 * });
 */
export function useChannelCurrenciesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ChannelCurrenciesQuery, Types.ChannelCurrenciesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ChannelCurrenciesQuery, Types.ChannelCurrenciesQueryVariables>(ChannelCurrenciesDocument, options);
      }
export function useChannelCurrenciesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ChannelCurrenciesQuery, Types.ChannelCurrenciesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ChannelCurrenciesQuery, Types.ChannelCurrenciesQueryVariables>(ChannelCurrenciesDocument, options);
        }
export type ChannelCurrenciesQueryHookResult = ReturnType<typeof useChannelCurrenciesQuery>;
export type ChannelCurrenciesLazyQueryHookResult = ReturnType<typeof useChannelCurrenciesLazyQuery>;
export type ChannelCurrenciesQueryResult = Apollo.QueryResult<Types.ChannelCurrenciesQuery, Types.ChannelCurrenciesQueryVariables>;
export const ExportGiftCardsDocument = gql`
    mutation ExportGiftCards($input: ExportGiftCardsInput!) {
  exportGiftCards(input: $input) {
    errors {
      ...ExportError
    }
    exportFile {
      id
    }
  }
}
    ${ExportErrorFragmentDoc}`;
export type ExportGiftCardsMutationFn = Apollo.MutationFunction<Types.ExportGiftCardsMutation, Types.ExportGiftCardsMutationVariables>;

/**
 * __useExportGiftCardsMutation__
 *
 * To run a mutation, you first call `useExportGiftCardsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExportGiftCardsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [exportGiftCardsMutation, { data, loading, error }] = useExportGiftCardsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExportGiftCardsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ExportGiftCardsMutation, Types.ExportGiftCardsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ExportGiftCardsMutation, Types.ExportGiftCardsMutationVariables>(ExportGiftCardsDocument, options);
      }
export type ExportGiftCardsMutationHookResult = ReturnType<typeof useExportGiftCardsMutation>;
export type ExportGiftCardsMutationResult = Apollo.MutationResult<Types.ExportGiftCardsMutation>;
export type ExportGiftCardsMutationOptions = Apollo.BaseMutationOptions<Types.ExportGiftCardsMutation, Types.ExportGiftCardsMutationVariables>;
export const GiftCardSettingsUpdateDocument = gql`
    mutation GiftCardSettingsUpdate($input: GiftCardSettingsUpdateInput!) {
  giftCardSettingsUpdate(input: $input) {
    errors {
      ...GiftCardSettingsError
    }
    giftCardSettings {
      ...GiftCardsSettings
    }
  }
}
    ${GiftCardSettingsErrorFragmentDoc}
${GiftCardsSettingsFragmentDoc}`;
export type GiftCardSettingsUpdateMutationFn = Apollo.MutationFunction<Types.GiftCardSettingsUpdateMutation, Types.GiftCardSettingsUpdateMutationVariables>;

/**
 * __useGiftCardSettingsUpdateMutation__
 *
 * To run a mutation, you first call `useGiftCardSettingsUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardSettingsUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardSettingsUpdateMutation, { data, loading, error }] = useGiftCardSettingsUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGiftCardSettingsUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardSettingsUpdateMutation, Types.GiftCardSettingsUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardSettingsUpdateMutation, Types.GiftCardSettingsUpdateMutationVariables>(GiftCardSettingsUpdateDocument, options);
      }
export type GiftCardSettingsUpdateMutationHookResult = ReturnType<typeof useGiftCardSettingsUpdateMutation>;
export type GiftCardSettingsUpdateMutationResult = Apollo.MutationResult<Types.GiftCardSettingsUpdateMutation>;
export type GiftCardSettingsUpdateMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardSettingsUpdateMutation, Types.GiftCardSettingsUpdateMutationVariables>;
export const GiftCardSettingsDocument = gql`
    query GiftCardSettings {
  giftCardSettings {
    ...GiftCardsSettings
  }
}
    ${GiftCardsSettingsFragmentDoc}`;

/**
 * __useGiftCardSettingsQuery__
 *
 * To run a query within a React component, call `useGiftCardSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftCardSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftCardSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGiftCardSettingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.GiftCardSettingsQuery, Types.GiftCardSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GiftCardSettingsQuery, Types.GiftCardSettingsQueryVariables>(GiftCardSettingsDocument, options);
      }
export function useGiftCardSettingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GiftCardSettingsQuery, Types.GiftCardSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GiftCardSettingsQuery, Types.GiftCardSettingsQueryVariables>(GiftCardSettingsDocument, options);
        }
export type GiftCardSettingsQueryHookResult = ReturnType<typeof useGiftCardSettingsQuery>;
export type GiftCardSettingsLazyQueryHookResult = ReturnType<typeof useGiftCardSettingsLazyQuery>;
export type GiftCardSettingsQueryResult = Apollo.QueryResult<Types.GiftCardSettingsQuery, Types.GiftCardSettingsQueryVariables>;
export const GiftCardResendDocument = gql`
    mutation GiftCardResend($input: GiftCardResendInput!) {
  giftCardResend(input: $input) {
    errors {
      ...GiftCardError
    }
    giftCard {
      ...GiftCardData
    }
  }
}
    ${GiftCardErrorFragmentDoc}
${GiftCardDataFragmentDoc}`;
export type GiftCardResendMutationFn = Apollo.MutationFunction<Types.GiftCardResendMutation, Types.GiftCardResendMutationVariables>;

/**
 * __useGiftCardResendMutation__
 *
 * To run a mutation, you first call `useGiftCardResendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardResendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardResendMutation, { data, loading, error }] = useGiftCardResendMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGiftCardResendMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardResendMutation, Types.GiftCardResendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardResendMutation, Types.GiftCardResendMutationVariables>(GiftCardResendDocument, options);
      }
export type GiftCardResendMutationHookResult = ReturnType<typeof useGiftCardResendMutation>;
export type GiftCardResendMutationResult = Apollo.MutationResult<Types.GiftCardResendMutation>;
export type GiftCardResendMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardResendMutation, Types.GiftCardResendMutationVariables>;
export const GiftCardActivateDocument = gql`
    mutation GiftCardActivate($id: ID!) {
  giftCardActivate(id: $id) {
    errors {
      ...GiftCardError
    }
    giftCard {
      ...GiftCardData
    }
  }
}
    ${GiftCardErrorFragmentDoc}
${GiftCardDataFragmentDoc}`;
export type GiftCardActivateMutationFn = Apollo.MutationFunction<Types.GiftCardActivateMutation, Types.GiftCardActivateMutationVariables>;

/**
 * __useGiftCardActivateMutation__
 *
 * To run a mutation, you first call `useGiftCardActivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardActivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardActivateMutation, { data, loading, error }] = useGiftCardActivateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGiftCardActivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardActivateMutation, Types.GiftCardActivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardActivateMutation, Types.GiftCardActivateMutationVariables>(GiftCardActivateDocument, options);
      }
export type GiftCardActivateMutationHookResult = ReturnType<typeof useGiftCardActivateMutation>;
export type GiftCardActivateMutationResult = Apollo.MutationResult<Types.GiftCardActivateMutation>;
export type GiftCardActivateMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardActivateMutation, Types.GiftCardActivateMutationVariables>;
export const GiftCardDeactivateDocument = gql`
    mutation GiftCardDeactivate($id: ID!) {
  giftCardDeactivate(id: $id) {
    errors {
      ...GiftCardError
    }
    giftCard {
      ...GiftCardData
    }
  }
}
    ${GiftCardErrorFragmentDoc}
${GiftCardDataFragmentDoc}`;
export type GiftCardDeactivateMutationFn = Apollo.MutationFunction<Types.GiftCardDeactivateMutation, Types.GiftCardDeactivateMutationVariables>;

/**
 * __useGiftCardDeactivateMutation__
 *
 * To run a mutation, you first call `useGiftCardDeactivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardDeactivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardDeactivateMutation, { data, loading, error }] = useGiftCardDeactivateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGiftCardDeactivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardDeactivateMutation, Types.GiftCardDeactivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardDeactivateMutation, Types.GiftCardDeactivateMutationVariables>(GiftCardDeactivateDocument, options);
      }
export type GiftCardDeactivateMutationHookResult = ReturnType<typeof useGiftCardDeactivateMutation>;
export type GiftCardDeactivateMutationResult = Apollo.MutationResult<Types.GiftCardDeactivateMutation>;
export type GiftCardDeactivateMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardDeactivateMutation, Types.GiftCardDeactivateMutationVariables>;
export const GiftCardUpdateDocument = gql`
    mutation GiftCardUpdate($id: ID!, $input: GiftCardUpdateInput!, $showCreatedBy: Boolean!) {
  giftCardUpdate(id: $id, input: $input) {
    errors {
      ...GiftCardError
    }
    giftCard {
      ...GiftCardData
      createdBy @include(if: $showCreatedBy) {
        ...UserBase
      }
      events {
        ...GiftCardEvent
      }
    }
  }
}
    ${GiftCardErrorFragmentDoc}
${GiftCardDataFragmentDoc}
${UserBaseFragmentDoc}
${GiftCardEventFragmentDoc}`;
export type GiftCardUpdateMutationFn = Apollo.MutationFunction<Types.GiftCardUpdateMutation, Types.GiftCardUpdateMutationVariables>;

/**
 * __useGiftCardUpdateMutation__
 *
 * To run a mutation, you first call `useGiftCardUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardUpdateMutation, { data, loading, error }] = useGiftCardUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      showCreatedBy: // value for 'showCreatedBy'
 *   },
 * });
 */
export function useGiftCardUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardUpdateMutation, Types.GiftCardUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardUpdateMutation, Types.GiftCardUpdateMutationVariables>(GiftCardUpdateDocument, options);
      }
export type GiftCardUpdateMutationHookResult = ReturnType<typeof useGiftCardUpdateMutation>;
export type GiftCardUpdateMutationResult = Apollo.MutationResult<Types.GiftCardUpdateMutation>;
export type GiftCardUpdateMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardUpdateMutation, Types.GiftCardUpdateMutationVariables>;
export const GiftCardAddNoteDocument = gql`
    mutation GiftCardAddNote($id: ID!, $input: GiftCardAddNoteInput!) {
  giftCardAddNote(id: $id, input: $input) {
    errors {
      ...GiftCardError
    }
    giftCard {
      ...GiftCardData
    }
    event {
      ...GiftCardEvent
    }
  }
}
    ${GiftCardErrorFragmentDoc}
${GiftCardDataFragmentDoc}
${GiftCardEventFragmentDoc}`;
export type GiftCardAddNoteMutationFn = Apollo.MutationFunction<Types.GiftCardAddNoteMutation, Types.GiftCardAddNoteMutationVariables>;

/**
 * __useGiftCardAddNoteMutation__
 *
 * To run a mutation, you first call `useGiftCardAddNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardAddNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardAddNoteMutation, { data, loading, error }] = useGiftCardAddNoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGiftCardAddNoteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardAddNoteMutation, Types.GiftCardAddNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardAddNoteMutation, Types.GiftCardAddNoteMutationVariables>(GiftCardAddNoteDocument, options);
      }
export type GiftCardAddNoteMutationHookResult = ReturnType<typeof useGiftCardAddNoteMutation>;
export type GiftCardAddNoteMutationResult = Apollo.MutationResult<Types.GiftCardAddNoteMutation>;
export type GiftCardAddNoteMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardAddNoteMutation, Types.GiftCardAddNoteMutationVariables>;
export const GiftCardBulkActivateDocument = gql`
    mutation GiftCardBulkActivate($ids: [ID!]!) {
  giftCardBulkActivate(ids: $ids) {
    errors {
      ...GiftCardError
    }
    count
  }
}
    ${GiftCardErrorFragmentDoc}`;
export type GiftCardBulkActivateMutationFn = Apollo.MutationFunction<Types.GiftCardBulkActivateMutation, Types.GiftCardBulkActivateMutationVariables>;

/**
 * __useGiftCardBulkActivateMutation__
 *
 * To run a mutation, you first call `useGiftCardBulkActivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardBulkActivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardBulkActivateMutation, { data, loading, error }] = useGiftCardBulkActivateMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useGiftCardBulkActivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardBulkActivateMutation, Types.GiftCardBulkActivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardBulkActivateMutation, Types.GiftCardBulkActivateMutationVariables>(GiftCardBulkActivateDocument, options);
      }
export type GiftCardBulkActivateMutationHookResult = ReturnType<typeof useGiftCardBulkActivateMutation>;
export type GiftCardBulkActivateMutationResult = Apollo.MutationResult<Types.GiftCardBulkActivateMutation>;
export type GiftCardBulkActivateMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardBulkActivateMutation, Types.GiftCardBulkActivateMutationVariables>;
export const GiftCardBulkDeactivateDocument = gql`
    mutation GiftCardBulkDeactivate($ids: [ID!]!) {
  giftCardBulkDeactivate(ids: $ids) {
    errors {
      ...GiftCardError
    }
    count
  }
}
    ${GiftCardErrorFragmentDoc}`;
export type GiftCardBulkDeactivateMutationFn = Apollo.MutationFunction<Types.GiftCardBulkDeactivateMutation, Types.GiftCardBulkDeactivateMutationVariables>;

/**
 * __useGiftCardBulkDeactivateMutation__
 *
 * To run a mutation, you first call `useGiftCardBulkDeactivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiftCardBulkDeactivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giftCardBulkDeactivateMutation, { data, loading, error }] = useGiftCardBulkDeactivateMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useGiftCardBulkDeactivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.GiftCardBulkDeactivateMutation, Types.GiftCardBulkDeactivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.GiftCardBulkDeactivateMutation, Types.GiftCardBulkDeactivateMutationVariables>(GiftCardBulkDeactivateDocument, options);
      }
export type GiftCardBulkDeactivateMutationHookResult = ReturnType<typeof useGiftCardBulkDeactivateMutation>;
export type GiftCardBulkDeactivateMutationResult = Apollo.MutationResult<Types.GiftCardBulkDeactivateMutation>;
export type GiftCardBulkDeactivateMutationOptions = Apollo.BaseMutationOptions<Types.GiftCardBulkDeactivateMutation, Types.GiftCardBulkDeactivateMutationVariables>;
export const GiftCardDetailsDocument = gql`
    query GiftCardDetails($id: ID!, $canSeeApp: Boolean!, $canSeeUser: Boolean!) {
  giftCard(id: $id) {
    ...GiftCardData
    events {
      ...GiftCardEvent
      app @include(if: $canSeeApp) {
        id
        name
        brand {
          logo {
            default(size: 128)
          }
        }
      }
      user @include(if: $canSeeUser) {
        ...UserBase
        email
        avatar(size: 128) {
          url
        }
      }
    }
  }
}
    ${GiftCardDataFragmentDoc}
${GiftCardEventFragmentDoc}
${UserBaseFragmentDoc}`;

/**
 * __useGiftCardDetailsQuery__
 *
 * To run a query within a React component, call `useGiftCardDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftCardDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftCardDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      canSeeApp: // value for 'canSeeApp'
 *      canSeeUser: // value for 'canSeeUser'
 *   },
 * });
 */
export function useGiftCardDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.GiftCardDetailsQuery, Types.GiftCardDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GiftCardDetailsQuery, Types.GiftCardDetailsQueryVariables>(GiftCardDetailsDocument, options);
      }
export function useGiftCardDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GiftCardDetailsQuery, Types.GiftCardDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GiftCardDetailsQuery, Types.GiftCardDetailsQueryVariables>(GiftCardDetailsDocument, options);
        }
export type GiftCardDetailsQueryHookResult = ReturnType<typeof useGiftCardDetailsQuery>;
export type GiftCardDetailsLazyQueryHookResult = ReturnType<typeof useGiftCardDetailsLazyQuery>;
export type GiftCardDetailsQueryResult = Apollo.QueryResult<Types.GiftCardDetailsQuery, Types.GiftCardDetailsQueryVariables>;
export const GiftCardCurrenciesDocument = gql`
    query GiftCardCurrencies {
  giftCardCurrencies
}
    `;

/**
 * __useGiftCardCurrenciesQuery__
 *
 * To run a query within a React component, call `useGiftCardCurrenciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftCardCurrenciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftCardCurrenciesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGiftCardCurrenciesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.GiftCardCurrenciesQuery, Types.GiftCardCurrenciesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GiftCardCurrenciesQuery, Types.GiftCardCurrenciesQueryVariables>(GiftCardCurrenciesDocument, options);
      }
export function useGiftCardCurrenciesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GiftCardCurrenciesQuery, Types.GiftCardCurrenciesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GiftCardCurrenciesQuery, Types.GiftCardCurrenciesQueryVariables>(GiftCardCurrenciesDocument, options);
        }
export type GiftCardCurrenciesQueryHookResult = ReturnType<typeof useGiftCardCurrenciesQuery>;
export type GiftCardCurrenciesLazyQueryHookResult = ReturnType<typeof useGiftCardCurrenciesLazyQuery>;
export type GiftCardCurrenciesQueryResult = Apollo.QueryResult<Types.GiftCardCurrenciesQuery, Types.GiftCardCurrenciesQueryVariables>;
export const DeleteGiftCardDocument = gql`
    mutation DeleteGiftCard($id: ID!) {
  giftCardDelete(id: $id) {
    errors {
      ...GiftCardError
    }
  }
}
    ${GiftCardErrorFragmentDoc}`;
export type DeleteGiftCardMutationFn = Apollo.MutationFunction<Types.DeleteGiftCardMutation, Types.DeleteGiftCardMutationVariables>;

/**
 * __useDeleteGiftCardMutation__
 *
 * To run a mutation, you first call `useDeleteGiftCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGiftCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGiftCardMutation, { data, loading, error }] = useDeleteGiftCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGiftCardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.DeleteGiftCardMutation, Types.DeleteGiftCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.DeleteGiftCardMutation, Types.DeleteGiftCardMutationVariables>(DeleteGiftCardDocument, options);
      }
export type DeleteGiftCardMutationHookResult = ReturnType<typeof useDeleteGiftCardMutation>;
export type DeleteGiftCardMutationResult = Apollo.MutationResult<Types.DeleteGiftCardMutation>;
export type DeleteGiftCardMutationOptions = Apollo.BaseMutationOptions<Types.DeleteGiftCardMutation, Types.DeleteGiftCardMutationVariables>;
export const BulkDeleteGiftCardDocument = gql`
    mutation BulkDeleteGiftCard($ids: [ID!]!) {
  giftCardBulkDelete(ids: $ids) {
    errors {
      ...GiftCardError
    }
  }
}
    ${GiftCardErrorFragmentDoc}`;
export type BulkDeleteGiftCardMutationFn = Apollo.MutationFunction<Types.BulkDeleteGiftCardMutation, Types.BulkDeleteGiftCardMutationVariables>;

/**
 * __useBulkDeleteGiftCardMutation__
 *
 * To run a mutation, you first call `useBulkDeleteGiftCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteGiftCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteGiftCardMutation, { data, loading, error }] = useBulkDeleteGiftCardMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useBulkDeleteGiftCardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.BulkDeleteGiftCardMutation, Types.BulkDeleteGiftCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.BulkDeleteGiftCardMutation, Types.BulkDeleteGiftCardMutationVariables>(BulkDeleteGiftCardDocument, options);
      }
export type BulkDeleteGiftCardMutationHookResult = ReturnType<typeof useBulkDeleteGiftCardMutation>;
export type BulkDeleteGiftCardMutationResult = Apollo.MutationResult<Types.BulkDeleteGiftCardMutation>;
export type BulkDeleteGiftCardMutationOptions = Apollo.BaseMutationOptions<Types.BulkDeleteGiftCardMutation, Types.BulkDeleteGiftCardMutationVariables>;
export const GiftCardListDocument = gql`
    query GiftCardList($first: Int, $after: String, $last: Int, $before: String, $filter: GiftCardFilterInput, $sort: GiftCardSortingInput) {
  giftCards(
    first: $first
    after: $after
    before: $before
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        id
        usedByEmail
        last4CodeChars
        isActive
        expiryDate
        product {
          id
          name
        }
        tags {
          name
        }
        usedBy {
          ...UserBase
        }
        currentBalance {
          ...Money
        }
      }
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    ${UserBaseFragmentDoc}
${MoneyFragmentDoc}`;

/**
 * __useGiftCardListQuery__
 *
 * To run a query within a React component, call `useGiftCardListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftCardListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftCardListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGiftCardListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.GiftCardListQuery, Types.GiftCardListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GiftCardListQuery, Types.GiftCardListQueryVariables>(GiftCardListDocument, options);
      }
export function useGiftCardListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GiftCardListQuery, Types.GiftCardListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GiftCardListQuery, Types.GiftCardListQueryVariables>(GiftCardListDocument, options);
        }
export type GiftCardListQueryHookResult = ReturnType<typeof useGiftCardListQuery>;
export type GiftCardListLazyQueryHookResult = ReturnType<typeof useGiftCardListLazyQuery>;
export type GiftCardListQueryResult = Apollo.QueryResult<Types.GiftCardListQuery, Types.GiftCardListQueryVariables>;
export const GiftCardTotalCountDocument = gql`
    query GiftCardTotalCount {
  giftCards {
    totalCount
  }
}
    `;

/**
 * __useGiftCardTotalCountQuery__
 *
 * To run a query within a React component, call `useGiftCardTotalCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftCardTotalCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftCardTotalCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGiftCardTotalCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.GiftCardTotalCountQuery, Types.GiftCardTotalCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GiftCardTotalCountQuery, Types.GiftCardTotalCountQueryVariables>(GiftCardTotalCountDocument, options);
      }
export function useGiftCardTotalCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GiftCardTotalCountQuery, Types.GiftCardTotalCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GiftCardTotalCountQuery, Types.GiftCardTotalCountQueryVariables>(GiftCardTotalCountDocument, options);
        }
export type GiftCardTotalCountQueryHookResult = ReturnType<typeof useGiftCardTotalCountQuery>;
export type GiftCardTotalCountLazyQueryHookResult = ReturnType<typeof useGiftCardTotalCountLazyQuery>;
export type GiftCardTotalCountQueryResult = Apollo.QueryResult<Types.GiftCardTotalCountQuery, Types.GiftCardTotalCountQueryVariables>;
export const GiftCardProductsCountDocument = gql`
    query GiftCardProductsCount($channel: String!) {
  giftCardProductTypes: productTypes(filter: {kind: GIFT_CARD}) {
    totalCount
  }
  giftCardProducts: products(filter: {giftCard: true}, channel: $channel) {
    totalCount
  }
}
    `;

/**
 * __useGiftCardProductsCountQuery__
 *
 * To run a query within a React component, call `useGiftCardProductsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftCardProductsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftCardProductsCountQuery({
 *   variables: {
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useGiftCardProductsCountQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.GiftCardProductsCountQuery, Types.GiftCardProductsCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GiftCardProductsCountQuery, Types.GiftCardProductsCountQueryVariables>(GiftCardProductsCountDocument, options);
      }
export function useGiftCardProductsCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GiftCardProductsCountQuery, Types.GiftCardProductsCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GiftCardProductsCountQuery, Types.GiftCardProductsCountQueryVariables>(GiftCardProductsCountDocument, options);
        }
export type GiftCardProductsCountQueryHookResult = ReturnType<typeof useGiftCardProductsCountQuery>;
export type GiftCardProductsCountLazyQueryHookResult = ReturnType<typeof useGiftCardProductsCountLazyQuery>;
export type GiftCardProductsCountQueryResult = Apollo.QueryResult<Types.GiftCardProductsCountQuery, Types.GiftCardProductsCountQueryVariables>;
export const CustomerGiftCardListDocument = gql`
    query CustomerGiftCardList($first: Int, $filter: GiftCardFilterInput) {
  giftCards(first: $first, filter: $filter) {
    edges {
      node {
        ...CustomerGiftCard
      }
    }
  }
}
    ${CustomerGiftCardFragmentDoc}`;

/**
 * __useCustomerGiftCardListQuery__
 *
 * To run a query within a React component, call `useCustomerGiftCardListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerGiftCardListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerGiftCardListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useCustomerGiftCardListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.CustomerGiftCardListQuery, Types.CustomerGiftCardListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CustomerGiftCardListQuery, Types.CustomerGiftCardListQueryVariables>(CustomerGiftCardListDocument, options);
      }
export function useCustomerGiftCardListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CustomerGiftCardListQuery, Types.CustomerGiftCardListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CustomerGiftCardListQuery, Types.CustomerGiftCardListQueryVariables>(CustomerGiftCardListDocument, options);
        }
export type CustomerGiftCardListQueryHookResult = ReturnType<typeof useCustomerGiftCardListQuery>;
export type CustomerGiftCardListLazyQueryHookResult = ReturnType<typeof useCustomerGiftCardListLazyQuery>;
export type CustomerGiftCardListQueryResult = Apollo.QueryResult<Types.CustomerGiftCardListQuery, Types.CustomerGiftCardListQueryVariables>;
export const PageTypeUpdateDocument = gql`
    mutation PageTypeUpdate($id: ID!, $input: PageTypeUpdateInput!) {
  pageTypeUpdate(id: $id, input: $input) {
    errors {
      ...PageError
    }
    pageType {
      ...PageTypeDetails
    }
  }
}
    ${PageErrorFragmentDoc}
${PageTypeDetailsFragmentDoc}`;
export type PageTypeUpdateMutationFn = Apollo.MutationFunction<Types.PageTypeUpdateMutation, Types.PageTypeUpdateMutationVariables>;

/**
 * __usePageTypeUpdateMutation__
 *
 * To run a mutation, you first call `usePageTypeUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageTypeUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageTypeUpdateMutation, { data, loading, error }] = usePageTypeUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePageTypeUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageTypeUpdateMutation, Types.PageTypeUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageTypeUpdateMutation, Types.PageTypeUpdateMutationVariables>(PageTypeUpdateDocument, options);
      }
export type PageTypeUpdateMutationHookResult = ReturnType<typeof usePageTypeUpdateMutation>;
export type PageTypeUpdateMutationResult = Apollo.MutationResult<Types.PageTypeUpdateMutation>;
export type PageTypeUpdateMutationOptions = Apollo.BaseMutationOptions<Types.PageTypeUpdateMutation, Types.PageTypeUpdateMutationVariables>;
export const PageTypeCreateDocument = gql`
    mutation PageTypeCreate($input: PageTypeCreateInput!) {
  pageTypeCreate(input: $input) {
    errors {
      ...PageError
    }
    pageType {
      ...PageTypeDetails
    }
  }
}
    ${PageErrorFragmentDoc}
${PageTypeDetailsFragmentDoc}`;
export type PageTypeCreateMutationFn = Apollo.MutationFunction<Types.PageTypeCreateMutation, Types.PageTypeCreateMutationVariables>;

/**
 * __usePageTypeCreateMutation__
 *
 * To run a mutation, you first call `usePageTypeCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageTypeCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageTypeCreateMutation, { data, loading, error }] = usePageTypeCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePageTypeCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageTypeCreateMutation, Types.PageTypeCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageTypeCreateMutation, Types.PageTypeCreateMutationVariables>(PageTypeCreateDocument, options);
      }
export type PageTypeCreateMutationHookResult = ReturnType<typeof usePageTypeCreateMutation>;
export type PageTypeCreateMutationResult = Apollo.MutationResult<Types.PageTypeCreateMutation>;
export type PageTypeCreateMutationOptions = Apollo.BaseMutationOptions<Types.PageTypeCreateMutation, Types.PageTypeCreateMutationVariables>;
export const AssignPageAttributeDocument = gql`
    mutation AssignPageAttribute($id: ID!, $ids: [ID!]!) {
  pageAttributeAssign(pageTypeId: $id, attributeIds: $ids) {
    errors {
      ...PageError
    }
    pageType {
      ...PageTypeDetails
    }
  }
}
    ${PageErrorFragmentDoc}
${PageTypeDetailsFragmentDoc}`;
export type AssignPageAttributeMutationFn = Apollo.MutationFunction<Types.AssignPageAttributeMutation, Types.AssignPageAttributeMutationVariables>;

/**
 * __useAssignPageAttributeMutation__
 *
 * To run a mutation, you first call `useAssignPageAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignPageAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignPageAttributeMutation, { data, loading, error }] = useAssignPageAttributeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useAssignPageAttributeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AssignPageAttributeMutation, Types.AssignPageAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AssignPageAttributeMutation, Types.AssignPageAttributeMutationVariables>(AssignPageAttributeDocument, options);
      }
export type AssignPageAttributeMutationHookResult = ReturnType<typeof useAssignPageAttributeMutation>;
export type AssignPageAttributeMutationResult = Apollo.MutationResult<Types.AssignPageAttributeMutation>;
export type AssignPageAttributeMutationOptions = Apollo.BaseMutationOptions<Types.AssignPageAttributeMutation, Types.AssignPageAttributeMutationVariables>;
export const UnassignPageAttributeDocument = gql`
    mutation UnassignPageAttribute($id: ID!, $ids: [ID!]!) {
  pageAttributeUnassign(pageTypeId: $id, attributeIds: $ids) {
    errors {
      ...PageError
    }
    pageType {
      ...PageTypeDetails
    }
  }
}
    ${PageErrorFragmentDoc}
${PageTypeDetailsFragmentDoc}`;
export type UnassignPageAttributeMutationFn = Apollo.MutationFunction<Types.UnassignPageAttributeMutation, Types.UnassignPageAttributeMutationVariables>;

/**
 * __useUnassignPageAttributeMutation__
 *
 * To run a mutation, you first call `useUnassignPageAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnassignPageAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unassignPageAttributeMutation, { data, loading, error }] = useUnassignPageAttributeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useUnassignPageAttributeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UnassignPageAttributeMutation, Types.UnassignPageAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UnassignPageAttributeMutation, Types.UnassignPageAttributeMutationVariables>(UnassignPageAttributeDocument, options);
      }
export type UnassignPageAttributeMutationHookResult = ReturnType<typeof useUnassignPageAttributeMutation>;
export type UnassignPageAttributeMutationResult = Apollo.MutationResult<Types.UnassignPageAttributeMutation>;
export type UnassignPageAttributeMutationOptions = Apollo.BaseMutationOptions<Types.UnassignPageAttributeMutation, Types.UnassignPageAttributeMutationVariables>;
export const PageTypeDeleteDocument = gql`
    mutation PageTypeDelete($id: ID!) {
  pageTypeDelete(id: $id) {
    errors {
      ...PageTypeDeleteErrorFragment
    }
    pageType {
      id
    }
  }
}
    ${PageTypeDeleteErrorFragmentFragmentDoc}`;
export type PageTypeDeleteMutationFn = Apollo.MutationFunction<Types.PageTypeDeleteMutation, Types.PageTypeDeleteMutationVariables>;

/**
 * __usePageTypeDeleteMutation__
 *
 * To run a mutation, you first call `usePageTypeDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageTypeDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageTypeDeleteMutation, { data, loading, error }] = usePageTypeDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePageTypeDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageTypeDeleteMutation, Types.PageTypeDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageTypeDeleteMutation, Types.PageTypeDeleteMutationVariables>(PageTypeDeleteDocument, options);
      }
export type PageTypeDeleteMutationHookResult = ReturnType<typeof usePageTypeDeleteMutation>;
export type PageTypeDeleteMutationResult = Apollo.MutationResult<Types.PageTypeDeleteMutation>;
export type PageTypeDeleteMutationOptions = Apollo.BaseMutationOptions<Types.PageTypeDeleteMutation, Types.PageTypeDeleteMutationVariables>;
export const PageTypeBulkDeleteDocument = gql`
    mutation PageTypeBulkDelete($ids: [ID!]!) {
  pageTypeBulkDelete(ids: $ids) {
    errors {
      ...PageTypeDeleteErrorFragment
    }
  }
}
    ${PageTypeDeleteErrorFragmentFragmentDoc}`;
export type PageTypeBulkDeleteMutationFn = Apollo.MutationFunction<Types.PageTypeBulkDeleteMutation, Types.PageTypeBulkDeleteMutationVariables>;

/**
 * __usePageTypeBulkDeleteMutation__
 *
 * To run a mutation, you first call `usePageTypeBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageTypeBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageTypeBulkDeleteMutation, { data, loading, error }] = usePageTypeBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function usePageTypeBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageTypeBulkDeleteMutation, Types.PageTypeBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageTypeBulkDeleteMutation, Types.PageTypeBulkDeleteMutationVariables>(PageTypeBulkDeleteDocument, options);
      }
export type PageTypeBulkDeleteMutationHookResult = ReturnType<typeof usePageTypeBulkDeleteMutation>;
export type PageTypeBulkDeleteMutationResult = Apollo.MutationResult<Types.PageTypeBulkDeleteMutation>;
export type PageTypeBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.PageTypeBulkDeleteMutation, Types.PageTypeBulkDeleteMutationVariables>;
export const PageTypeAttributeReorderDocument = gql`
    mutation PageTypeAttributeReorder($move: ReorderInput!, $pageTypeId: ID!) {
  pageTypeReorderAttributes(moves: [$move], pageTypeId: $pageTypeId) {
    errors {
      ...PageError
    }
    pageType {
      ...PageTypeDetails
    }
  }
}
    ${PageErrorFragmentDoc}
${PageTypeDetailsFragmentDoc}`;
export type PageTypeAttributeReorderMutationFn = Apollo.MutationFunction<Types.PageTypeAttributeReorderMutation, Types.PageTypeAttributeReorderMutationVariables>;

/**
 * __usePageTypeAttributeReorderMutation__
 *
 * To run a mutation, you first call `usePageTypeAttributeReorderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageTypeAttributeReorderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageTypeAttributeReorderMutation, { data, loading, error }] = usePageTypeAttributeReorderMutation({
 *   variables: {
 *      move: // value for 'move'
 *      pageTypeId: // value for 'pageTypeId'
 *   },
 * });
 */
export function usePageTypeAttributeReorderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageTypeAttributeReorderMutation, Types.PageTypeAttributeReorderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageTypeAttributeReorderMutation, Types.PageTypeAttributeReorderMutationVariables>(PageTypeAttributeReorderDocument, options);
      }
export type PageTypeAttributeReorderMutationHookResult = ReturnType<typeof usePageTypeAttributeReorderMutation>;
export type PageTypeAttributeReorderMutationResult = Apollo.MutationResult<Types.PageTypeAttributeReorderMutation>;
export type PageTypeAttributeReorderMutationOptions = Apollo.BaseMutationOptions<Types.PageTypeAttributeReorderMutation, Types.PageTypeAttributeReorderMutationVariables>;
export const PageTypeListDocument = gql`
    query PageTypeList($after: String, $before: String, $first: Int, $last: Int, $filter: PageTypeFilterInput, $sort: PageTypeSortingInput) {
  pageTypes(
    after: $after
    before: $before
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        ...PageType
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageTypeFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __usePageTypeListQuery__
 *
 * To run a query within a React component, call `usePageTypeListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageTypeListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageTypeListQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function usePageTypeListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.PageTypeListQuery, Types.PageTypeListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PageTypeListQuery, Types.PageTypeListQueryVariables>(PageTypeListDocument, options);
      }
export function usePageTypeListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PageTypeListQuery, Types.PageTypeListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PageTypeListQuery, Types.PageTypeListQueryVariables>(PageTypeListDocument, options);
        }
export type PageTypeListQueryHookResult = ReturnType<typeof usePageTypeListQuery>;
export type PageTypeListLazyQueryHookResult = ReturnType<typeof usePageTypeListLazyQuery>;
export type PageTypeListQueryResult = Apollo.QueryResult<Types.PageTypeListQuery, Types.PageTypeListQueryVariables>;
export const PageTypeDetailsDocument = gql`
    query PageTypeDetails($id: ID!) {
  pageType(id: $id) {
    ...PageTypeDetails
  }
}
    ${PageTypeDetailsFragmentDoc}`;

/**
 * __usePageTypeDetailsQuery__
 *
 * To run a query within a React component, call `usePageTypeDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageTypeDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageTypeDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePageTypeDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PageTypeDetailsQuery, Types.PageTypeDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PageTypeDetailsQuery, Types.PageTypeDetailsQueryVariables>(PageTypeDetailsDocument, options);
      }
export function usePageTypeDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PageTypeDetailsQuery, Types.PageTypeDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PageTypeDetailsQuery, Types.PageTypeDetailsQueryVariables>(PageTypeDetailsDocument, options);
        }
export type PageTypeDetailsQueryHookResult = ReturnType<typeof usePageTypeDetailsQuery>;
export type PageTypeDetailsLazyQueryHookResult = ReturnType<typeof usePageTypeDetailsLazyQuery>;
export type PageTypeDetailsQueryResult = Apollo.QueryResult<Types.PageTypeDetailsQuery, Types.PageTypeDetailsQueryVariables>;
export const PageCreateDocument = gql`
    mutation PageCreate($input: PageCreateInput!) {
  pageCreate(input: $input) {
    errors {
      ...PageErrorWithAttributes
    }
    page {
      id
    }
  }
}
    ${PageErrorWithAttributesFragmentDoc}`;
export type PageCreateMutationFn = Apollo.MutationFunction<Types.PageCreateMutation, Types.PageCreateMutationVariables>;

/**
 * __usePageCreateMutation__
 *
 * To run a mutation, you first call `usePageCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageCreateMutation, { data, loading, error }] = usePageCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePageCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageCreateMutation, Types.PageCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageCreateMutation, Types.PageCreateMutationVariables>(PageCreateDocument, options);
      }
export type PageCreateMutationHookResult = ReturnType<typeof usePageCreateMutation>;
export type PageCreateMutationResult = Apollo.MutationResult<Types.PageCreateMutation>;
export type PageCreateMutationOptions = Apollo.BaseMutationOptions<Types.PageCreateMutation, Types.PageCreateMutationVariables>;
export const PageUpdateDocument = gql`
    mutation PageUpdate($id: ID!, $input: PageInput!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  pageUpdate(id: $id, input: $input) {
    errors {
      ...PageErrorWithAttributes
    }
    page {
      ...PageDetails
    }
  }
}
    ${PageErrorWithAttributesFragmentDoc}
${PageDetailsFragmentDoc}`;
export type PageUpdateMutationFn = Apollo.MutationFunction<Types.PageUpdateMutation, Types.PageUpdateMutationVariables>;

/**
 * __usePageUpdateMutation__
 *
 * To run a mutation, you first call `usePageUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageUpdateMutation, { data, loading, error }] = usePageUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function usePageUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageUpdateMutation, Types.PageUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageUpdateMutation, Types.PageUpdateMutationVariables>(PageUpdateDocument, options);
      }
export type PageUpdateMutationHookResult = ReturnType<typeof usePageUpdateMutation>;
export type PageUpdateMutationResult = Apollo.MutationResult<Types.PageUpdateMutation>;
export type PageUpdateMutationOptions = Apollo.BaseMutationOptions<Types.PageUpdateMutation, Types.PageUpdateMutationVariables>;
export const PageRemoveDocument = gql`
    mutation PageRemove($id: ID!) {
  pageDelete(id: $id) {
    errors {
      ...PageError
    }
  }
}
    ${PageErrorFragmentDoc}`;
export type PageRemoveMutationFn = Apollo.MutationFunction<Types.PageRemoveMutation, Types.PageRemoveMutationVariables>;

/**
 * __usePageRemoveMutation__
 *
 * To run a mutation, you first call `usePageRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageRemoveMutation, { data, loading, error }] = usePageRemoveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePageRemoveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageRemoveMutation, Types.PageRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageRemoveMutation, Types.PageRemoveMutationVariables>(PageRemoveDocument, options);
      }
export type PageRemoveMutationHookResult = ReturnType<typeof usePageRemoveMutation>;
export type PageRemoveMutationResult = Apollo.MutationResult<Types.PageRemoveMutation>;
export type PageRemoveMutationOptions = Apollo.BaseMutationOptions<Types.PageRemoveMutation, Types.PageRemoveMutationVariables>;
export const PageBulkPublishDocument = gql`
    mutation PageBulkPublish($ids: [ID!]!, $isPublished: Boolean!) {
  pageBulkPublish(ids: $ids, isPublished: $isPublished) {
    errors {
      ...PageBulkPublishErrorFragment
    }
  }
}
    ${PageBulkPublishErrorFragmentFragmentDoc}`;
export type PageBulkPublishMutationFn = Apollo.MutationFunction<Types.PageBulkPublishMutation, Types.PageBulkPublishMutationVariables>;

/**
 * __usePageBulkPublishMutation__
 *
 * To run a mutation, you first call `usePageBulkPublishMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageBulkPublishMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageBulkPublishMutation, { data, loading, error }] = usePageBulkPublishMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *      isPublished: // value for 'isPublished'
 *   },
 * });
 */
export function usePageBulkPublishMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageBulkPublishMutation, Types.PageBulkPublishMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageBulkPublishMutation, Types.PageBulkPublishMutationVariables>(PageBulkPublishDocument, options);
      }
export type PageBulkPublishMutationHookResult = ReturnType<typeof usePageBulkPublishMutation>;
export type PageBulkPublishMutationResult = Apollo.MutationResult<Types.PageBulkPublishMutation>;
export type PageBulkPublishMutationOptions = Apollo.BaseMutationOptions<Types.PageBulkPublishMutation, Types.PageBulkPublishMutationVariables>;
export const PageBulkRemoveDocument = gql`
    mutation PageBulkRemove($ids: [ID!]!) {
  pageBulkDelete(ids: $ids) {
    errors {
      ...PageBulkRemoveErrorFragment
    }
  }
}
    ${PageBulkRemoveErrorFragmentFragmentDoc}`;
export type PageBulkRemoveMutationFn = Apollo.MutationFunction<Types.PageBulkRemoveMutation, Types.PageBulkRemoveMutationVariables>;

/**
 * __usePageBulkRemoveMutation__
 *
 * To run a mutation, you first call `usePageBulkRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePageBulkRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pageBulkRemoveMutation, { data, loading, error }] = usePageBulkRemoveMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function usePageBulkRemoveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PageBulkRemoveMutation, Types.PageBulkRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PageBulkRemoveMutation, Types.PageBulkRemoveMutationVariables>(PageBulkRemoveDocument, options);
      }
export type PageBulkRemoveMutationHookResult = ReturnType<typeof usePageBulkRemoveMutation>;
export type PageBulkRemoveMutationResult = Apollo.MutationResult<Types.PageBulkRemoveMutation>;
export type PageBulkRemoveMutationOptions = Apollo.BaseMutationOptions<Types.PageBulkRemoveMutation, Types.PageBulkRemoveMutationVariables>;
export const PageListDocument = gql`
    query PageList($first: Int, $after: String, $last: Int, $before: String, $sort: PageSortingInput, $filter: PageFilterInput) {
  pages(
    before: $before
    after: $after
    first: $first
    last: $last
    sortBy: $sort
    filter: $filter
  ) {
    edges {
      node {
        ...Page
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
    ${PageFragmentDoc}`;

/**
 * __usePageListQuery__
 *
 * To run a query within a React component, call `usePageListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      sort: // value for 'sort'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function usePageListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.PageListQuery, Types.PageListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PageListQuery, Types.PageListQueryVariables>(PageListDocument, options);
      }
export function usePageListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PageListQuery, Types.PageListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PageListQuery, Types.PageListQueryVariables>(PageListDocument, options);
        }
export type PageListQueryHookResult = ReturnType<typeof usePageListQuery>;
export type PageListLazyQueryHookResult = ReturnType<typeof usePageListLazyQuery>;
export type PageListQueryResult = Apollo.QueryResult<Types.PageListQuery, Types.PageListQueryVariables>;
export const PageDetailsDocument = gql`
    query PageDetails($id: ID!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  page(id: $id) {
    ...PageDetails
  }
}
    ${PageDetailsFragmentDoc}`;

/**
 * __usePageDetailsQuery__
 *
 * To run a query within a React component, call `usePageDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function usePageDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PageDetailsQuery, Types.PageDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PageDetailsQuery, Types.PageDetailsQueryVariables>(PageDetailsDocument, options);
      }
export function usePageDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PageDetailsQuery, Types.PageDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PageDetailsQuery, Types.PageDetailsQueryVariables>(PageDetailsDocument, options);
        }
export type PageDetailsQueryHookResult = ReturnType<typeof usePageDetailsQuery>;
export type PageDetailsLazyQueryHookResult = ReturnType<typeof usePageDetailsLazyQuery>;
export type PageDetailsQueryResult = Apollo.QueryResult<Types.PageDetailsQuery, Types.PageDetailsQueryVariables>;
export const PageTypeDocument = gql`
    query PageType($id: ID!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  pageType(id: $id) {
    id
    name
    attributes {
      ...AttributeDetails
    }
  }
}
    ${AttributeDetailsFragmentDoc}`;

/**
 * __usePageTypeQuery__
 *
 * To run a query within a React component, call `usePageTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageTypeQuery({
 *   variables: {
 *      id: // value for 'id'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function usePageTypeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PageTypeQuery, Types.PageTypeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PageTypeQuery, Types.PageTypeQueryVariables>(PageTypeDocument, options);
      }
export function usePageTypeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PageTypeQuery, Types.PageTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PageTypeQuery, Types.PageTypeQueryVariables>(PageTypeDocument, options);
        }
export type PageTypeQueryHookResult = ReturnType<typeof usePageTypeQuery>;
export type PageTypeLazyQueryHookResult = ReturnType<typeof usePageTypeLazyQuery>;
export type PageTypeQueryResult = Apollo.QueryResult<Types.PageTypeQuery, Types.PageTypeQueryVariables>;
export const PageCountDocument = gql`
    query PageCount($filter: PageFilterInput) {
  pages(filter: $filter) {
    totalCount
  }
}
    `;

/**
 * __usePageCountQuery__
 *
 * To run a query within a React component, call `usePageCountQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageCountQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function usePageCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.PageCountQuery, Types.PageCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PageCountQuery, Types.PageCountQueryVariables>(PageCountDocument, options);
      }
export function usePageCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PageCountQuery, Types.PageCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PageCountQuery, Types.PageCountQueryVariables>(PageCountDocument, options);
        }
export type PageCountQueryHookResult = ReturnType<typeof usePageCountQuery>;
export type PageCountLazyQueryHookResult = ReturnType<typeof usePageCountLazyQuery>;
export type PageCountQueryResult = Apollo.QueryResult<Types.PageCountQuery, Types.PageCountQueryVariables>;
export const ModelsOfTypeDocument = gql`
    query ModelsOfType($pageTypeId: ID!) {
  pages(first: 100, where: {pageType: {eq: $pageTypeId}}) {
    edges {
      node {
        id
        title
      }
    }
  }
}
    `;

/**
 * __useModelsOfTypeQuery__
 *
 * To run a query within a React component, call `useModelsOfTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useModelsOfTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModelsOfTypeQuery({
 *   variables: {
 *      pageTypeId: // value for 'pageTypeId'
 *   },
 * });
 */
export function useModelsOfTypeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ModelsOfTypeQuery, Types.ModelsOfTypeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ModelsOfTypeQuery, Types.ModelsOfTypeQueryVariables>(ModelsOfTypeDocument, options);
      }
export function useModelsOfTypeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ModelsOfTypeQuery, Types.ModelsOfTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ModelsOfTypeQuery, Types.ModelsOfTypeQueryVariables>(ModelsOfTypeDocument, options);
        }
export type ModelsOfTypeQueryHookResult = ReturnType<typeof useModelsOfTypeQuery>;
export type ModelsOfTypeLazyQueryHookResult = ReturnType<typeof useModelsOfTypeLazyQuery>;
export type ModelsOfTypeQueryResult = Apollo.QueryResult<Types.ModelsOfTypeQuery, Types.ModelsOfTypeQueryVariables>;
export const OrderCancelDocument = gql`
    mutation OrderCancel($id: ID!) {
  orderCancel(id: $id) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderCancelMutationFn = Apollo.MutationFunction<Types.OrderCancelMutation, Types.OrderCancelMutationVariables>;

/**
 * __useOrderCancelMutation__
 *
 * To run a mutation, you first call `useOrderCancelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderCancelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderCancelMutation, { data, loading, error }] = useOrderCancelMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderCancelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderCancelMutation, Types.OrderCancelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderCancelMutation, Types.OrderCancelMutationVariables>(OrderCancelDocument, options);
      }
export type OrderCancelMutationHookResult = ReturnType<typeof useOrderCancelMutation>;
export type OrderCancelMutationResult = Apollo.MutationResult<Types.OrderCancelMutation>;
export type OrderCancelMutationOptions = Apollo.BaseMutationOptions<Types.OrderCancelMutation, Types.OrderCancelMutationVariables>;
export const OrderDiscountAddDocument = gql`
    mutation OrderDiscountAdd($input: OrderDiscountCommonInput!, $orderId: ID!) {
  orderDiscountAdd(input: $input, orderId: $orderId) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderDiscountAddMutationFn = Apollo.MutationFunction<Types.OrderDiscountAddMutation, Types.OrderDiscountAddMutationVariables>;

/**
 * __useOrderDiscountAddMutation__
 *
 * To run a mutation, you first call `useOrderDiscountAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderDiscountAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderDiscountAddMutation, { data, loading, error }] = useOrderDiscountAddMutation({
 *   variables: {
 *      input: // value for 'input'
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useOrderDiscountAddMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderDiscountAddMutation, Types.OrderDiscountAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderDiscountAddMutation, Types.OrderDiscountAddMutationVariables>(OrderDiscountAddDocument, options);
      }
export type OrderDiscountAddMutationHookResult = ReturnType<typeof useOrderDiscountAddMutation>;
export type OrderDiscountAddMutationResult = Apollo.MutationResult<Types.OrderDiscountAddMutation>;
export type OrderDiscountAddMutationOptions = Apollo.BaseMutationOptions<Types.OrderDiscountAddMutation, Types.OrderDiscountAddMutationVariables>;
export const OrderDiscountDeleteDocument = gql`
    mutation OrderDiscountDelete($discountId: ID!) {
  orderDiscountDelete(discountId: $discountId) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderDiscountDeleteMutationFn = Apollo.MutationFunction<Types.OrderDiscountDeleteMutation, Types.OrderDiscountDeleteMutationVariables>;

/**
 * __useOrderDiscountDeleteMutation__
 *
 * To run a mutation, you first call `useOrderDiscountDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderDiscountDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderDiscountDeleteMutation, { data, loading, error }] = useOrderDiscountDeleteMutation({
 *   variables: {
 *      discountId: // value for 'discountId'
 *   },
 * });
 */
export function useOrderDiscountDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderDiscountDeleteMutation, Types.OrderDiscountDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderDiscountDeleteMutation, Types.OrderDiscountDeleteMutationVariables>(OrderDiscountDeleteDocument, options);
      }
export type OrderDiscountDeleteMutationHookResult = ReturnType<typeof useOrderDiscountDeleteMutation>;
export type OrderDiscountDeleteMutationResult = Apollo.MutationResult<Types.OrderDiscountDeleteMutation>;
export type OrderDiscountDeleteMutationOptions = Apollo.BaseMutationOptions<Types.OrderDiscountDeleteMutation, Types.OrderDiscountDeleteMutationVariables>;
export const OrderLineDiscountRemoveDocument = gql`
    mutation OrderLineDiscountRemove($orderLineId: ID!) {
  orderLineDiscountRemove(orderLineId: $orderLineId) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderLineDiscountRemoveMutationFn = Apollo.MutationFunction<Types.OrderLineDiscountRemoveMutation, Types.OrderLineDiscountRemoveMutationVariables>;

/**
 * __useOrderLineDiscountRemoveMutation__
 *
 * To run a mutation, you first call `useOrderLineDiscountRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderLineDiscountRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderLineDiscountRemoveMutation, { data, loading, error }] = useOrderLineDiscountRemoveMutation({
 *   variables: {
 *      orderLineId: // value for 'orderLineId'
 *   },
 * });
 */
export function useOrderLineDiscountRemoveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderLineDiscountRemoveMutation, Types.OrderLineDiscountRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderLineDiscountRemoveMutation, Types.OrderLineDiscountRemoveMutationVariables>(OrderLineDiscountRemoveDocument, options);
      }
export type OrderLineDiscountRemoveMutationHookResult = ReturnType<typeof useOrderLineDiscountRemoveMutation>;
export type OrderLineDiscountRemoveMutationResult = Apollo.MutationResult<Types.OrderLineDiscountRemoveMutation>;
export type OrderLineDiscountRemoveMutationOptions = Apollo.BaseMutationOptions<Types.OrderLineDiscountRemoveMutation, Types.OrderLineDiscountRemoveMutationVariables>;
export const OrderLineDiscountUpdateDocument = gql`
    mutation OrderLineDiscountUpdate($input: OrderDiscountCommonInput!, $orderLineId: ID!) {
  orderLineDiscountUpdate(input: $input, orderLineId: $orderLineId) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderLineDiscountUpdateMutationFn = Apollo.MutationFunction<Types.OrderLineDiscountUpdateMutation, Types.OrderLineDiscountUpdateMutationVariables>;

/**
 * __useOrderLineDiscountUpdateMutation__
 *
 * To run a mutation, you first call `useOrderLineDiscountUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderLineDiscountUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderLineDiscountUpdateMutation, { data, loading, error }] = useOrderLineDiscountUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      orderLineId: // value for 'orderLineId'
 *   },
 * });
 */
export function useOrderLineDiscountUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderLineDiscountUpdateMutation, Types.OrderLineDiscountUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderLineDiscountUpdateMutation, Types.OrderLineDiscountUpdateMutationVariables>(OrderLineDiscountUpdateDocument, options);
      }
export type OrderLineDiscountUpdateMutationHookResult = ReturnType<typeof useOrderLineDiscountUpdateMutation>;
export type OrderLineDiscountUpdateMutationResult = Apollo.MutationResult<Types.OrderLineDiscountUpdateMutation>;
export type OrderLineDiscountUpdateMutationOptions = Apollo.BaseMutationOptions<Types.OrderLineDiscountUpdateMutation, Types.OrderLineDiscountUpdateMutationVariables>;
export const OrderDiscountUpdateDocument = gql`
    mutation OrderDiscountUpdate($input: OrderDiscountCommonInput!, $discountId: ID!) {
  orderDiscountUpdate(input: $input, discountId: $discountId) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderDiscountUpdateMutationFn = Apollo.MutationFunction<Types.OrderDiscountUpdateMutation, Types.OrderDiscountUpdateMutationVariables>;

/**
 * __useOrderDiscountUpdateMutation__
 *
 * To run a mutation, you first call `useOrderDiscountUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderDiscountUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderDiscountUpdateMutation, { data, loading, error }] = useOrderDiscountUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      discountId: // value for 'discountId'
 *   },
 * });
 */
export function useOrderDiscountUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderDiscountUpdateMutation, Types.OrderDiscountUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderDiscountUpdateMutation, Types.OrderDiscountUpdateMutationVariables>(OrderDiscountUpdateDocument, options);
      }
export type OrderDiscountUpdateMutationHookResult = ReturnType<typeof useOrderDiscountUpdateMutation>;
export type OrderDiscountUpdateMutationResult = Apollo.MutationResult<Types.OrderDiscountUpdateMutation>;
export type OrderDiscountUpdateMutationOptions = Apollo.BaseMutationOptions<Types.OrderDiscountUpdateMutation, Types.OrderDiscountUpdateMutationVariables>;
export const OrderDraftCancelDocument = gql`
    mutation OrderDraftCancel($id: ID!) {
  draftOrderDelete(id: $id) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderDraftCancelMutationFn = Apollo.MutationFunction<Types.OrderDraftCancelMutation, Types.OrderDraftCancelMutationVariables>;

/**
 * __useOrderDraftCancelMutation__
 *
 * To run a mutation, you first call `useOrderDraftCancelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderDraftCancelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderDraftCancelMutation, { data, loading, error }] = useOrderDraftCancelMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderDraftCancelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderDraftCancelMutation, Types.OrderDraftCancelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderDraftCancelMutation, Types.OrderDraftCancelMutationVariables>(OrderDraftCancelDocument, options);
      }
export type OrderDraftCancelMutationHookResult = ReturnType<typeof useOrderDraftCancelMutation>;
export type OrderDraftCancelMutationResult = Apollo.MutationResult<Types.OrderDraftCancelMutation>;
export type OrderDraftCancelMutationOptions = Apollo.BaseMutationOptions<Types.OrderDraftCancelMutation, Types.OrderDraftCancelMutationVariables>;
export const OrderDraftBulkCancelDocument = gql`
    mutation OrderDraftBulkCancel($ids: [ID!]!) {
  draftOrderBulkDelete(ids: $ids) {
    errors {
      ...OrderError
    }
  }
}
    ${OrderErrorFragmentDoc}`;
export type OrderDraftBulkCancelMutationFn = Apollo.MutationFunction<Types.OrderDraftBulkCancelMutation, Types.OrderDraftBulkCancelMutationVariables>;

/**
 * __useOrderDraftBulkCancelMutation__
 *
 * To run a mutation, you first call `useOrderDraftBulkCancelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderDraftBulkCancelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderDraftBulkCancelMutation, { data, loading, error }] = useOrderDraftBulkCancelMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useOrderDraftBulkCancelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderDraftBulkCancelMutation, Types.OrderDraftBulkCancelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderDraftBulkCancelMutation, Types.OrderDraftBulkCancelMutationVariables>(OrderDraftBulkCancelDocument, options);
      }
export type OrderDraftBulkCancelMutationHookResult = ReturnType<typeof useOrderDraftBulkCancelMutation>;
export type OrderDraftBulkCancelMutationResult = Apollo.MutationResult<Types.OrderDraftBulkCancelMutation>;
export type OrderDraftBulkCancelMutationOptions = Apollo.BaseMutationOptions<Types.OrderDraftBulkCancelMutation, Types.OrderDraftBulkCancelMutationVariables>;
export const OrderConfirmDocument = gql`
    mutation OrderConfirm($id: ID!) {
  orderConfirm(id: $id) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderConfirmMutationFn = Apollo.MutationFunction<Types.OrderConfirmMutation, Types.OrderConfirmMutationVariables>;

/**
 * __useOrderConfirmMutation__
 *
 * To run a mutation, you first call `useOrderConfirmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderConfirmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderConfirmMutation, { data, loading, error }] = useOrderConfirmMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderConfirmMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderConfirmMutation, Types.OrderConfirmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderConfirmMutation, Types.OrderConfirmMutationVariables>(OrderConfirmDocument, options);
      }
export type OrderConfirmMutationHookResult = ReturnType<typeof useOrderConfirmMutation>;
export type OrderConfirmMutationResult = Apollo.MutationResult<Types.OrderConfirmMutation>;
export type OrderConfirmMutationOptions = Apollo.BaseMutationOptions<Types.OrderConfirmMutation, Types.OrderConfirmMutationVariables>;
export const OrderDraftFinalizeDocument = gql`
    mutation OrderDraftFinalize($id: ID!) {
  draftOrderComplete(id: $id) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderDraftFinalizeMutationFn = Apollo.MutationFunction<Types.OrderDraftFinalizeMutation, Types.OrderDraftFinalizeMutationVariables>;

/**
 * __useOrderDraftFinalizeMutation__
 *
 * To run a mutation, you first call `useOrderDraftFinalizeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderDraftFinalizeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderDraftFinalizeMutation, { data, loading, error }] = useOrderDraftFinalizeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderDraftFinalizeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderDraftFinalizeMutation, Types.OrderDraftFinalizeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderDraftFinalizeMutation, Types.OrderDraftFinalizeMutationVariables>(OrderDraftFinalizeDocument, options);
      }
export type OrderDraftFinalizeMutationHookResult = ReturnType<typeof useOrderDraftFinalizeMutation>;
export type OrderDraftFinalizeMutationResult = Apollo.MutationResult<Types.OrderDraftFinalizeMutation>;
export type OrderDraftFinalizeMutationOptions = Apollo.BaseMutationOptions<Types.OrderDraftFinalizeMutation, Types.OrderDraftFinalizeMutationVariables>;
export const FulfillmentReturnProductsDocument = gql`
    mutation FulfillmentReturnProducts($id: ID!, $input: OrderReturnProductsInput!) {
  orderFulfillmentReturnProducts(input: $input, order: $id) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
    replaceOrder {
      id
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type FulfillmentReturnProductsMutationFn = Apollo.MutationFunction<Types.FulfillmentReturnProductsMutation, Types.FulfillmentReturnProductsMutationVariables>;

/**
 * __useFulfillmentReturnProductsMutation__
 *
 * To run a mutation, you first call `useFulfillmentReturnProductsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFulfillmentReturnProductsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fulfillmentReturnProductsMutation, { data, loading, error }] = useFulfillmentReturnProductsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFulfillmentReturnProductsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.FulfillmentReturnProductsMutation, Types.FulfillmentReturnProductsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.FulfillmentReturnProductsMutation, Types.FulfillmentReturnProductsMutationVariables>(FulfillmentReturnProductsDocument, options);
      }
export type FulfillmentReturnProductsMutationHookResult = ReturnType<typeof useFulfillmentReturnProductsMutation>;
export type FulfillmentReturnProductsMutationResult = Apollo.MutationResult<Types.FulfillmentReturnProductsMutation>;
export type FulfillmentReturnProductsMutationOptions = Apollo.BaseMutationOptions<Types.FulfillmentReturnProductsMutation, Types.FulfillmentReturnProductsMutationVariables>;
export const OrderRefundDocument = gql`
    mutation OrderRefund($id: ID!, $amount: PositiveDecimal!) {
  orderRefund(id: $id, amount: $amount) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderRefundMutationFn = Apollo.MutationFunction<Types.OrderRefundMutation, Types.OrderRefundMutationVariables>;

/**
 * __useOrderRefundMutation__
 *
 * To run a mutation, you first call `useOrderRefundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderRefundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderRefundMutation, { data, loading, error }] = useOrderRefundMutation({
 *   variables: {
 *      id: // value for 'id'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useOrderRefundMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderRefundMutation, Types.OrderRefundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderRefundMutation, Types.OrderRefundMutationVariables>(OrderRefundDocument, options);
      }
export type OrderRefundMutationHookResult = ReturnType<typeof useOrderRefundMutation>;
export type OrderRefundMutationResult = Apollo.MutationResult<Types.OrderRefundMutation>;
export type OrderRefundMutationOptions = Apollo.BaseMutationOptions<Types.OrderRefundMutation, Types.OrderRefundMutationVariables>;
export const OrderFulfillmentRefundProductsDocument = gql`
    mutation OrderFulfillmentRefundProducts($input: OrderRefundProductsInput!, $order: ID!) {
  orderFulfillmentRefundProducts(input: $input, order: $order) {
    errors {
      ...OrderError
    }
    fulfillment {
      ...Fulfillment
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${FulfillmentFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderFulfillmentRefundProductsMutationFn = Apollo.MutationFunction<Types.OrderFulfillmentRefundProductsMutation, Types.OrderFulfillmentRefundProductsMutationVariables>;

/**
 * __useOrderFulfillmentRefundProductsMutation__
 *
 * To run a mutation, you first call `useOrderFulfillmentRefundProductsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderFulfillmentRefundProductsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderFulfillmentRefundProductsMutation, { data, loading, error }] = useOrderFulfillmentRefundProductsMutation({
 *   variables: {
 *      input: // value for 'input'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useOrderFulfillmentRefundProductsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderFulfillmentRefundProductsMutation, Types.OrderFulfillmentRefundProductsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderFulfillmentRefundProductsMutation, Types.OrderFulfillmentRefundProductsMutationVariables>(OrderFulfillmentRefundProductsDocument, options);
      }
export type OrderFulfillmentRefundProductsMutationHookResult = ReturnType<typeof useOrderFulfillmentRefundProductsMutation>;
export type OrderFulfillmentRefundProductsMutationResult = Apollo.MutationResult<Types.OrderFulfillmentRefundProductsMutation>;
export type OrderFulfillmentRefundProductsMutationOptions = Apollo.BaseMutationOptions<Types.OrderFulfillmentRefundProductsMutation, Types.OrderFulfillmentRefundProductsMutationVariables>;
export const OrderVoidDocument = gql`
    mutation OrderVoid($id: ID!) {
  orderVoid(id: $id) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderVoidMutationFn = Apollo.MutationFunction<Types.OrderVoidMutation, Types.OrderVoidMutationVariables>;

/**
 * __useOrderVoidMutation__
 *
 * To run a mutation, you first call `useOrderVoidMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderVoidMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderVoidMutation, { data, loading, error }] = useOrderVoidMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderVoidMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderVoidMutation, Types.OrderVoidMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderVoidMutation, Types.OrderVoidMutationVariables>(OrderVoidDocument, options);
      }
export type OrderVoidMutationHookResult = ReturnType<typeof useOrderVoidMutation>;
export type OrderVoidMutationResult = Apollo.MutationResult<Types.OrderVoidMutation>;
export type OrderVoidMutationOptions = Apollo.BaseMutationOptions<Types.OrderVoidMutation, Types.OrderVoidMutationVariables>;
export const OrderMarkAsPaidDocument = gql`
    mutation OrderMarkAsPaid($id: ID!, $transactionReference: String) {
  orderMarkAsPaid(id: $id, transactionReference: $transactionReference) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderMarkAsPaidMutationFn = Apollo.MutationFunction<Types.OrderMarkAsPaidMutation, Types.OrderMarkAsPaidMutationVariables>;

/**
 * __useOrderMarkAsPaidMutation__
 *
 * To run a mutation, you first call `useOrderMarkAsPaidMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderMarkAsPaidMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderMarkAsPaidMutation, { data, loading, error }] = useOrderMarkAsPaidMutation({
 *   variables: {
 *      id: // value for 'id'
 *      transactionReference: // value for 'transactionReference'
 *   },
 * });
 */
export function useOrderMarkAsPaidMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderMarkAsPaidMutation, Types.OrderMarkAsPaidMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderMarkAsPaidMutation, Types.OrderMarkAsPaidMutationVariables>(OrderMarkAsPaidDocument, options);
      }
export type OrderMarkAsPaidMutationHookResult = ReturnType<typeof useOrderMarkAsPaidMutation>;
export type OrderMarkAsPaidMutationResult = Apollo.MutationResult<Types.OrderMarkAsPaidMutation>;
export type OrderMarkAsPaidMutationOptions = Apollo.BaseMutationOptions<Types.OrderMarkAsPaidMutation, Types.OrderMarkAsPaidMutationVariables>;
export const OrderCaptureDocument = gql`
    mutation OrderCapture($id: ID!, $amount: PositiveDecimal!) {
  orderCapture(id: $id, amount: $amount) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderCaptureMutationFn = Apollo.MutationFunction<Types.OrderCaptureMutation, Types.OrderCaptureMutationVariables>;

/**
 * __useOrderCaptureMutation__
 *
 * To run a mutation, you first call `useOrderCaptureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderCaptureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderCaptureMutation, { data, loading, error }] = useOrderCaptureMutation({
 *   variables: {
 *      id: // value for 'id'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useOrderCaptureMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderCaptureMutation, Types.OrderCaptureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderCaptureMutation, Types.OrderCaptureMutationVariables>(OrderCaptureDocument, options);
      }
export type OrderCaptureMutationHookResult = ReturnType<typeof useOrderCaptureMutation>;
export type OrderCaptureMutationResult = Apollo.MutationResult<Types.OrderCaptureMutation>;
export type OrderCaptureMutationOptions = Apollo.BaseMutationOptions<Types.OrderCaptureMutation, Types.OrderCaptureMutationVariables>;
export const OrderFulfillmentUpdateTrackingDocument = gql`
    mutation OrderFulfillmentUpdateTracking($id: ID!, $input: FulfillmentUpdateTrackingInput!) {
  orderFulfillmentUpdateTracking(id: $id, input: $input) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderFulfillmentUpdateTrackingMutationFn = Apollo.MutationFunction<Types.OrderFulfillmentUpdateTrackingMutation, Types.OrderFulfillmentUpdateTrackingMutationVariables>;

/**
 * __useOrderFulfillmentUpdateTrackingMutation__
 *
 * To run a mutation, you first call `useOrderFulfillmentUpdateTrackingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderFulfillmentUpdateTrackingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderFulfillmentUpdateTrackingMutation, { data, loading, error }] = useOrderFulfillmentUpdateTrackingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderFulfillmentUpdateTrackingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderFulfillmentUpdateTrackingMutation, Types.OrderFulfillmentUpdateTrackingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderFulfillmentUpdateTrackingMutation, Types.OrderFulfillmentUpdateTrackingMutationVariables>(OrderFulfillmentUpdateTrackingDocument, options);
      }
export type OrderFulfillmentUpdateTrackingMutationHookResult = ReturnType<typeof useOrderFulfillmentUpdateTrackingMutation>;
export type OrderFulfillmentUpdateTrackingMutationResult = Apollo.MutationResult<Types.OrderFulfillmentUpdateTrackingMutation>;
export type OrderFulfillmentUpdateTrackingMutationOptions = Apollo.BaseMutationOptions<Types.OrderFulfillmentUpdateTrackingMutation, Types.OrderFulfillmentUpdateTrackingMutationVariables>;
export const OrderFulfillmentApproveDocument = gql`
    mutation OrderFulfillmentApprove($id: ID!, $notifyCustomer: Boolean!, $allowStockToBeExceeded: Boolean) {
  orderFulfillmentApprove(
    id: $id
    notifyCustomer: $notifyCustomer
    allowStockToBeExceeded: $allowStockToBeExceeded
  ) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderFulfillmentApproveMutationFn = Apollo.MutationFunction<Types.OrderFulfillmentApproveMutation, Types.OrderFulfillmentApproveMutationVariables>;

/**
 * __useOrderFulfillmentApproveMutation__
 *
 * To run a mutation, you first call `useOrderFulfillmentApproveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderFulfillmentApproveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderFulfillmentApproveMutation, { data, loading, error }] = useOrderFulfillmentApproveMutation({
 *   variables: {
 *      id: // value for 'id'
 *      notifyCustomer: // value for 'notifyCustomer'
 *      allowStockToBeExceeded: // value for 'allowStockToBeExceeded'
 *   },
 * });
 */
export function useOrderFulfillmentApproveMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderFulfillmentApproveMutation, Types.OrderFulfillmentApproveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderFulfillmentApproveMutation, Types.OrderFulfillmentApproveMutationVariables>(OrderFulfillmentApproveDocument, options);
      }
export type OrderFulfillmentApproveMutationHookResult = ReturnType<typeof useOrderFulfillmentApproveMutation>;
export type OrderFulfillmentApproveMutationResult = Apollo.MutationResult<Types.OrderFulfillmentApproveMutation>;
export type OrderFulfillmentApproveMutationOptions = Apollo.BaseMutationOptions<Types.OrderFulfillmentApproveMutation, Types.OrderFulfillmentApproveMutationVariables>;
export const OrderFulfillmentCancelDocument = gql`
    mutation OrderFulfillmentCancel($id: ID!, $input: FulfillmentCancelInput!) {
  orderFulfillmentCancel(id: $id, input: $input) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderFulfillmentCancelMutationFn = Apollo.MutationFunction<Types.OrderFulfillmentCancelMutation, Types.OrderFulfillmentCancelMutationVariables>;

/**
 * __useOrderFulfillmentCancelMutation__
 *
 * To run a mutation, you first call `useOrderFulfillmentCancelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderFulfillmentCancelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderFulfillmentCancelMutation, { data, loading, error }] = useOrderFulfillmentCancelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderFulfillmentCancelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderFulfillmentCancelMutation, Types.OrderFulfillmentCancelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderFulfillmentCancelMutation, Types.OrderFulfillmentCancelMutationVariables>(OrderFulfillmentCancelDocument, options);
      }
export type OrderFulfillmentCancelMutationHookResult = ReturnType<typeof useOrderFulfillmentCancelMutation>;
export type OrderFulfillmentCancelMutationResult = Apollo.MutationResult<Types.OrderFulfillmentCancelMutation>;
export type OrderFulfillmentCancelMutationOptions = Apollo.BaseMutationOptions<Types.OrderFulfillmentCancelMutation, Types.OrderFulfillmentCancelMutationVariables>;
export const OrderNoteAddDocument = gql`
    mutation OrderNoteAdd($order: ID!, $input: OrderNoteInput!) {
  orderNoteAdd(order: $order, input: $input) {
    errors {
      code
      field
      message
    }
    order {
      id
      events {
        ...OrderEvent
      }
    }
  }
}
    ${OrderEventFragmentDoc}`;
export type OrderNoteAddMutationFn = Apollo.MutationFunction<Types.OrderNoteAddMutation, Types.OrderNoteAddMutationVariables>;

/**
 * __useOrderNoteAddMutation__
 *
 * To run a mutation, you first call `useOrderNoteAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderNoteAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderNoteAddMutation, { data, loading, error }] = useOrderNoteAddMutation({
 *   variables: {
 *      order: // value for 'order'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderNoteAddMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderNoteAddMutation, Types.OrderNoteAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderNoteAddMutation, Types.OrderNoteAddMutationVariables>(OrderNoteAddDocument, options);
      }
export type OrderNoteAddMutationHookResult = ReturnType<typeof useOrderNoteAddMutation>;
export type OrderNoteAddMutationResult = Apollo.MutationResult<Types.OrderNoteAddMutation>;
export type OrderNoteAddMutationOptions = Apollo.BaseMutationOptions<Types.OrderNoteAddMutation, Types.OrderNoteAddMutationVariables>;
export const OrderNoteUpdateDocument = gql`
    mutation OrderNoteUpdate($order: ID!, $input: OrderNoteInput!) {
  orderNoteUpdate(note: $order, input: $input) {
    errors {
      code
      field
      message
    }
    order {
      id
      events {
        ...OrderEvent
      }
    }
  }
}
    ${OrderEventFragmentDoc}`;
export type OrderNoteUpdateMutationFn = Apollo.MutationFunction<Types.OrderNoteUpdateMutation, Types.OrderNoteUpdateMutationVariables>;

/**
 * __useOrderNoteUpdateMutation__
 *
 * To run a mutation, you first call `useOrderNoteUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderNoteUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderNoteUpdateMutation, { data, loading, error }] = useOrderNoteUpdateMutation({
 *   variables: {
 *      order: // value for 'order'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderNoteUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderNoteUpdateMutation, Types.OrderNoteUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderNoteUpdateMutation, Types.OrderNoteUpdateMutationVariables>(OrderNoteUpdateDocument, options);
      }
export type OrderNoteUpdateMutationHookResult = ReturnType<typeof useOrderNoteUpdateMutation>;
export type OrderNoteUpdateMutationResult = Apollo.MutationResult<Types.OrderNoteUpdateMutation>;
export type OrderNoteUpdateMutationOptions = Apollo.BaseMutationOptions<Types.OrderNoteUpdateMutation, Types.OrderNoteUpdateMutationVariables>;
export const OrderUpdateDocument = gql`
    mutation OrderUpdate($id: ID!, $input: OrderUpdateInput!) {
  orderUpdate(id: $id, input: $input) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderUpdateMutationFn = Apollo.MutationFunction<Types.OrderUpdateMutation, Types.OrderUpdateMutationVariables>;

/**
 * __useOrderUpdateMutation__
 *
 * To run a mutation, you first call `useOrderUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderUpdateMutation, { data, loading, error }] = useOrderUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderUpdateMutation, Types.OrderUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderUpdateMutation, Types.OrderUpdateMutationVariables>(OrderUpdateDocument, options);
      }
export type OrderUpdateMutationHookResult = ReturnType<typeof useOrderUpdateMutation>;
export type OrderUpdateMutationResult = Apollo.MutationResult<Types.OrderUpdateMutation>;
export type OrderUpdateMutationOptions = Apollo.BaseMutationOptions<Types.OrderUpdateMutation, Types.OrderUpdateMutationVariables>;
export const OrderDraftUpdateDocument = gql`
    mutation OrderDraftUpdate($id: ID!, $input: DraftOrderInput!) {
  draftOrderUpdate(id: $id, input: $input) {
    errors {
      ...OrderError
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderDraftUpdateMutationFn = Apollo.MutationFunction<Types.OrderDraftUpdateMutation, Types.OrderDraftUpdateMutationVariables>;

/**
 * __useOrderDraftUpdateMutation__
 *
 * To run a mutation, you first call `useOrderDraftUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderDraftUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderDraftUpdateMutation, { data, loading, error }] = useOrderDraftUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderDraftUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderDraftUpdateMutation, Types.OrderDraftUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderDraftUpdateMutation, Types.OrderDraftUpdateMutationVariables>(OrderDraftUpdateDocument, options);
      }
export type OrderDraftUpdateMutationHookResult = ReturnType<typeof useOrderDraftUpdateMutation>;
export type OrderDraftUpdateMutationResult = Apollo.MutationResult<Types.OrderDraftUpdateMutation>;
export type OrderDraftUpdateMutationOptions = Apollo.BaseMutationOptions<Types.OrderDraftUpdateMutation, Types.OrderDraftUpdateMutationVariables>;
export const OrderShippingMethodUpdateDocument = gql`
    mutation OrderShippingMethodUpdate($id: ID!, $input: OrderUpdateShippingInput!) {
  orderUpdateShipping(order: $id, input: $input) {
    errors {
      ...OrderError
    }
    order {
      shippingMethods {
        id
        name
      }
      total {
        tax {
          amount
          currency
        }
        gross {
          amount
          currency
        }
      }
      id
      shippingMethod {
        id
        name
        price {
          amount
          currency
        }
      }
      shippingMethodName
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderShippingMethodUpdateMutationFn = Apollo.MutationFunction<Types.OrderShippingMethodUpdateMutation, Types.OrderShippingMethodUpdateMutationVariables>;

/**
 * __useOrderShippingMethodUpdateMutation__
 *
 * To run a mutation, you first call `useOrderShippingMethodUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderShippingMethodUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderShippingMethodUpdateMutation, { data, loading, error }] = useOrderShippingMethodUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderShippingMethodUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderShippingMethodUpdateMutation, Types.OrderShippingMethodUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderShippingMethodUpdateMutation, Types.OrderShippingMethodUpdateMutationVariables>(OrderShippingMethodUpdateDocument, options);
      }
export type OrderShippingMethodUpdateMutationHookResult = ReturnType<typeof useOrderShippingMethodUpdateMutation>;
export type OrderShippingMethodUpdateMutationResult = Apollo.MutationResult<Types.OrderShippingMethodUpdateMutation>;
export type OrderShippingMethodUpdateMutationOptions = Apollo.BaseMutationOptions<Types.OrderShippingMethodUpdateMutation, Types.OrderShippingMethodUpdateMutationVariables>;
export const OrderDraftCreateDocument = gql`
    mutation OrderDraftCreate($input: DraftOrderCreateInput!) {
  draftOrderCreate(input: $input) {
    errors {
      ...OrderError
    }
    order {
      id
    }
  }
}
    ${OrderErrorFragmentDoc}`;
export type OrderDraftCreateMutationFn = Apollo.MutationFunction<Types.OrderDraftCreateMutation, Types.OrderDraftCreateMutationVariables>;

/**
 * __useOrderDraftCreateMutation__
 *
 * To run a mutation, you first call `useOrderDraftCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderDraftCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderDraftCreateMutation, { data, loading, error }] = useOrderDraftCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderDraftCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderDraftCreateMutation, Types.OrderDraftCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderDraftCreateMutation, Types.OrderDraftCreateMutationVariables>(OrderDraftCreateDocument, options);
      }
export type OrderDraftCreateMutationHookResult = ReturnType<typeof useOrderDraftCreateMutation>;
export type OrderDraftCreateMutationResult = Apollo.MutationResult<Types.OrderDraftCreateMutation>;
export type OrderDraftCreateMutationOptions = Apollo.BaseMutationOptions<Types.OrderDraftCreateMutation, Types.OrderDraftCreateMutationVariables>;
export const OrderLineDeleteDocument = gql`
    mutation OrderLineDelete($id: ID!) {
  orderLineDelete(id: $id) {
    errors {
      ...OrderError
    }
    order {
      id
      lines {
        ...OrderLine
      }
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderLineFragmentDoc}`;
export type OrderLineDeleteMutationFn = Apollo.MutationFunction<Types.OrderLineDeleteMutation, Types.OrderLineDeleteMutationVariables>;

/**
 * __useOrderLineDeleteMutation__
 *
 * To run a mutation, you first call `useOrderLineDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderLineDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderLineDeleteMutation, { data, loading, error }] = useOrderLineDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderLineDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderLineDeleteMutation, Types.OrderLineDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderLineDeleteMutation, Types.OrderLineDeleteMutationVariables>(OrderLineDeleteDocument, options);
      }
export type OrderLineDeleteMutationHookResult = ReturnType<typeof useOrderLineDeleteMutation>;
export type OrderLineDeleteMutationResult = Apollo.MutationResult<Types.OrderLineDeleteMutation>;
export type OrderLineDeleteMutationOptions = Apollo.BaseMutationOptions<Types.OrderLineDeleteMutation, Types.OrderLineDeleteMutationVariables>;
export const OrderLinesAddDocument = gql`
    mutation OrderLinesAdd($id: ID!, $input: [OrderLineCreateInput!]!) {
  orderLinesCreate(id: $id, input: $input) {
    errors {
      ...OrderError
    }
    order {
      id
      lines {
        ...OrderLine
      }
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderLineFragmentDoc}`;
export type OrderLinesAddMutationFn = Apollo.MutationFunction<Types.OrderLinesAddMutation, Types.OrderLinesAddMutationVariables>;

/**
 * __useOrderLinesAddMutation__
 *
 * To run a mutation, you first call `useOrderLinesAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderLinesAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderLinesAddMutation, { data, loading, error }] = useOrderLinesAddMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderLinesAddMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderLinesAddMutation, Types.OrderLinesAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderLinesAddMutation, Types.OrderLinesAddMutationVariables>(OrderLinesAddDocument, options);
      }
export type OrderLinesAddMutationHookResult = ReturnType<typeof useOrderLinesAddMutation>;
export type OrderLinesAddMutationResult = Apollo.MutationResult<Types.OrderLinesAddMutation>;
export type OrderLinesAddMutationOptions = Apollo.BaseMutationOptions<Types.OrderLinesAddMutation, Types.OrderLinesAddMutationVariables>;
export const OrderLineUpdateDocument = gql`
    mutation OrderLineUpdate($id: ID!, $input: OrderLineInput!) {
  orderLineUpdate(id: $id, input: $input) {
    errors {
      ...OrderError
    }
    orderLine {
      ...OrderLine
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderLineFragmentDoc}`;
export type OrderLineUpdateMutationFn = Apollo.MutationFunction<Types.OrderLineUpdateMutation, Types.OrderLineUpdateMutationVariables>;

/**
 * __useOrderLineUpdateMutation__
 *
 * To run a mutation, you first call `useOrderLineUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderLineUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderLineUpdateMutation, { data, loading, error }] = useOrderLineUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrderLineUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderLineUpdateMutation, Types.OrderLineUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderLineUpdateMutation, Types.OrderLineUpdateMutationVariables>(OrderLineUpdateDocument, options);
      }
export type OrderLineUpdateMutationHookResult = ReturnType<typeof useOrderLineUpdateMutation>;
export type OrderLineUpdateMutationResult = Apollo.MutationResult<Types.OrderLineUpdateMutation>;
export type OrderLineUpdateMutationOptions = Apollo.BaseMutationOptions<Types.OrderLineUpdateMutation, Types.OrderLineUpdateMutationVariables>;
export const FulfillOrderDocument = gql`
    mutation FulfillOrder($orderId: ID!, $input: OrderFulfillInput!) {
  orderFulfill(order: $orderId, input: $input) {
    errors {
      ...OrderError
      warehouse
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type FulfillOrderMutationFn = Apollo.MutationFunction<Types.FulfillOrderMutation, Types.FulfillOrderMutationVariables>;

/**
 * __useFulfillOrderMutation__
 *
 * To run a mutation, you first call `useFulfillOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFulfillOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fulfillOrderMutation, { data, loading, error }] = useFulfillOrderMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFulfillOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.FulfillOrderMutation, Types.FulfillOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.FulfillOrderMutation, Types.FulfillOrderMutationVariables>(FulfillOrderDocument, options);
      }
export type FulfillOrderMutationHookResult = ReturnType<typeof useFulfillOrderMutation>;
export type FulfillOrderMutationResult = Apollo.MutationResult<Types.FulfillOrderMutation>;
export type FulfillOrderMutationOptions = Apollo.BaseMutationOptions<Types.FulfillOrderMutation, Types.FulfillOrderMutationVariables>;
export const InvoiceRequestDocument = gql`
    mutation InvoiceRequest($orderId: ID!) {
  invoiceRequest(orderId: $orderId) {
    errors {
      ...InvoiceError
    }
    invoice {
      ...Invoice
    }
    order {
      id
      invoices {
        ...Invoice
      }
    }
  }
}
    ${InvoiceErrorFragmentDoc}
${InvoiceFragmentDoc}`;
export type InvoiceRequestMutationFn = Apollo.MutationFunction<Types.InvoiceRequestMutation, Types.InvoiceRequestMutationVariables>;

/**
 * __useInvoiceRequestMutation__
 *
 * To run a mutation, you first call `useInvoiceRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvoiceRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invoiceRequestMutation, { data, loading, error }] = useInvoiceRequestMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useInvoiceRequestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.InvoiceRequestMutation, Types.InvoiceRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.InvoiceRequestMutation, Types.InvoiceRequestMutationVariables>(InvoiceRequestDocument, options);
      }
export type InvoiceRequestMutationHookResult = ReturnType<typeof useInvoiceRequestMutation>;
export type InvoiceRequestMutationResult = Apollo.MutationResult<Types.InvoiceRequestMutation>;
export type InvoiceRequestMutationOptions = Apollo.BaseMutationOptions<Types.InvoiceRequestMutation, Types.InvoiceRequestMutationVariables>;
export const InvoiceEmailSendDocument = gql`
    mutation InvoiceEmailSend($id: ID!) {
  invoiceSendNotification(id: $id) {
    errors {
      ...InvoiceError
    }
    invoice {
      ...Invoice
    }
  }
}
    ${InvoiceErrorFragmentDoc}
${InvoiceFragmentDoc}`;
export type InvoiceEmailSendMutationFn = Apollo.MutationFunction<Types.InvoiceEmailSendMutation, Types.InvoiceEmailSendMutationVariables>;

/**
 * __useInvoiceEmailSendMutation__
 *
 * To run a mutation, you first call `useInvoiceEmailSendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvoiceEmailSendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invoiceEmailSendMutation, { data, loading, error }] = useInvoiceEmailSendMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useInvoiceEmailSendMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.InvoiceEmailSendMutation, Types.InvoiceEmailSendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.InvoiceEmailSendMutation, Types.InvoiceEmailSendMutationVariables>(InvoiceEmailSendDocument, options);
      }
export type InvoiceEmailSendMutationHookResult = ReturnType<typeof useInvoiceEmailSendMutation>;
export type InvoiceEmailSendMutationResult = Apollo.MutationResult<Types.InvoiceEmailSendMutation>;
export type InvoiceEmailSendMutationOptions = Apollo.BaseMutationOptions<Types.InvoiceEmailSendMutation, Types.InvoiceEmailSendMutationVariables>;
export const OrderSettingsUpdateDocument = gql`
    mutation OrderSettingsUpdate($orderSettingsInput: OrderSettingsUpdateInput!, $shopSettingsInput: ShopSettingsInput!) {
  orderSettingsUpdate(input: $orderSettingsInput) {
    errors {
      ...OrderSettingsError
    }
    orderSettings {
      ...OrderSettings
    }
  }
  shopSettingsUpdate(input: $shopSettingsInput) {
    errors {
      ...ShopError
    }
    shop {
      ...ShopOrderSettings
    }
  }
}
    ${OrderSettingsErrorFragmentDoc}
${OrderSettingsFragmentDoc}
${ShopErrorFragmentDoc}
${ShopOrderSettingsFragmentDoc}`;
export type OrderSettingsUpdateMutationFn = Apollo.MutationFunction<Types.OrderSettingsUpdateMutation, Types.OrderSettingsUpdateMutationVariables>;

/**
 * __useOrderSettingsUpdateMutation__
 *
 * To run a mutation, you first call `useOrderSettingsUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderSettingsUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderSettingsUpdateMutation, { data, loading, error }] = useOrderSettingsUpdateMutation({
 *   variables: {
 *      orderSettingsInput: // value for 'orderSettingsInput'
 *      shopSettingsInput: // value for 'shopSettingsInput'
 *   },
 * });
 */
export function useOrderSettingsUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderSettingsUpdateMutation, Types.OrderSettingsUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderSettingsUpdateMutation, Types.OrderSettingsUpdateMutationVariables>(OrderSettingsUpdateDocument, options);
      }
export type OrderSettingsUpdateMutationHookResult = ReturnType<typeof useOrderSettingsUpdateMutation>;
export type OrderSettingsUpdateMutationResult = Apollo.MutationResult<Types.OrderSettingsUpdateMutation>;
export type OrderSettingsUpdateMutationOptions = Apollo.BaseMutationOptions<Types.OrderSettingsUpdateMutation, Types.OrderSettingsUpdateMutationVariables>;
export const OrderTransactionRequestActionDocument = gql`
    mutation OrderTransactionRequestAction($action: TransactionActionEnum!, $transactionId: ID!, $amount: PositiveDecimal, $reason: String, $reasonReferenceId: ID) {
  transactionRequestAction(
    actionType: $action
    id: $transactionId
    amount: $amount
    refundReason: $reason
    refundReasonReference: $reasonReferenceId
  ) {
    errors {
      ...TransactionRequestActionError
    }
  }
}
    ${TransactionRequestActionErrorFragmentDoc}`;
export type OrderTransactionRequestActionMutationFn = Apollo.MutationFunction<Types.OrderTransactionRequestActionMutation, Types.OrderTransactionRequestActionMutationVariables>;

/**
 * __useOrderTransactionRequestActionMutation__
 *
 * To run a mutation, you first call `useOrderTransactionRequestActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderTransactionRequestActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderTransactionRequestActionMutation, { data, loading, error }] = useOrderTransactionRequestActionMutation({
 *   variables: {
 *      action: // value for 'action'
 *      transactionId: // value for 'transactionId'
 *      amount: // value for 'amount'
 *      reason: // value for 'reason'
 *      reasonReferenceId: // value for 'reasonReferenceId'
 *   },
 * });
 */
export function useOrderTransactionRequestActionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderTransactionRequestActionMutation, Types.OrderTransactionRequestActionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderTransactionRequestActionMutation, Types.OrderTransactionRequestActionMutationVariables>(OrderTransactionRequestActionDocument, options);
      }
export type OrderTransactionRequestActionMutationHookResult = ReturnType<typeof useOrderTransactionRequestActionMutation>;
export type OrderTransactionRequestActionMutationResult = Apollo.MutationResult<Types.OrderTransactionRequestActionMutation>;
export type OrderTransactionRequestActionMutationOptions = Apollo.BaseMutationOptions<Types.OrderTransactionRequestActionMutation, Types.OrderTransactionRequestActionMutationVariables>;
export const OrderGrantRefundAddDocument = gql`
    mutation OrderGrantRefundAdd($orderId: ID!, $amount: Decimal, $reason: String, $reasonReferenceId: ID, $lines: [OrderGrantRefundCreateLineInput!], $grantRefundForShipping: Boolean, $transactionId: ID!) {
  orderGrantRefundCreate(
    id: $orderId
    input: {amount: $amount, reason: $reason, lines: $lines, grantRefundForShipping: $grantRefundForShipping, transactionId: $transactionId, reasonReference: $reasonReferenceId}
  ) {
    errors {
      ...OrderGrantRefundCreateError
    }
    grantedRefund {
      id
    }
  }
}
    ${OrderGrantRefundCreateErrorFragmentDoc}`;
export type OrderGrantRefundAddMutationFn = Apollo.MutationFunction<Types.OrderGrantRefundAddMutation, Types.OrderGrantRefundAddMutationVariables>;

/**
 * __useOrderGrantRefundAddMutation__
 *
 * To run a mutation, you first call `useOrderGrantRefundAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderGrantRefundAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderGrantRefundAddMutation, { data, loading, error }] = useOrderGrantRefundAddMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      amount: // value for 'amount'
 *      reason: // value for 'reason'
 *      reasonReferenceId: // value for 'reasonReferenceId'
 *      lines: // value for 'lines'
 *      grantRefundForShipping: // value for 'grantRefundForShipping'
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function useOrderGrantRefundAddMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderGrantRefundAddMutation, Types.OrderGrantRefundAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderGrantRefundAddMutation, Types.OrderGrantRefundAddMutationVariables>(OrderGrantRefundAddDocument, options);
      }
export type OrderGrantRefundAddMutationHookResult = ReturnType<typeof useOrderGrantRefundAddMutation>;
export type OrderGrantRefundAddMutationResult = Apollo.MutationResult<Types.OrderGrantRefundAddMutation>;
export type OrderGrantRefundAddMutationOptions = Apollo.BaseMutationOptions<Types.OrderGrantRefundAddMutation, Types.OrderGrantRefundAddMutationVariables>;
export const OrderGrantRefundAddWithOrderDocument = gql`
    mutation OrderGrantRefundAddWithOrder($orderId: ID!, $amount: Decimal, $reason: String, $lines: [OrderGrantRefundCreateLineInput!], $grantRefundForShipping: Boolean, $transactionId: ID!) {
  orderGrantRefundCreate(
    id: $orderId
    input: {amount: $amount, reason: $reason, lines: $lines, grantRefundForShipping: $grantRefundForShipping, transactionId: $transactionId}
  ) {
    errors {
      ...OrderGrantRefundCreateError
    }
    grantedRefund {
      id
    }
    order {
      ...OrderDetails
    }
  }
}
    ${OrderGrantRefundCreateErrorFragmentDoc}
${OrderDetailsFragmentDoc}`;
export type OrderGrantRefundAddWithOrderMutationFn = Apollo.MutationFunction<Types.OrderGrantRefundAddWithOrderMutation, Types.OrderGrantRefundAddWithOrderMutationVariables>;

/**
 * __useOrderGrantRefundAddWithOrderMutation__
 *
 * To run a mutation, you first call `useOrderGrantRefundAddWithOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderGrantRefundAddWithOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderGrantRefundAddWithOrderMutation, { data, loading, error }] = useOrderGrantRefundAddWithOrderMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      amount: // value for 'amount'
 *      reason: // value for 'reason'
 *      lines: // value for 'lines'
 *      grantRefundForShipping: // value for 'grantRefundForShipping'
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function useOrderGrantRefundAddWithOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderGrantRefundAddWithOrderMutation, Types.OrderGrantRefundAddWithOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderGrantRefundAddWithOrderMutation, Types.OrderGrantRefundAddWithOrderMutationVariables>(OrderGrantRefundAddWithOrderDocument, options);
      }
export type OrderGrantRefundAddWithOrderMutationHookResult = ReturnType<typeof useOrderGrantRefundAddWithOrderMutation>;
export type OrderGrantRefundAddWithOrderMutationResult = Apollo.MutationResult<Types.OrderGrantRefundAddWithOrderMutation>;
export type OrderGrantRefundAddWithOrderMutationOptions = Apollo.BaseMutationOptions<Types.OrderGrantRefundAddWithOrderMutation, Types.OrderGrantRefundAddWithOrderMutationVariables>;
export const OrderGrantRefundEditDocument = gql`
    mutation OrderGrantRefundEdit($refundId: ID!, $amount: Decimal, $reason: String, $addLines: [OrderGrantRefundUpdateLineAddInput!], $removeLines: [ID!], $grantRefundForShipping: Boolean, $transactionId: ID, $reasonReferenceId: ID) {
  orderGrantRefundUpdate(
    id: $refundId
    input: {amount: $amount, reason: $reason, addLines: $addLines, removeLines: $removeLines, grantRefundForShipping: $grantRefundForShipping, transactionId: $transactionId, reasonReference: $reasonReferenceId}
  ) {
    errors {
      ...OrderGrantRefundUpdateError
    }
    order {
      ...OrderDetailsGrantRefund
    }
  }
}
    ${OrderGrantRefundUpdateErrorFragmentDoc}
${OrderDetailsGrantRefundFragmentDoc}`;
export type OrderGrantRefundEditMutationFn = Apollo.MutationFunction<Types.OrderGrantRefundEditMutation, Types.OrderGrantRefundEditMutationVariables>;

/**
 * __useOrderGrantRefundEditMutation__
 *
 * To run a mutation, you first call `useOrderGrantRefundEditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderGrantRefundEditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderGrantRefundEditMutation, { data, loading, error }] = useOrderGrantRefundEditMutation({
 *   variables: {
 *      refundId: // value for 'refundId'
 *      amount: // value for 'amount'
 *      reason: // value for 'reason'
 *      addLines: // value for 'addLines'
 *      removeLines: // value for 'removeLines'
 *      grantRefundForShipping: // value for 'grantRefundForShipping'
 *      transactionId: // value for 'transactionId'
 *      reasonReferenceId: // value for 'reasonReferenceId'
 *   },
 * });
 */
export function useOrderGrantRefundEditMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderGrantRefundEditMutation, Types.OrderGrantRefundEditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderGrantRefundEditMutation, Types.OrderGrantRefundEditMutationVariables>(OrderGrantRefundEditDocument, options);
      }
export type OrderGrantRefundEditMutationHookResult = ReturnType<typeof useOrderGrantRefundEditMutation>;
export type OrderGrantRefundEditMutationResult = Apollo.MutationResult<Types.OrderGrantRefundEditMutation>;
export type OrderGrantRefundEditMutationOptions = Apollo.BaseMutationOptions<Types.OrderGrantRefundEditMutation, Types.OrderGrantRefundEditMutationVariables>;
export const OrderSendRefundDocument = gql`
    mutation OrderSendRefund($amount: PositiveDecimal!, $transactionId: ID!) {
  transactionRequestAction(
    actionType: REFUND
    amount: $amount
    id: $transactionId
  ) {
    transaction {
      ...TransactionItem
    }
    errors {
      ...TransactionRequestActionError
    }
  }
}
    ${TransactionItemFragmentDoc}
${TransactionRequestActionErrorFragmentDoc}`;
export type OrderSendRefundMutationFn = Apollo.MutationFunction<Types.OrderSendRefundMutation, Types.OrderSendRefundMutationVariables>;

/**
 * __useOrderSendRefundMutation__
 *
 * To run a mutation, you first call `useOrderSendRefundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderSendRefundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderSendRefundMutation, { data, loading, error }] = useOrderSendRefundMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function useOrderSendRefundMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderSendRefundMutation, Types.OrderSendRefundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderSendRefundMutation, Types.OrderSendRefundMutationVariables>(OrderSendRefundDocument, options);
      }
export type OrderSendRefundMutationHookResult = ReturnType<typeof useOrderSendRefundMutation>;
export type OrderSendRefundMutationResult = Apollo.MutationResult<Types.OrderSendRefundMutation>;
export type OrderSendRefundMutationOptions = Apollo.BaseMutationOptions<Types.OrderSendRefundMutation, Types.OrderSendRefundMutationVariables>;
export const OrderSendRefundForGrantedRefundDocument = gql`
    mutation OrderSendRefundForGrantedRefund($grantedRefundId: ID!, $transactionId: ID!) {
  transactionRequestRefundForGrantedRefund(
    grantedRefundId: $grantedRefundId
    id: $transactionId
  ) {
    transaction {
      ...TransactionItem
    }
    errors {
      ...TransactionRequestRefundForGrantedRefundError
    }
  }
}
    ${TransactionItemFragmentDoc}
${TransactionRequestRefundForGrantedRefundErrorFragmentDoc}`;
export type OrderSendRefundForGrantedRefundMutationFn = Apollo.MutationFunction<Types.OrderSendRefundForGrantedRefundMutation, Types.OrderSendRefundForGrantedRefundMutationVariables>;

/**
 * __useOrderSendRefundForGrantedRefundMutation__
 *
 * To run a mutation, you first call `useOrderSendRefundForGrantedRefundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderSendRefundForGrantedRefundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderSendRefundForGrantedRefundMutation, { data, loading, error }] = useOrderSendRefundForGrantedRefundMutation({
 *   variables: {
 *      grantedRefundId: // value for 'grantedRefundId'
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function useOrderSendRefundForGrantedRefundMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.OrderSendRefundForGrantedRefundMutation, Types.OrderSendRefundForGrantedRefundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.OrderSendRefundForGrantedRefundMutation, Types.OrderSendRefundForGrantedRefundMutationVariables>(OrderSendRefundForGrantedRefundDocument, options);
      }
export type OrderSendRefundForGrantedRefundMutationHookResult = ReturnType<typeof useOrderSendRefundForGrantedRefundMutation>;
export type OrderSendRefundForGrantedRefundMutationResult = Apollo.MutationResult<Types.OrderSendRefundForGrantedRefundMutation>;
export type OrderSendRefundForGrantedRefundMutationOptions = Apollo.BaseMutationOptions<Types.OrderSendRefundForGrantedRefundMutation, Types.OrderSendRefundForGrantedRefundMutationVariables>;
export const CreateManualTransactionCaptureDocument = gql`
    mutation CreateManualTransactionCapture($orderId: ID!, $amount: PositiveDecimal!, $currency: String!, $description: String, $pspReference: String) {
  transactionCreate(
    id: $orderId
    transaction: {name: "Manual capture", pspReference: $pspReference, amountCharged: {amount: $amount, currency: $currency}}
    transactionEvent: {pspReference: $pspReference, message: $description}
  ) {
    transaction {
      ...TransactionItem
    }
    errors {
      ...TransactionCreateError
    }
  }
}
    ${TransactionItemFragmentDoc}
${TransactionCreateErrorFragmentDoc}`;
export type CreateManualTransactionCaptureMutationFn = Apollo.MutationFunction<Types.CreateManualTransactionCaptureMutation, Types.CreateManualTransactionCaptureMutationVariables>;

/**
 * __useCreateManualTransactionCaptureMutation__
 *
 * To run a mutation, you first call `useCreateManualTransactionCaptureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateManualTransactionCaptureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createManualTransactionCaptureMutation, { data, loading, error }] = useCreateManualTransactionCaptureMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      amount: // value for 'amount'
 *      currency: // value for 'currency'
 *      description: // value for 'description'
 *      pspReference: // value for 'pspReference'
 *   },
 * });
 */
export function useCreateManualTransactionCaptureMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CreateManualTransactionCaptureMutation, Types.CreateManualTransactionCaptureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CreateManualTransactionCaptureMutation, Types.CreateManualTransactionCaptureMutationVariables>(CreateManualTransactionCaptureDocument, options);
      }
export type CreateManualTransactionCaptureMutationHookResult = ReturnType<typeof useCreateManualTransactionCaptureMutation>;
export type CreateManualTransactionCaptureMutationResult = Apollo.MutationResult<Types.CreateManualTransactionCaptureMutation>;
export type CreateManualTransactionCaptureMutationOptions = Apollo.BaseMutationOptions<Types.CreateManualTransactionCaptureMutation, Types.CreateManualTransactionCaptureMutationVariables>;
export const CreateManualTransactionRefundDocument = gql`
    mutation CreateManualTransactionRefund($orderId: ID!, $amount: PositiveDecimal!, $currency: String!, $description: String, $pspReference: String) {
  transactionCreate(
    id: $orderId
    transaction: {name: "Manual refund", pspReference: $pspReference, amountRefunded: {amount: $amount, currency: $currency}}
    transactionEvent: {pspReference: $pspReference, message: $description}
  ) {
    transaction {
      ...TransactionItem
    }
    errors {
      ...TransactionCreateError
    }
  }
}
    ${TransactionItemFragmentDoc}
${TransactionCreateErrorFragmentDoc}`;
export type CreateManualTransactionRefundMutationFn = Apollo.MutationFunction<Types.CreateManualTransactionRefundMutation, Types.CreateManualTransactionRefundMutationVariables>;

/**
 * __useCreateManualTransactionRefundMutation__
 *
 * To run a mutation, you first call `useCreateManualTransactionRefundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateManualTransactionRefundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createManualTransactionRefundMutation, { data, loading, error }] = useCreateManualTransactionRefundMutation({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      amount: // value for 'amount'
 *      currency: // value for 'currency'
 *      description: // value for 'description'
 *      pspReference: // value for 'pspReference'
 *   },
 * });
 */
export function useCreateManualTransactionRefundMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CreateManualTransactionRefundMutation, Types.CreateManualTransactionRefundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CreateManualTransactionRefundMutation, Types.CreateManualTransactionRefundMutationVariables>(CreateManualTransactionRefundDocument, options);
      }
export type CreateManualTransactionRefundMutationHookResult = ReturnType<typeof useCreateManualTransactionRefundMutation>;
export type CreateManualTransactionRefundMutationResult = Apollo.MutationResult<Types.CreateManualTransactionRefundMutation>;
export type CreateManualTransactionRefundMutationOptions = Apollo.BaseMutationOptions<Types.CreateManualTransactionRefundMutation, Types.CreateManualTransactionRefundMutationVariables>;
export const OrderListDocument = gql`
    query OrderList($first: Int, $after: String, $last: Int, $before: String, $where: OrderWhereInput, $search: String, $sort: OrderSortingInput) {
  orders(
    before: $before
    after: $after
    first: $first
    last: $last
    where: $where
    search: $search
    sortBy: $sort
  ) {
    edges {
      node {
        __typename
        billingAddress {
          ...Address
        }
        channel {
          name
          id
        }
        created
        id
        number
        paymentStatus
        status
        total {
          __typename
          gross {
            __typename
            amount
            currency
          }
        }
        userEmail
        chargeStatus
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
    ${AddressFragmentDoc}`;

/**
 * __useOrderListQuery__
 *
 * To run a query within a React component, call `useOrderListQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      where: // value for 'where'
 *      search: // value for 'search'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useOrderListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.OrderListQuery, Types.OrderListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderListQuery, Types.OrderListQueryVariables>(OrderListDocument, options);
      }
export function useOrderListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderListQuery, Types.OrderListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderListQuery, Types.OrderListQueryVariables>(OrderListDocument, options);
        }
export type OrderListQueryHookResult = ReturnType<typeof useOrderListQuery>;
export type OrderListLazyQueryHookResult = ReturnType<typeof useOrderListLazyQuery>;
export type OrderListQueryResult = Apollo.QueryResult<Types.OrderListQuery, Types.OrderListQueryVariables>;
export const OrderDraftListDocument = gql`
    query OrderDraftList($first: Int, $after: String, $last: Int, $before: String, $filter: OrderDraftFilterInput, $sort: OrderSortingInput) {
  draftOrders(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        __typename
        billingAddress {
          ...Address
        }
        created
        channel {
          name
          id
        }
        id
        number
        paymentStatus
        status
        total {
          __typename
          gross {
            __typename
            amount
            currency
          }
        }
        userEmail
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
    ${AddressFragmentDoc}`;

/**
 * __useOrderDraftListQuery__
 *
 * To run a query within a React component, call `useOrderDraftListQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDraftListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDraftListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useOrderDraftListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.OrderDraftListQuery, Types.OrderDraftListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderDraftListQuery, Types.OrderDraftListQueryVariables>(OrderDraftListDocument, options);
      }
export function useOrderDraftListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderDraftListQuery, Types.OrderDraftListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderDraftListQuery, Types.OrderDraftListQueryVariables>(OrderDraftListDocument, options);
        }
export type OrderDraftListQueryHookResult = ReturnType<typeof useOrderDraftListQuery>;
export type OrderDraftListLazyQueryHookResult = ReturnType<typeof useOrderDraftListLazyQuery>;
export type OrderDraftListQueryResult = Apollo.QueryResult<Types.OrderDraftListQuery, Types.OrderDraftListQueryVariables>;
export const OrderDetailsDocument = gql`
    query OrderDetails($id: ID!) {
  order(id: $id) {
    ...OrderDetails
  }
  shop {
    countries {
      code
      country
    }
    defaultWeightUnit
    fulfillmentAllowUnpaid
    fulfillmentAutoApprove
    availablePaymentGateways {
      ...PaymentGateway
    }
  }
}
    ${OrderDetailsFragmentDoc}
${PaymentGatewayFragmentDoc}`;

/**
 * __useOrderDetailsQuery__
 *
 * To run a query within a React component, call `useOrderDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderDetailsQuery, Types.OrderDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderDetailsQuery, Types.OrderDetailsQueryVariables>(OrderDetailsDocument, options);
      }
export function useOrderDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderDetailsQuery, Types.OrderDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderDetailsQuery, Types.OrderDetailsQueryVariables>(OrderDetailsDocument, options);
        }
export type OrderDetailsQueryHookResult = ReturnType<typeof useOrderDetailsQuery>;
export type OrderDetailsLazyQueryHookResult = ReturnType<typeof useOrderDetailsLazyQuery>;
export type OrderDetailsQueryResult = Apollo.QueryResult<Types.OrderDetailsQuery, Types.OrderDetailsQueryVariables>;
export const OrderDetailsWithMetadataDocument = gql`
    query OrderDetailsWithMetadata($id: ID!, $hasManageProducts: Boolean!) {
  order(id: $id) {
    ...OrderDetailsWithMetadata
  }
  shop {
    countries {
      code
      country
    }
    defaultWeightUnit
    fulfillmentAllowUnpaid
    fulfillmentAutoApprove
    availablePaymentGateways {
      ...PaymentGateway
    }
  }
}
    ${OrderDetailsWithMetadataFragmentDoc}
${PaymentGatewayFragmentDoc}`;

/**
 * __useOrderDetailsWithMetadataQuery__
 *
 * To run a query within a React component, call `useOrderDetailsWithMetadataQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsWithMetadataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsWithMetadataQuery({
 *   variables: {
 *      id: // value for 'id'
 *      hasManageProducts: // value for 'hasManageProducts'
 *   },
 * });
 */
export function useOrderDetailsWithMetadataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderDetailsWithMetadataQuery, Types.OrderDetailsWithMetadataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderDetailsWithMetadataQuery, Types.OrderDetailsWithMetadataQueryVariables>(OrderDetailsWithMetadataDocument, options);
      }
export function useOrderDetailsWithMetadataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderDetailsWithMetadataQuery, Types.OrderDetailsWithMetadataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderDetailsWithMetadataQuery, Types.OrderDetailsWithMetadataQueryVariables>(OrderDetailsWithMetadataDocument, options);
        }
export type OrderDetailsWithMetadataQueryHookResult = ReturnType<typeof useOrderDetailsWithMetadataQuery>;
export type OrderDetailsWithMetadataLazyQueryHookResult = ReturnType<typeof useOrderDetailsWithMetadataLazyQuery>;
export type OrderDetailsWithMetadataQueryResult = Apollo.QueryResult<Types.OrderDetailsWithMetadataQuery, Types.OrderDetailsWithMetadataQueryVariables>;
export const OrderLinesMetadataDocument = gql`
    query OrderLinesMetadata($id: ID!, $hasManageProducts: Boolean!) {
  order(id: $id) {
    lines {
      ...OrderLineMetadataDetails
    }
  }
}
    ${OrderLineMetadataDetailsFragmentDoc}`;

/**
 * __useOrderLinesMetadataQuery__
 *
 * To run a query within a React component, call `useOrderLinesMetadataQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderLinesMetadataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderLinesMetadataQuery({
 *   variables: {
 *      id: // value for 'id'
 *      hasManageProducts: // value for 'hasManageProducts'
 *   },
 * });
 */
export function useOrderLinesMetadataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderLinesMetadataQuery, Types.OrderLinesMetadataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderLinesMetadataQuery, Types.OrderLinesMetadataQueryVariables>(OrderLinesMetadataDocument, options);
      }
export function useOrderLinesMetadataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderLinesMetadataQuery, Types.OrderLinesMetadataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderLinesMetadataQuery, Types.OrderLinesMetadataQueryVariables>(OrderLinesMetadataDocument, options);
        }
export type OrderLinesMetadataQueryHookResult = ReturnType<typeof useOrderLinesMetadataQuery>;
export type OrderLinesMetadataLazyQueryHookResult = ReturnType<typeof useOrderLinesMetadataLazyQuery>;
export type OrderLinesMetadataQueryResult = Apollo.QueryResult<Types.OrderLinesMetadataQuery, Types.OrderLinesMetadataQueryVariables>;
export const OrderDetailsGrantRefundDocument = gql`
    query OrderDetailsGrantRefund($id: ID!) {
  order(id: $id) {
    ...OrderDetailsGrantRefund
  }
}
    ${OrderDetailsGrantRefundFragmentDoc}`;

/**
 * __useOrderDetailsGrantRefundQuery__
 *
 * To run a query within a React component, call `useOrderDetailsGrantRefundQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsGrantRefundQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsGrantRefundQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderDetailsGrantRefundQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderDetailsGrantRefundQuery, Types.OrderDetailsGrantRefundQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderDetailsGrantRefundQuery, Types.OrderDetailsGrantRefundQueryVariables>(OrderDetailsGrantRefundDocument, options);
      }
export function useOrderDetailsGrantRefundLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderDetailsGrantRefundQuery, Types.OrderDetailsGrantRefundQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderDetailsGrantRefundQuery, Types.OrderDetailsGrantRefundQueryVariables>(OrderDetailsGrantRefundDocument, options);
        }
export type OrderDetailsGrantRefundQueryHookResult = ReturnType<typeof useOrderDetailsGrantRefundQuery>;
export type OrderDetailsGrantRefundLazyQueryHookResult = ReturnType<typeof useOrderDetailsGrantRefundLazyQuery>;
export type OrderDetailsGrantRefundQueryResult = Apollo.QueryResult<Types.OrderDetailsGrantRefundQuery, Types.OrderDetailsGrantRefundQueryVariables>;
export const OrderDetailsGrantRefundEditDocument = gql`
    query OrderDetailsGrantRefundEdit($id: ID!) {
  order(id: $id) {
    ...OrderDetailsGrantRefund
  }
}
    ${OrderDetailsGrantRefundFragmentDoc}`;

/**
 * __useOrderDetailsGrantRefundEditQuery__
 *
 * To run a query within a React component, call `useOrderDetailsGrantRefundEditQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsGrantRefundEditQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsGrantRefundEditQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderDetailsGrantRefundEditQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderDetailsGrantRefundEditQuery, Types.OrderDetailsGrantRefundEditQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderDetailsGrantRefundEditQuery, Types.OrderDetailsGrantRefundEditQueryVariables>(OrderDetailsGrantRefundEditDocument, options);
      }
export function useOrderDetailsGrantRefundEditLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderDetailsGrantRefundEditQuery, Types.OrderDetailsGrantRefundEditQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderDetailsGrantRefundEditQuery, Types.OrderDetailsGrantRefundEditQueryVariables>(OrderDetailsGrantRefundEditDocument, options);
        }
export type OrderDetailsGrantRefundEditQueryHookResult = ReturnType<typeof useOrderDetailsGrantRefundEditQuery>;
export type OrderDetailsGrantRefundEditLazyQueryHookResult = ReturnType<typeof useOrderDetailsGrantRefundEditLazyQuery>;
export type OrderDetailsGrantRefundEditQueryResult = Apollo.QueryResult<Types.OrderDetailsGrantRefundEditQuery, Types.OrderDetailsGrantRefundEditQueryVariables>;
export const OrderFulfillDataDocument = gql`
    query OrderFulfillData($orderId: ID!) {
  order(id: $orderId) {
    id
    isPaid
    deliveryMethod {
      __typename
      ... on ShippingMethod {
        id
      }
      ... on Warehouse {
        id
        clickAndCollectOption
      }
    }
    lines {
      ...OrderFulfillLine
    }
    number
  }
}
    ${OrderFulfillLineFragmentDoc}`;

/**
 * __useOrderFulfillDataQuery__
 *
 * To run a query within a React component, call `useOrderFulfillDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderFulfillDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderFulfillDataQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useOrderFulfillDataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderFulfillDataQuery, Types.OrderFulfillDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderFulfillDataQuery, Types.OrderFulfillDataQueryVariables>(OrderFulfillDataDocument, options);
      }
export function useOrderFulfillDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderFulfillDataQuery, Types.OrderFulfillDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderFulfillDataQuery, Types.OrderFulfillDataQueryVariables>(OrderFulfillDataDocument, options);
        }
export type OrderFulfillDataQueryHookResult = ReturnType<typeof useOrderFulfillDataQuery>;
export type OrderFulfillDataLazyQueryHookResult = ReturnType<typeof useOrderFulfillDataLazyQuery>;
export type OrderFulfillDataQueryResult = Apollo.QueryResult<Types.OrderFulfillDataQuery, Types.OrderFulfillDataQueryVariables>;
export const OrderFulfillSettingsDocument = gql`
    query OrderFulfillSettings {
  shop {
    ...ShopOrderSettings
  }
}
    ${ShopOrderSettingsFragmentDoc}`;

/**
 * __useOrderFulfillSettingsQuery__
 *
 * To run a query within a React component, call `useOrderFulfillSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderFulfillSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderFulfillSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrderFulfillSettingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.OrderFulfillSettingsQuery, Types.OrderFulfillSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderFulfillSettingsQuery, Types.OrderFulfillSettingsQueryVariables>(OrderFulfillSettingsDocument, options);
      }
export function useOrderFulfillSettingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderFulfillSettingsQuery, Types.OrderFulfillSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderFulfillSettingsQuery, Types.OrderFulfillSettingsQueryVariables>(OrderFulfillSettingsDocument, options);
        }
export type OrderFulfillSettingsQueryHookResult = ReturnType<typeof useOrderFulfillSettingsQuery>;
export type OrderFulfillSettingsLazyQueryHookResult = ReturnType<typeof useOrderFulfillSettingsLazyQuery>;
export type OrderFulfillSettingsQueryResult = Apollo.QueryResult<Types.OrderFulfillSettingsQuery, Types.OrderFulfillSettingsQueryVariables>;
export const OrderSettingsDocument = gql`
    query OrderSettings {
  orderSettings {
    ...OrderSettings
  }
  shop {
    ...ShopOrderSettings
  }
}
    ${OrderSettingsFragmentDoc}
${ShopOrderSettingsFragmentDoc}`;

/**
 * __useOrderSettingsQuery__
 *
 * To run a query within a React component, call `useOrderSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrderSettingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.OrderSettingsQuery, Types.OrderSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderSettingsQuery, Types.OrderSettingsQueryVariables>(OrderSettingsDocument, options);
      }
export function useOrderSettingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderSettingsQuery, Types.OrderSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderSettingsQuery, Types.OrderSettingsQueryVariables>(OrderSettingsDocument, options);
        }
export type OrderSettingsQueryHookResult = ReturnType<typeof useOrderSettingsQuery>;
export type OrderSettingsLazyQueryHookResult = ReturnType<typeof useOrderSettingsLazyQuery>;
export type OrderSettingsQueryResult = Apollo.QueryResult<Types.OrderSettingsQuery, Types.OrderSettingsQueryVariables>;
export const OrderRefundDataDocument = gql`
    query OrderRefundData($orderId: ID!) {
  order(id: $orderId) {
    id
    number
    total {
      gross {
        ...Money
      }
    }
    totalCaptured {
      ...Money
    }
    shippingPrice {
      gross {
        ...Money
      }
    }
    lines {
      ...RefundOrderLine
      quantityToFulfill
    }
    fulfillments {
      id
      status
      fulfillmentOrder
      lines {
        id
        quantity
        orderLine {
          ...RefundOrderLine
        }
      }
    }
  }
}
    ${MoneyFragmentDoc}
${RefundOrderLineFragmentDoc}`;

/**
 * __useOrderRefundDataQuery__
 *
 * To run a query within a React component, call `useOrderRefundDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderRefundDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderRefundDataQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useOrderRefundDataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderRefundDataQuery, Types.OrderRefundDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderRefundDataQuery, Types.OrderRefundDataQueryVariables>(OrderRefundDataDocument, options);
      }
export function useOrderRefundDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderRefundDataQuery, Types.OrderRefundDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderRefundDataQuery, Types.OrderRefundDataQueryVariables>(OrderRefundDataDocument, options);
        }
export type OrderRefundDataQueryHookResult = ReturnType<typeof useOrderRefundDataQuery>;
export type OrderRefundDataLazyQueryHookResult = ReturnType<typeof useOrderRefundDataLazyQuery>;
export type OrderRefundDataQueryResult = Apollo.QueryResult<Types.OrderRefundDataQuery, Types.OrderRefundDataQueryVariables>;
export const OrderTransactionsDataDocument = gql`
    query OrderTransactionsData($orderId: ID!) {
  order(id: $orderId) {
    id
    transactions {
      ...TransactionItem
    }
    total {
      gross {
        ...Money
      }
    }
  }
}
    ${TransactionItemFragmentDoc}
${MoneyFragmentDoc}`;

/**
 * __useOrderTransactionsDataQuery__
 *
 * To run a query within a React component, call `useOrderTransactionsDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderTransactionsDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderTransactionsDataQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useOrderTransactionsDataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderTransactionsDataQuery, Types.OrderTransactionsDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderTransactionsDataQuery, Types.OrderTransactionsDataQueryVariables>(OrderTransactionsDataDocument, options);
      }
export function useOrderTransactionsDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderTransactionsDataQuery, Types.OrderTransactionsDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderTransactionsDataQuery, Types.OrderTransactionsDataQueryVariables>(OrderTransactionsDataDocument, options);
        }
export type OrderTransactionsDataQueryHookResult = ReturnType<typeof useOrderTransactionsDataQuery>;
export type OrderTransactionsDataLazyQueryHookResult = ReturnType<typeof useOrderTransactionsDataLazyQuery>;
export type OrderTransactionsDataQueryResult = Apollo.QueryResult<Types.OrderTransactionsDataQuery, Types.OrderTransactionsDataQueryVariables>;
export const ChannelUsabilityDataDocument = gql`
    query ChannelUsabilityData($channel: String!) {
  products(channel: $channel) {
    totalCount
  }
}
    `;

/**
 * __useChannelUsabilityDataQuery__
 *
 * To run a query within a React component, call `useChannelUsabilityDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelUsabilityDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelUsabilityDataQuery({
 *   variables: {
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useChannelUsabilityDataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ChannelUsabilityDataQuery, Types.ChannelUsabilityDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ChannelUsabilityDataQuery, Types.ChannelUsabilityDataQueryVariables>(ChannelUsabilityDataDocument, options);
      }
export function useChannelUsabilityDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ChannelUsabilityDataQuery, Types.ChannelUsabilityDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ChannelUsabilityDataQuery, Types.ChannelUsabilityDataQueryVariables>(ChannelUsabilityDataDocument, options);
        }
export type ChannelUsabilityDataQueryHookResult = ReturnType<typeof useChannelUsabilityDataQuery>;
export type ChannelUsabilityDataLazyQueryHookResult = ReturnType<typeof useChannelUsabilityDataLazyQuery>;
export type ChannelUsabilityDataQueryResult = Apollo.QueryResult<Types.ChannelUsabilityDataQuery, Types.ChannelUsabilityDataQueryVariables>;
export const OrderDetailsGraphiQlDocument = gql`
    query OrderDetailsGraphiQL($id: ID!) {
  order(id: $id) {
    id
    number
    status
    isShippingRequired
    canFinalize
    created
    customerNote
    paymentStatus
    userEmail
    isPaid
  }
}
    `;

/**
 * __useOrderDetailsGraphiQlQuery__
 *
 * To run a query within a React component, call `useOrderDetailsGraphiQlQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsGraphiQlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsGraphiQlQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderDetailsGraphiQlQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.OrderDetailsGraphiQlQuery, Types.OrderDetailsGraphiQlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.OrderDetailsGraphiQlQuery, Types.OrderDetailsGraphiQlQueryVariables>(OrderDetailsGraphiQlDocument, options);
      }
export function useOrderDetailsGraphiQlLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.OrderDetailsGraphiQlQuery, Types.OrderDetailsGraphiQlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.OrderDetailsGraphiQlQuery, Types.OrderDetailsGraphiQlQueryVariables>(OrderDetailsGraphiQlDocument, options);
        }
export type OrderDetailsGraphiQlQueryHookResult = ReturnType<typeof useOrderDetailsGraphiQlQuery>;
export type OrderDetailsGraphiQlLazyQueryHookResult = ReturnType<typeof useOrderDetailsGraphiQlLazyQuery>;
export type OrderDetailsGraphiQlQueryResult = Apollo.QueryResult<Types.OrderDetailsGraphiQlQuery, Types.OrderDetailsGraphiQlQueryVariables>;
export const DevModeRunDocument = gql`
    query DevModeRun($filter: OrderFilterInput, $sortBy: OrderSortingInput) {
  orders(first: 10, filter: $filter, sortBy: $sortBy) {
    edges {
      node {
        id
        number
        status
        isShippingRequired
        canFinalize
        created
        customerNote
        paymentStatus
        userEmail
        isPaid
      }
    }
  }
}
    `;

/**
 * __useDevModeRunQuery__
 *
 * To run a query within a React component, call `useDevModeRunQuery` and pass it any options that fit your needs.
 * When your component renders, `useDevModeRunQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDevModeRunQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useDevModeRunQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.DevModeRunQuery, Types.DevModeRunQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.DevModeRunQuery, Types.DevModeRunQueryVariables>(DevModeRunDocument, options);
      }
export function useDevModeRunLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.DevModeRunQuery, Types.DevModeRunQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.DevModeRunQuery, Types.DevModeRunQueryVariables>(DevModeRunDocument, options);
        }
export type DevModeRunQueryHookResult = ReturnType<typeof useDevModeRunQuery>;
export type DevModeRunLazyQueryHookResult = ReturnType<typeof useDevModeRunLazyQuery>;
export type DevModeRunQueryResult = Apollo.QueryResult<Types.DevModeRunQuery, Types.DevModeRunQueryVariables>;
export const RefundSettingsDocument = gql`
    query RefundSettings {
  refundSettings {
    reasonReferenceType {
      id
      name
    }
  }
}
    `;

/**
 * __useRefundSettingsQuery__
 *
 * To run a query within a React component, call `useRefundSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRefundSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRefundSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRefundSettingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.RefundSettingsQuery, Types.RefundSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.RefundSettingsQuery, Types.RefundSettingsQueryVariables>(RefundSettingsDocument, options);
      }
export function useRefundSettingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.RefundSettingsQuery, Types.RefundSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.RefundSettingsQuery, Types.RefundSettingsQueryVariables>(RefundSettingsDocument, options);
        }
export type RefundSettingsQueryHookResult = ReturnType<typeof useRefundSettingsQuery>;
export type RefundSettingsLazyQueryHookResult = ReturnType<typeof useRefundSettingsLazyQuery>;
export type RefundSettingsQueryResult = Apollo.QueryResult<Types.RefundSettingsQuery, Types.RefundSettingsQueryVariables>;
export const PermissionGroupDeleteDocument = gql`
    mutation PermissionGroupDelete($id: ID!) {
  permissionGroupDelete(id: $id) {
    errors {
      ...PermissionGroupError
    }
  }
}
    ${PermissionGroupErrorFragmentDoc}`;
export type PermissionGroupDeleteMutationFn = Apollo.MutationFunction<Types.PermissionGroupDeleteMutation, Types.PermissionGroupDeleteMutationVariables>;

/**
 * __usePermissionGroupDeleteMutation__
 *
 * To run a mutation, you first call `usePermissionGroupDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePermissionGroupDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [permissionGroupDeleteMutation, { data, loading, error }] = usePermissionGroupDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePermissionGroupDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PermissionGroupDeleteMutation, Types.PermissionGroupDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PermissionGroupDeleteMutation, Types.PermissionGroupDeleteMutationVariables>(PermissionGroupDeleteDocument, options);
      }
export type PermissionGroupDeleteMutationHookResult = ReturnType<typeof usePermissionGroupDeleteMutation>;
export type PermissionGroupDeleteMutationResult = Apollo.MutationResult<Types.PermissionGroupDeleteMutation>;
export type PermissionGroupDeleteMutationOptions = Apollo.BaseMutationOptions<Types.PermissionGroupDeleteMutation, Types.PermissionGroupDeleteMutationVariables>;
export const PermissionGroupCreateDocument = gql`
    mutation PermissionGroupCreate($input: PermissionGroupCreateInput!) {
  permissionGroupCreate(input: $input) {
    errors {
      ...PermissionGroupError
    }
    group {
      ...PermissionGroupDetails
    }
  }
}
    ${PermissionGroupErrorFragmentDoc}
${PermissionGroupDetailsFragmentDoc}`;
export type PermissionGroupCreateMutationFn = Apollo.MutationFunction<Types.PermissionGroupCreateMutation, Types.PermissionGroupCreateMutationVariables>;

/**
 * __usePermissionGroupCreateMutation__
 *
 * To run a mutation, you first call `usePermissionGroupCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePermissionGroupCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [permissionGroupCreateMutation, { data, loading, error }] = usePermissionGroupCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePermissionGroupCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PermissionGroupCreateMutation, Types.PermissionGroupCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PermissionGroupCreateMutation, Types.PermissionGroupCreateMutationVariables>(PermissionGroupCreateDocument, options);
      }
export type PermissionGroupCreateMutationHookResult = ReturnType<typeof usePermissionGroupCreateMutation>;
export type PermissionGroupCreateMutationResult = Apollo.MutationResult<Types.PermissionGroupCreateMutation>;
export type PermissionGroupCreateMutationOptions = Apollo.BaseMutationOptions<Types.PermissionGroupCreateMutation, Types.PermissionGroupCreateMutationVariables>;
export const PermissionGroupUpdateDocument = gql`
    mutation PermissionGroupUpdate($id: ID!, $input: PermissionGroupUpdateInput!) {
  permissionGroupUpdate(id: $id, input: $input) {
    errors {
      ...PermissionGroupError
    }
    group {
      ...PermissionGroupDetails
    }
  }
}
    ${PermissionGroupErrorFragmentDoc}
${PermissionGroupDetailsFragmentDoc}`;
export type PermissionGroupUpdateMutationFn = Apollo.MutationFunction<Types.PermissionGroupUpdateMutation, Types.PermissionGroupUpdateMutationVariables>;

/**
 * __usePermissionGroupUpdateMutation__
 *
 * To run a mutation, you first call `usePermissionGroupUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePermissionGroupUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [permissionGroupUpdateMutation, { data, loading, error }] = usePermissionGroupUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePermissionGroupUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.PermissionGroupUpdateMutation, Types.PermissionGroupUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.PermissionGroupUpdateMutation, Types.PermissionGroupUpdateMutationVariables>(PermissionGroupUpdateDocument, options);
      }
export type PermissionGroupUpdateMutationHookResult = ReturnType<typeof usePermissionGroupUpdateMutation>;
export type PermissionGroupUpdateMutationResult = Apollo.MutationResult<Types.PermissionGroupUpdateMutation>;
export type PermissionGroupUpdateMutationOptions = Apollo.BaseMutationOptions<Types.PermissionGroupUpdateMutation, Types.PermissionGroupUpdateMutationVariables>;
export const PermissionGroupListDocument = gql`
    query PermissionGroupList($after: String, $before: String, $first: Int, $last: Int, $filter: PermissionGroupFilterInput, $sort: PermissionGroupSortingInput) {
  permissionGroups(
    after: $after
    before: $before
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        ...PermissionGroup
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PermissionGroupFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __usePermissionGroupListQuery__
 *
 * To run a query within a React component, call `usePermissionGroupListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionGroupListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionGroupListQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function usePermissionGroupListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.PermissionGroupListQuery, Types.PermissionGroupListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PermissionGroupListQuery, Types.PermissionGroupListQueryVariables>(PermissionGroupListDocument, options);
      }
export function usePermissionGroupListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PermissionGroupListQuery, Types.PermissionGroupListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PermissionGroupListQuery, Types.PermissionGroupListQueryVariables>(PermissionGroupListDocument, options);
        }
export type PermissionGroupListQueryHookResult = ReturnType<typeof usePermissionGroupListQuery>;
export type PermissionGroupListLazyQueryHookResult = ReturnType<typeof usePermissionGroupListLazyQuery>;
export type PermissionGroupListQueryResult = Apollo.QueryResult<Types.PermissionGroupListQuery, Types.PermissionGroupListQueryVariables>;
export const PermissionGroupDetailsDocument = gql`
    query PermissionGroupDetails($id: ID!, $userId: ID!) {
  permissionGroup(id: $id) {
    ...PermissionGroupDetails
  }
  user: me {
    editableGroups {
      id
    }
    userPermissions {
      code
      sourcePermissionGroups(userId: $userId) {
        id
      }
    }
  }
}
    ${PermissionGroupDetailsFragmentDoc}`;

/**
 * __usePermissionGroupDetailsQuery__
 *
 * To run a query within a React component, call `usePermissionGroupDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionGroupDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionGroupDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function usePermissionGroupDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PermissionGroupDetailsQuery, Types.PermissionGroupDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PermissionGroupDetailsQuery, Types.PermissionGroupDetailsQueryVariables>(PermissionGroupDetailsDocument, options);
      }
export function usePermissionGroupDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PermissionGroupDetailsQuery, Types.PermissionGroupDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PermissionGroupDetailsQuery, Types.PermissionGroupDetailsQueryVariables>(PermissionGroupDetailsDocument, options);
        }
export type PermissionGroupDetailsQueryHookResult = ReturnType<typeof usePermissionGroupDetailsQuery>;
export type PermissionGroupDetailsLazyQueryHookResult = ReturnType<typeof usePermissionGroupDetailsLazyQuery>;
export type PermissionGroupDetailsQueryResult = Apollo.QueryResult<Types.PermissionGroupDetailsQuery, Types.PermissionGroupDetailsQueryVariables>;
export const ProductTypeDeleteDocument = gql`
    mutation ProductTypeDelete($id: ID!) {
  productTypeDelete(id: $id) {
    errors {
      ...ProductTypeDeleteErrorFragment
    }
    productType {
      id
    }
  }
}
    ${ProductTypeDeleteErrorFragmentFragmentDoc}`;
export type ProductTypeDeleteMutationFn = Apollo.MutationFunction<Types.ProductTypeDeleteMutation, Types.ProductTypeDeleteMutationVariables>;

/**
 * __useProductTypeDeleteMutation__
 *
 * To run a mutation, you first call `useProductTypeDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductTypeDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productTypeDeleteMutation, { data, loading, error }] = useProductTypeDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductTypeDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductTypeDeleteMutation, Types.ProductTypeDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductTypeDeleteMutation, Types.ProductTypeDeleteMutationVariables>(ProductTypeDeleteDocument, options);
      }
export type ProductTypeDeleteMutationHookResult = ReturnType<typeof useProductTypeDeleteMutation>;
export type ProductTypeDeleteMutationResult = Apollo.MutationResult<Types.ProductTypeDeleteMutation>;
export type ProductTypeDeleteMutationOptions = Apollo.BaseMutationOptions<Types.ProductTypeDeleteMutation, Types.ProductTypeDeleteMutationVariables>;
export const ProductTypeBulkDeleteDocument = gql`
    mutation ProductTypeBulkDelete($ids: [ID!]!) {
  productTypeBulkDelete(ids: $ids) {
    errors {
      ...ProductTypeBulkDeleteErrorFragment
    }
  }
}
    ${ProductTypeBulkDeleteErrorFragmentFragmentDoc}`;
export type ProductTypeBulkDeleteMutationFn = Apollo.MutationFunction<Types.ProductTypeBulkDeleteMutation, Types.ProductTypeBulkDeleteMutationVariables>;

/**
 * __useProductTypeBulkDeleteMutation__
 *
 * To run a mutation, you first call `useProductTypeBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductTypeBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productTypeBulkDeleteMutation, { data, loading, error }] = useProductTypeBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useProductTypeBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductTypeBulkDeleteMutation, Types.ProductTypeBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductTypeBulkDeleteMutation, Types.ProductTypeBulkDeleteMutationVariables>(ProductTypeBulkDeleteDocument, options);
      }
export type ProductTypeBulkDeleteMutationHookResult = ReturnType<typeof useProductTypeBulkDeleteMutation>;
export type ProductTypeBulkDeleteMutationResult = Apollo.MutationResult<Types.ProductTypeBulkDeleteMutation>;
export type ProductTypeBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.ProductTypeBulkDeleteMutation, Types.ProductTypeBulkDeleteMutationVariables>;
export const ProductTypeUpdateDocument = gql`
    mutation ProductTypeUpdate($id: ID!, $input: ProductTypeInput!) {
  productTypeUpdate(id: $id, input: $input) {
    errors {
      ...ProductTypeBulkUpdateErrorFragment
    }
    productType {
      ...ProductTypeDetails
    }
  }
}
    ${ProductTypeBulkUpdateErrorFragmentFragmentDoc}
${ProductTypeDetailsFragmentDoc}`;
export type ProductTypeUpdateMutationFn = Apollo.MutationFunction<Types.ProductTypeUpdateMutation, Types.ProductTypeUpdateMutationVariables>;

/**
 * __useProductTypeUpdateMutation__
 *
 * To run a mutation, you first call `useProductTypeUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductTypeUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productTypeUpdateMutation, { data, loading, error }] = useProductTypeUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProductTypeUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductTypeUpdateMutation, Types.ProductTypeUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductTypeUpdateMutation, Types.ProductTypeUpdateMutationVariables>(ProductTypeUpdateDocument, options);
      }
export type ProductTypeUpdateMutationHookResult = ReturnType<typeof useProductTypeUpdateMutation>;
export type ProductTypeUpdateMutationResult = Apollo.MutationResult<Types.ProductTypeUpdateMutation>;
export type ProductTypeUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ProductTypeUpdateMutation, Types.ProductTypeUpdateMutationVariables>;
export const AssignProductAttributeDocument = gql`
    mutation AssignProductAttribute($id: ID!, $operations: [ProductAttributeAssignInput!]!) {
  productAttributeAssign(productTypeId: $id, operations: $operations) {
    errors {
      ...ProductAttributeAssignErrorFragment
    }
    productType {
      ...ProductTypeDetails
    }
  }
}
    ${ProductAttributeAssignErrorFragmentFragmentDoc}
${ProductTypeDetailsFragmentDoc}`;
export type AssignProductAttributeMutationFn = Apollo.MutationFunction<Types.AssignProductAttributeMutation, Types.AssignProductAttributeMutationVariables>;

/**
 * __useAssignProductAttributeMutation__
 *
 * To run a mutation, you first call `useAssignProductAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignProductAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignProductAttributeMutation, { data, loading, error }] = useAssignProductAttributeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      operations: // value for 'operations'
 *   },
 * });
 */
export function useAssignProductAttributeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.AssignProductAttributeMutation, Types.AssignProductAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.AssignProductAttributeMutation, Types.AssignProductAttributeMutationVariables>(AssignProductAttributeDocument, options);
      }
export type AssignProductAttributeMutationHookResult = ReturnType<typeof useAssignProductAttributeMutation>;
export type AssignProductAttributeMutationResult = Apollo.MutationResult<Types.AssignProductAttributeMutation>;
export type AssignProductAttributeMutationOptions = Apollo.BaseMutationOptions<Types.AssignProductAttributeMutation, Types.AssignProductAttributeMutationVariables>;
export const UnassignProductAttributeDocument = gql`
    mutation UnassignProductAttribute($id: ID!, $ids: [ID!]!) {
  productAttributeUnassign(productTypeId: $id, attributeIds: $ids) {
    errors {
      ...ProductAttributeUnassignErrorFragment
    }
    productType {
      ...ProductTypeDetails
    }
  }
}
    ${ProductAttributeUnassignErrorFragmentFragmentDoc}
${ProductTypeDetailsFragmentDoc}`;
export type UnassignProductAttributeMutationFn = Apollo.MutationFunction<Types.UnassignProductAttributeMutation, Types.UnassignProductAttributeMutationVariables>;

/**
 * __useUnassignProductAttributeMutation__
 *
 * To run a mutation, you first call `useUnassignProductAttributeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnassignProductAttributeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unassignProductAttributeMutation, { data, loading, error }] = useUnassignProductAttributeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useUnassignProductAttributeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UnassignProductAttributeMutation, Types.UnassignProductAttributeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UnassignProductAttributeMutation, Types.UnassignProductAttributeMutationVariables>(UnassignProductAttributeDocument, options);
      }
export type UnassignProductAttributeMutationHookResult = ReturnType<typeof useUnassignProductAttributeMutation>;
export type UnassignProductAttributeMutationResult = Apollo.MutationResult<Types.UnassignProductAttributeMutation>;
export type UnassignProductAttributeMutationOptions = Apollo.BaseMutationOptions<Types.UnassignProductAttributeMutation, Types.UnassignProductAttributeMutationVariables>;
export const ProductTypeCreateDocument = gql`
    mutation ProductTypeCreate($input: ProductTypeInput!) {
  productTypeCreate(input: $input) {
    errors {
      ...ProductTypeCreateErrorFragment
    }
    productType {
      ...ProductTypeDetails
    }
  }
}
    ${ProductTypeCreateErrorFragmentFragmentDoc}
${ProductTypeDetailsFragmentDoc}`;
export type ProductTypeCreateMutationFn = Apollo.MutationFunction<Types.ProductTypeCreateMutation, Types.ProductTypeCreateMutationVariables>;

/**
 * __useProductTypeCreateMutation__
 *
 * To run a mutation, you first call `useProductTypeCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductTypeCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productTypeCreateMutation, { data, loading, error }] = useProductTypeCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProductTypeCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductTypeCreateMutation, Types.ProductTypeCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductTypeCreateMutation, Types.ProductTypeCreateMutationVariables>(ProductTypeCreateDocument, options);
      }
export type ProductTypeCreateMutationHookResult = ReturnType<typeof useProductTypeCreateMutation>;
export type ProductTypeCreateMutationResult = Apollo.MutationResult<Types.ProductTypeCreateMutation>;
export type ProductTypeCreateMutationOptions = Apollo.BaseMutationOptions<Types.ProductTypeCreateMutation, Types.ProductTypeCreateMutationVariables>;
export const ProductTypeAttributeReorderDocument = gql`
    mutation ProductTypeAttributeReorder($move: ReorderInput!, $productTypeId: ID!, $type: ProductAttributeType!) {
  productTypeReorderAttributes(
    moves: [$move]
    productTypeId: $productTypeId
    type: $type
  ) {
    errors {
      ...ProductTypeReorderAttributesErrorFragment
    }
    productType {
      ...ProductTypeDetails
    }
  }
}
    ${ProductTypeReorderAttributesErrorFragmentFragmentDoc}
${ProductTypeDetailsFragmentDoc}`;
export type ProductTypeAttributeReorderMutationFn = Apollo.MutationFunction<Types.ProductTypeAttributeReorderMutation, Types.ProductTypeAttributeReorderMutationVariables>;

/**
 * __useProductTypeAttributeReorderMutation__
 *
 * To run a mutation, you first call `useProductTypeAttributeReorderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductTypeAttributeReorderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productTypeAttributeReorderMutation, { data, loading, error }] = useProductTypeAttributeReorderMutation({
 *   variables: {
 *      move: // value for 'move'
 *      productTypeId: // value for 'productTypeId'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useProductTypeAttributeReorderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductTypeAttributeReorderMutation, Types.ProductTypeAttributeReorderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductTypeAttributeReorderMutation, Types.ProductTypeAttributeReorderMutationVariables>(ProductTypeAttributeReorderDocument, options);
      }
export type ProductTypeAttributeReorderMutationHookResult = ReturnType<typeof useProductTypeAttributeReorderMutation>;
export type ProductTypeAttributeReorderMutationResult = Apollo.MutationResult<Types.ProductTypeAttributeReorderMutation>;
export type ProductTypeAttributeReorderMutationOptions = Apollo.BaseMutationOptions<Types.ProductTypeAttributeReorderMutation, Types.ProductTypeAttributeReorderMutationVariables>;
export const ProductAttributeAssignmentUpdateDocument = gql`
    mutation ProductAttributeAssignmentUpdate($operations: [ProductAttributeAssignmentUpdateInput!]!, $productTypeId: ID!) {
  productAttributeAssignmentUpdate(
    operations: $operations
    productTypeId: $productTypeId
  ) {
    errors {
      ...ProductAttributeAssignmentUpdateErrorFragment
    }
    productType {
      ...ProductTypeDetails
    }
  }
}
    ${ProductAttributeAssignmentUpdateErrorFragmentFragmentDoc}
${ProductTypeDetailsFragmentDoc}`;
export type ProductAttributeAssignmentUpdateMutationFn = Apollo.MutationFunction<Types.ProductAttributeAssignmentUpdateMutation, Types.ProductAttributeAssignmentUpdateMutationVariables>;

/**
 * __useProductAttributeAssignmentUpdateMutation__
 *
 * To run a mutation, you first call `useProductAttributeAssignmentUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductAttributeAssignmentUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productAttributeAssignmentUpdateMutation, { data, loading, error }] = useProductAttributeAssignmentUpdateMutation({
 *   variables: {
 *      operations: // value for 'operations'
 *      productTypeId: // value for 'productTypeId'
 *   },
 * });
 */
export function useProductAttributeAssignmentUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductAttributeAssignmentUpdateMutation, Types.ProductAttributeAssignmentUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductAttributeAssignmentUpdateMutation, Types.ProductAttributeAssignmentUpdateMutationVariables>(ProductAttributeAssignmentUpdateDocument, options);
      }
export type ProductAttributeAssignmentUpdateMutationHookResult = ReturnType<typeof useProductAttributeAssignmentUpdateMutation>;
export type ProductAttributeAssignmentUpdateMutationResult = Apollo.MutationResult<Types.ProductAttributeAssignmentUpdateMutation>;
export type ProductAttributeAssignmentUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ProductAttributeAssignmentUpdateMutation, Types.ProductAttributeAssignmentUpdateMutationVariables>;
export const ProductTypeListDocument = gql`
    query ProductTypeList($after: String, $before: String, $first: Int, $last: Int, $filter: ProductTypeFilterInput, $sort: ProductTypeSortingInput) {
  productTypes(
    after: $after
    before: $before
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        ...ProductType
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${ProductTypeFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useProductTypeListQuery__
 *
 * To run a query within a React component, call `useProductTypeListQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductTypeListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductTypeListQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useProductTypeListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ProductTypeListQuery, Types.ProductTypeListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductTypeListQuery, Types.ProductTypeListQueryVariables>(ProductTypeListDocument, options);
      }
export function useProductTypeListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductTypeListQuery, Types.ProductTypeListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductTypeListQuery, Types.ProductTypeListQueryVariables>(ProductTypeListDocument, options);
        }
export type ProductTypeListQueryHookResult = ReturnType<typeof useProductTypeListQuery>;
export type ProductTypeListLazyQueryHookResult = ReturnType<typeof useProductTypeListLazyQuery>;
export type ProductTypeListQueryResult = Apollo.QueryResult<Types.ProductTypeListQuery, Types.ProductTypeListQueryVariables>;
export const ProductTypeDetailsDocument = gql`
    query ProductTypeDetails($id: ID!) {
  productType(id: $id) {
    ...ProductTypeDetails
  }
  shop {
    defaultWeightUnit
  }
}
    ${ProductTypeDetailsFragmentDoc}`;

/**
 * __useProductTypeDetailsQuery__
 *
 * To run a query within a React component, call `useProductTypeDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductTypeDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductTypeDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductTypeDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductTypeDetailsQuery, Types.ProductTypeDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductTypeDetailsQuery, Types.ProductTypeDetailsQueryVariables>(ProductTypeDetailsDocument, options);
      }
export function useProductTypeDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductTypeDetailsQuery, Types.ProductTypeDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductTypeDetailsQuery, Types.ProductTypeDetailsQueryVariables>(ProductTypeDetailsDocument, options);
        }
export type ProductTypeDetailsQueryHookResult = ReturnType<typeof useProductTypeDetailsQuery>;
export type ProductTypeDetailsLazyQueryHookResult = ReturnType<typeof useProductTypeDetailsLazyQuery>;
export type ProductTypeDetailsQueryResult = Apollo.QueryResult<Types.ProductTypeDetailsQuery, Types.ProductTypeDetailsQueryVariables>;
export const ProductTypeCreateDataDocument = gql`
    query ProductTypeCreateData {
  shop {
    defaultWeightUnit
  }
}
    `;

/**
 * __useProductTypeCreateDataQuery__
 *
 * To run a query within a React component, call `useProductTypeCreateDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductTypeCreateDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductTypeCreateDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductTypeCreateDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ProductTypeCreateDataQuery, Types.ProductTypeCreateDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductTypeCreateDataQuery, Types.ProductTypeCreateDataQueryVariables>(ProductTypeCreateDataDocument, options);
      }
export function useProductTypeCreateDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductTypeCreateDataQuery, Types.ProductTypeCreateDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductTypeCreateDataQuery, Types.ProductTypeCreateDataQueryVariables>(ProductTypeCreateDataDocument, options);
        }
export type ProductTypeCreateDataQueryHookResult = ReturnType<typeof useProductTypeCreateDataQuery>;
export type ProductTypeCreateDataLazyQueryHookResult = ReturnType<typeof useProductTypeCreateDataLazyQuery>;
export type ProductTypeCreateDataQueryResult = Apollo.QueryResult<Types.ProductTypeCreateDataQuery, Types.ProductTypeCreateDataQueryVariables>;
export const ProductMediaCreateDocument = gql`
    mutation ProductMediaCreate($product: ID!, $image: Upload, $alt: String, $mediaUrl: String) {
  productMediaCreate(
    input: {alt: $alt, image: $image, product: $product, mediaUrl: $mediaUrl}
  ) {
    errors {
      ...ProductError
    }
    product {
      id
      media {
        ...ProductMedia
      }
    }
  }
}
    ${ProductErrorFragmentDoc}
${ProductMediaFragmentDoc}`;
export type ProductMediaCreateMutationFn = Apollo.MutationFunction<Types.ProductMediaCreateMutation, Types.ProductMediaCreateMutationVariables>;

/**
 * __useProductMediaCreateMutation__
 *
 * To run a mutation, you first call `useProductMediaCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductMediaCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productMediaCreateMutation, { data, loading, error }] = useProductMediaCreateMutation({
 *   variables: {
 *      product: // value for 'product'
 *      image: // value for 'image'
 *      alt: // value for 'alt'
 *      mediaUrl: // value for 'mediaUrl'
 *   },
 * });
 */
export function useProductMediaCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductMediaCreateMutation, Types.ProductMediaCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductMediaCreateMutation, Types.ProductMediaCreateMutationVariables>(ProductMediaCreateDocument, options);
      }
export type ProductMediaCreateMutationHookResult = ReturnType<typeof useProductMediaCreateMutation>;
export type ProductMediaCreateMutationResult = Apollo.MutationResult<Types.ProductMediaCreateMutation>;
export type ProductMediaCreateMutationOptions = Apollo.BaseMutationOptions<Types.ProductMediaCreateMutation, Types.ProductMediaCreateMutationVariables>;
export const ProductDeleteDocument = gql`
    mutation ProductDelete($id: ID!) {
  productDelete(id: $id) {
    errors {
      ...ProductError
    }
    product {
      id
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type ProductDeleteMutationFn = Apollo.MutationFunction<Types.ProductDeleteMutation, Types.ProductDeleteMutationVariables>;

/**
 * __useProductDeleteMutation__
 *
 * To run a mutation, you first call `useProductDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productDeleteMutation, { data, loading, error }] = useProductDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductDeleteMutation, Types.ProductDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductDeleteMutation, Types.ProductDeleteMutationVariables>(ProductDeleteDocument, options);
      }
export type ProductDeleteMutationHookResult = ReturnType<typeof useProductDeleteMutation>;
export type ProductDeleteMutationResult = Apollo.MutationResult<Types.ProductDeleteMutation>;
export type ProductDeleteMutationOptions = Apollo.BaseMutationOptions<Types.ProductDeleteMutation, Types.ProductDeleteMutationVariables>;
export const ProductMediaReorderDocument = gql`
    mutation ProductMediaReorder($productId: ID!, $mediaIds: [ID!]!) {
  productMediaReorder(productId: $productId, mediaIds: $mediaIds) {
    errors {
      ...ProductError
    }
    product {
      id
      media {
        id
        alt
        sortOrder
        url
      }
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type ProductMediaReorderMutationFn = Apollo.MutationFunction<Types.ProductMediaReorderMutation, Types.ProductMediaReorderMutationVariables>;

/**
 * __useProductMediaReorderMutation__
 *
 * To run a mutation, you first call `useProductMediaReorderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductMediaReorderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productMediaReorderMutation, { data, loading, error }] = useProductMediaReorderMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      mediaIds: // value for 'mediaIds'
 *   },
 * });
 */
export function useProductMediaReorderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductMediaReorderMutation, Types.ProductMediaReorderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductMediaReorderMutation, Types.ProductMediaReorderMutationVariables>(ProductMediaReorderDocument, options);
      }
export type ProductMediaReorderMutationHookResult = ReturnType<typeof useProductMediaReorderMutation>;
export type ProductMediaReorderMutationResult = Apollo.MutationResult<Types.ProductMediaReorderMutation>;
export type ProductMediaReorderMutationOptions = Apollo.BaseMutationOptions<Types.ProductMediaReorderMutation, Types.ProductMediaReorderMutationVariables>;
export const ProductVariantSetDefaultDocument = gql`
    mutation ProductVariantSetDefault($productId: ID!, $variantId: ID!) {
  productVariantSetDefault(productId: $productId, variantId: $variantId) {
    errors {
      ...ProductError
    }
    product {
      id
      defaultVariant {
        id
        name
      }
      variants {
        id
        name
      }
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type ProductVariantSetDefaultMutationFn = Apollo.MutationFunction<Types.ProductVariantSetDefaultMutation, Types.ProductVariantSetDefaultMutationVariables>;

/**
 * __useProductVariantSetDefaultMutation__
 *
 * To run a mutation, you first call `useProductVariantSetDefaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductVariantSetDefaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productVariantSetDefaultMutation, { data, loading, error }] = useProductVariantSetDefaultMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      variantId: // value for 'variantId'
 *   },
 * });
 */
export function useProductVariantSetDefaultMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductVariantSetDefaultMutation, Types.ProductVariantSetDefaultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductVariantSetDefaultMutation, Types.ProductVariantSetDefaultMutationVariables>(ProductVariantSetDefaultDocument, options);
      }
export type ProductVariantSetDefaultMutationHookResult = ReturnType<typeof useProductVariantSetDefaultMutation>;
export type ProductVariantSetDefaultMutationResult = Apollo.MutationResult<Types.ProductVariantSetDefaultMutation>;
export type ProductVariantSetDefaultMutationOptions = Apollo.BaseMutationOptions<Types.ProductVariantSetDefaultMutation, Types.ProductVariantSetDefaultMutationVariables>;
export const ProductUpdateDocument = gql`
    mutation ProductUpdate($id: ID!, $input: ProductInput!) {
  productUpdate(id: $id, input: $input) {
    errors {
      ...ProductErrorWithAttributes
    }
  }
}
    ${ProductErrorWithAttributesFragmentDoc}`;
export type ProductUpdateMutationFn = Apollo.MutationFunction<Types.ProductUpdateMutation, Types.ProductUpdateMutationVariables>;

/**
 * __useProductUpdateMutation__
 *
 * To run a mutation, you first call `useProductUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productUpdateMutation, { data, loading, error }] = useProductUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProductUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductUpdateMutation, Types.ProductUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductUpdateMutation, Types.ProductUpdateMutationVariables>(ProductUpdateDocument, options);
      }
export type ProductUpdateMutationHookResult = ReturnType<typeof useProductUpdateMutation>;
export type ProductUpdateMutationResult = Apollo.MutationResult<Types.ProductUpdateMutation>;
export type ProductUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ProductUpdateMutation, Types.ProductUpdateMutationVariables>;
export const ProductCreateDocument = gql`
    mutation ProductCreate($input: ProductCreateInput!) {
  productCreate(input: $input) {
    errors {
      ...ProductErrorWithAttributes
    }
    product {
      id
    }
  }
}
    ${ProductErrorWithAttributesFragmentDoc}`;
export type ProductCreateMutationFn = Apollo.MutationFunction<Types.ProductCreateMutation, Types.ProductCreateMutationVariables>;

/**
 * __useProductCreateMutation__
 *
 * To run a mutation, you first call `useProductCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productCreateMutation, { data, loading, error }] = useProductCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProductCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductCreateMutation, Types.ProductCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductCreateMutation, Types.ProductCreateMutationVariables>(ProductCreateDocument, options);
      }
export type ProductCreateMutationHookResult = ReturnType<typeof useProductCreateMutation>;
export type ProductCreateMutationResult = Apollo.MutationResult<Types.ProductCreateMutation>;
export type ProductCreateMutationOptions = Apollo.BaseMutationOptions<Types.ProductCreateMutation, Types.ProductCreateMutationVariables>;
export const VariantDeleteDocument = gql`
    mutation VariantDelete($id: ID!) {
  productVariantDelete(id: $id) {
    errors {
      ...ProductError
    }
    productVariant {
      id
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type VariantDeleteMutationFn = Apollo.MutationFunction<Types.VariantDeleteMutation, Types.VariantDeleteMutationVariables>;

/**
 * __useVariantDeleteMutation__
 *
 * To run a mutation, you first call `useVariantDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVariantDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [variantDeleteMutation, { data, loading, error }] = useVariantDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVariantDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VariantDeleteMutation, Types.VariantDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VariantDeleteMutation, Types.VariantDeleteMutationVariables>(VariantDeleteDocument, options);
      }
export type VariantDeleteMutationHookResult = ReturnType<typeof useVariantDeleteMutation>;
export type VariantDeleteMutationResult = Apollo.MutationResult<Types.VariantDeleteMutation>;
export type VariantDeleteMutationOptions = Apollo.BaseMutationOptions<Types.VariantDeleteMutation, Types.VariantDeleteMutationVariables>;
export const VariantUpdateDocument = gql`
    mutation VariantUpdate($addStocks: [StockInput!]!, $removeStocks: [ID!]!, $id: ID!, $attributes: [AttributeValueInput!], $sku: String, $quantityLimitPerCustomer: Int, $trackInventory: Boolean!, $stocks: [StockInput!]!, $preorder: PreorderSettingsInput, $weight: WeightScalar, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String, $name: String!) {
  productVariantStocksDelete(warehouseIds: $removeStocks, variantId: $id) {
    errors {
      ...ProductVariantStocksDeleteError
    }
    productVariant {
      id
      stocks {
        ...Stock
      }
    }
  }
  productVariantStocksCreate(stocks: $addStocks, variantId: $id) {
    errors {
      ...BulkStockError
    }
    productVariant {
      id
      stocks {
        ...Stock
      }
    }
  }
  productVariantStocksUpdate(stocks: $stocks, variantId: $id) {
    errors {
      ...BulkStockError
    }
    productVariant {
      ...ProductVariant
    }
  }
  productVariantUpdate(
    id: $id
    input: {attributes: $attributes, sku: $sku, trackInventory: $trackInventory, preorder: $preorder, weight: $weight, quantityLimitPerCustomer: $quantityLimitPerCustomer, name: $name}
  ) {
    errors {
      ...ProductErrorWithAttributes
    }
    productVariant {
      ...ProductVariant
    }
  }
}
    ${ProductVariantStocksDeleteErrorFragmentDoc}
${StockFragmentDoc}
${BulkStockErrorFragmentDoc}
${ProductVariantFragmentDoc}
${ProductErrorWithAttributesFragmentDoc}`;
export type VariantUpdateMutationFn = Apollo.MutationFunction<Types.VariantUpdateMutation, Types.VariantUpdateMutationVariables>;

/**
 * __useVariantUpdateMutation__
 *
 * To run a mutation, you first call `useVariantUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVariantUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [variantUpdateMutation, { data, loading, error }] = useVariantUpdateMutation({
 *   variables: {
 *      addStocks: // value for 'addStocks'
 *      removeStocks: // value for 'removeStocks'
 *      id: // value for 'id'
 *      attributes: // value for 'attributes'
 *      sku: // value for 'sku'
 *      quantityLimitPerCustomer: // value for 'quantityLimitPerCustomer'
 *      trackInventory: // value for 'trackInventory'
 *      stocks: // value for 'stocks'
 *      preorder: // value for 'preorder'
 *      weight: // value for 'weight'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useVariantUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VariantUpdateMutation, Types.VariantUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VariantUpdateMutation, Types.VariantUpdateMutationVariables>(VariantUpdateDocument, options);
      }
export type VariantUpdateMutationHookResult = ReturnType<typeof useVariantUpdateMutation>;
export type VariantUpdateMutationResult = Apollo.MutationResult<Types.VariantUpdateMutation>;
export type VariantUpdateMutationOptions = Apollo.BaseMutationOptions<Types.VariantUpdateMutation, Types.VariantUpdateMutationVariables>;
export const VariantCreateDocument = gql`
    mutation VariantCreate($input: ProductVariantCreateInput!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  productVariantCreate(input: $input) {
    errors {
      ...ProductErrorWithAttributes
    }
    productVariant {
      ...ProductVariant
    }
  }
}
    ${ProductErrorWithAttributesFragmentDoc}
${ProductVariantFragmentDoc}`;
export type VariantCreateMutationFn = Apollo.MutationFunction<Types.VariantCreateMutation, Types.VariantCreateMutationVariables>;

/**
 * __useVariantCreateMutation__
 *
 * To run a mutation, you first call `useVariantCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVariantCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [variantCreateMutation, { data, loading, error }] = useVariantCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useVariantCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VariantCreateMutation, Types.VariantCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VariantCreateMutation, Types.VariantCreateMutationVariables>(VariantCreateDocument, options);
      }
export type VariantCreateMutationHookResult = ReturnType<typeof useVariantCreateMutation>;
export type VariantCreateMutationResult = Apollo.MutationResult<Types.VariantCreateMutation>;
export type VariantCreateMutationOptions = Apollo.BaseMutationOptions<Types.VariantCreateMutation, Types.VariantCreateMutationVariables>;
export const ProductMediaDeleteDocument = gql`
    mutation ProductMediaDelete($id: ID!) {
  productMediaDelete(id: $id) {
    errors {
      ...ProductError
    }
    product {
      id
      media {
        id
      }
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type ProductMediaDeleteMutationFn = Apollo.MutationFunction<Types.ProductMediaDeleteMutation, Types.ProductMediaDeleteMutationVariables>;

/**
 * __useProductMediaDeleteMutation__
 *
 * To run a mutation, you first call `useProductMediaDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductMediaDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productMediaDeleteMutation, { data, loading, error }] = useProductMediaDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductMediaDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductMediaDeleteMutation, Types.ProductMediaDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductMediaDeleteMutation, Types.ProductMediaDeleteMutationVariables>(ProductMediaDeleteDocument, options);
      }
export type ProductMediaDeleteMutationHookResult = ReturnType<typeof useProductMediaDeleteMutation>;
export type ProductMediaDeleteMutationResult = Apollo.MutationResult<Types.ProductMediaDeleteMutation>;
export type ProductMediaDeleteMutationOptions = Apollo.BaseMutationOptions<Types.ProductMediaDeleteMutation, Types.ProductMediaDeleteMutationVariables>;
export const ProductMediaUpdateDocument = gql`
    mutation ProductMediaUpdate($id: ID!, $alt: String!) {
  productMediaUpdate(id: $id, input: {alt: $alt}) {
    errors {
      ...ProductError
    }
    product {
      id
      media {
        ...ProductMedia
      }
    }
  }
}
    ${ProductErrorFragmentDoc}
${ProductMediaFragmentDoc}`;
export type ProductMediaUpdateMutationFn = Apollo.MutationFunction<Types.ProductMediaUpdateMutation, Types.ProductMediaUpdateMutationVariables>;

/**
 * __useProductMediaUpdateMutation__
 *
 * To run a mutation, you first call `useProductMediaUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductMediaUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productMediaUpdateMutation, { data, loading, error }] = useProductMediaUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      alt: // value for 'alt'
 *   },
 * });
 */
export function useProductMediaUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductMediaUpdateMutation, Types.ProductMediaUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductMediaUpdateMutation, Types.ProductMediaUpdateMutationVariables>(ProductMediaUpdateDocument, options);
      }
export type ProductMediaUpdateMutationHookResult = ReturnType<typeof useProductMediaUpdateMutation>;
export type ProductMediaUpdateMutationResult = Apollo.MutationResult<Types.ProductMediaUpdateMutation>;
export type ProductMediaUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ProductMediaUpdateMutation, Types.ProductMediaUpdateMutationVariables>;
export const VariantMediaAssignDocument = gql`
    mutation VariantMediaAssign($variantId: ID!, $mediaId: ID!) {
  variantMediaAssign(variantId: $variantId, mediaId: $mediaId) {
    errors {
      ...ProductError
    }
    productVariant {
      id
      media {
        ...ProductMedia
      }
      product {
        id
        media {
          ...ProductMedia
        }
        variants {
          id
          name
          sku
          media {
            ...ProductMedia
          }
        }
      }
    }
  }
}
    ${ProductErrorFragmentDoc}
${ProductMediaFragmentDoc}`;
export type VariantMediaAssignMutationFn = Apollo.MutationFunction<Types.VariantMediaAssignMutation, Types.VariantMediaAssignMutationVariables>;

/**
 * __useVariantMediaAssignMutation__
 *
 * To run a mutation, you first call `useVariantMediaAssignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVariantMediaAssignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [variantMediaAssignMutation, { data, loading, error }] = useVariantMediaAssignMutation({
 *   variables: {
 *      variantId: // value for 'variantId'
 *      mediaId: // value for 'mediaId'
 *   },
 * });
 */
export function useVariantMediaAssignMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VariantMediaAssignMutation, Types.VariantMediaAssignMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VariantMediaAssignMutation, Types.VariantMediaAssignMutationVariables>(VariantMediaAssignDocument, options);
      }
export type VariantMediaAssignMutationHookResult = ReturnType<typeof useVariantMediaAssignMutation>;
export type VariantMediaAssignMutationResult = Apollo.MutationResult<Types.VariantMediaAssignMutation>;
export type VariantMediaAssignMutationOptions = Apollo.BaseMutationOptions<Types.VariantMediaAssignMutation, Types.VariantMediaAssignMutationVariables>;
export const VariantMediaUnassignDocument = gql`
    mutation VariantMediaUnassign($variantId: ID!, $mediaId: ID!) {
  variantMediaUnassign(variantId: $variantId, mediaId: $mediaId) {
    errors {
      ...ProductError
    }
    productVariant {
      id
      media {
        ...ProductMedia
      }
      product {
        id
        media {
          ...ProductMedia
        }
        variants {
          id
          name
          sku
          media {
            ...ProductMedia
          }
        }
      }
    }
  }
}
    ${ProductErrorFragmentDoc}
${ProductMediaFragmentDoc}`;
export type VariantMediaUnassignMutationFn = Apollo.MutationFunction<Types.VariantMediaUnassignMutation, Types.VariantMediaUnassignMutationVariables>;

/**
 * __useVariantMediaUnassignMutation__
 *
 * To run a mutation, you first call `useVariantMediaUnassignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVariantMediaUnassignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [variantMediaUnassignMutation, { data, loading, error }] = useVariantMediaUnassignMutation({
 *   variables: {
 *      variantId: // value for 'variantId'
 *      mediaId: // value for 'mediaId'
 *   },
 * });
 */
export function useVariantMediaUnassignMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.VariantMediaUnassignMutation, Types.VariantMediaUnassignMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.VariantMediaUnassignMutation, Types.VariantMediaUnassignMutationVariables>(VariantMediaUnassignDocument, options);
      }
export type VariantMediaUnassignMutationHookResult = ReturnType<typeof useVariantMediaUnassignMutation>;
export type VariantMediaUnassignMutationResult = Apollo.MutationResult<Types.VariantMediaUnassignMutation>;
export type VariantMediaUnassignMutationOptions = Apollo.BaseMutationOptions<Types.VariantMediaUnassignMutation, Types.VariantMediaUnassignMutationVariables>;
export const ProductBulkDeleteDocument = gql`
    mutation productBulkDelete($ids: [ID!]!) {
  productBulkDelete(ids: $ids) {
    errors {
      ...ProductError
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type ProductBulkDeleteMutationFn = Apollo.MutationFunction<Types.ProductBulkDeleteMutation, Types.ProductBulkDeleteMutationVariables>;

/**
 * __useProductBulkDeleteMutation__
 *
 * To run a mutation, you first call `useProductBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productBulkDeleteMutation, { data, loading, error }] = useProductBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useProductBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductBulkDeleteMutation, Types.ProductBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductBulkDeleteMutation, Types.ProductBulkDeleteMutationVariables>(ProductBulkDeleteDocument, options);
      }
export type ProductBulkDeleteMutationHookResult = ReturnType<typeof useProductBulkDeleteMutation>;
export type ProductBulkDeleteMutationResult = Apollo.MutationResult<Types.ProductBulkDeleteMutation>;
export type ProductBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.ProductBulkDeleteMutation, Types.ProductBulkDeleteMutationVariables>;
export const ProductVariantBulkCreateDocument = gql`
    mutation ProductVariantBulkCreate($id: ID!, $inputs: [ProductVariantBulkCreateInput!]!) {
  productVariantBulkCreate(product: $id, variants: $inputs) {
    errors {
      ...BulkProductError
    }
    productVariants {
      id
    }
  }
}
    ${BulkProductErrorFragmentDoc}`;
export type ProductVariantBulkCreateMutationFn = Apollo.MutationFunction<Types.ProductVariantBulkCreateMutation, Types.ProductVariantBulkCreateMutationVariables>;

/**
 * __useProductVariantBulkCreateMutation__
 *
 * To run a mutation, you first call `useProductVariantBulkCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductVariantBulkCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productVariantBulkCreateMutation, { data, loading, error }] = useProductVariantBulkCreateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      inputs: // value for 'inputs'
 *   },
 * });
 */
export function useProductVariantBulkCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductVariantBulkCreateMutation, Types.ProductVariantBulkCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductVariantBulkCreateMutation, Types.ProductVariantBulkCreateMutationVariables>(ProductVariantBulkCreateDocument, options);
      }
export type ProductVariantBulkCreateMutationHookResult = ReturnType<typeof useProductVariantBulkCreateMutation>;
export type ProductVariantBulkCreateMutationResult = Apollo.MutationResult<Types.ProductVariantBulkCreateMutation>;
export type ProductVariantBulkCreateMutationOptions = Apollo.BaseMutationOptions<Types.ProductVariantBulkCreateMutation, Types.ProductVariantBulkCreateMutationVariables>;
export const ProductVariantBulkDeleteDocument = gql`
    mutation ProductVariantBulkDelete($ids: [ID!]!) {
  productVariantBulkDelete(ids: $ids) {
    errors {
      ...ProductError
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type ProductVariantBulkDeleteMutationFn = Apollo.MutationFunction<Types.ProductVariantBulkDeleteMutation, Types.ProductVariantBulkDeleteMutationVariables>;

/**
 * __useProductVariantBulkDeleteMutation__
 *
 * To run a mutation, you first call `useProductVariantBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductVariantBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productVariantBulkDeleteMutation, { data, loading, error }] = useProductVariantBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useProductVariantBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductVariantBulkDeleteMutation, Types.ProductVariantBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductVariantBulkDeleteMutation, Types.ProductVariantBulkDeleteMutationVariables>(ProductVariantBulkDeleteDocument, options);
      }
export type ProductVariantBulkDeleteMutationHookResult = ReturnType<typeof useProductVariantBulkDeleteMutation>;
export type ProductVariantBulkDeleteMutationResult = Apollo.MutationResult<Types.ProductVariantBulkDeleteMutation>;
export type ProductVariantBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.ProductVariantBulkDeleteMutation, Types.ProductVariantBulkDeleteMutationVariables>;
export const ProductExportDocument = gql`
    mutation ProductExport($input: ExportProductsInput!) {
  exportProducts(input: $input) {
    exportFile {
      ...ExportFile
    }
    errors {
      ...ExportError
    }
  }
}
    ${ExportFileFragmentDoc}
${ExportErrorFragmentDoc}`;
export type ProductExportMutationFn = Apollo.MutationFunction<Types.ProductExportMutation, Types.ProductExportMutationVariables>;

/**
 * __useProductExportMutation__
 *
 * To run a mutation, you first call `useProductExportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductExportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productExportMutation, { data, loading, error }] = useProductExportMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProductExportMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductExportMutation, Types.ProductExportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductExportMutation, Types.ProductExportMutationVariables>(ProductExportDocument, options);
      }
export type ProductExportMutationHookResult = ReturnType<typeof useProductExportMutation>;
export type ProductExportMutationResult = Apollo.MutationResult<Types.ProductExportMutation>;
export type ProductExportMutationOptions = Apollo.BaseMutationOptions<Types.ProductExportMutation, Types.ProductExportMutationVariables>;
export const ProductChannelListingUpdateDocument = gql`
    mutation ProductChannelListingUpdate($id: ID!, $input: ProductChannelListingUpdateInput!) {
  productChannelListingUpdate(id: $id, input: $input) {
    errors {
      ...ProductChannelListingError
    }
  }
}
    ${ProductChannelListingErrorFragmentDoc}`;
export type ProductChannelListingUpdateMutationFn = Apollo.MutationFunction<Types.ProductChannelListingUpdateMutation, Types.ProductChannelListingUpdateMutationVariables>;

/**
 * __useProductChannelListingUpdateMutation__
 *
 * To run a mutation, you first call `useProductChannelListingUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductChannelListingUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productChannelListingUpdateMutation, { data, loading, error }] = useProductChannelListingUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProductChannelListingUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductChannelListingUpdateMutation, Types.ProductChannelListingUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductChannelListingUpdateMutation, Types.ProductChannelListingUpdateMutationVariables>(ProductChannelListingUpdateDocument, options);
      }
export type ProductChannelListingUpdateMutationHookResult = ReturnType<typeof useProductChannelListingUpdateMutation>;
export type ProductChannelListingUpdateMutationResult = Apollo.MutationResult<Types.ProductChannelListingUpdateMutation>;
export type ProductChannelListingUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ProductChannelListingUpdateMutation, Types.ProductChannelListingUpdateMutationVariables>;
export const ProductVariantReorderDocument = gql`
    mutation ProductVariantReorder($move: ReorderInput!, $productId: ID!) {
  productVariantReorder(moves: [$move], productId: $productId) {
    errors {
      ...ProductError
    }
    product {
      id
      variants {
        id
      }
    }
  }
}
    ${ProductErrorFragmentDoc}`;
export type ProductVariantReorderMutationFn = Apollo.MutationFunction<Types.ProductVariantReorderMutation, Types.ProductVariantReorderMutationVariables>;

/**
 * __useProductVariantReorderMutation__
 *
 * To run a mutation, you first call `useProductVariantReorderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductVariantReorderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productVariantReorderMutation, { data, loading, error }] = useProductVariantReorderMutation({
 *   variables: {
 *      move: // value for 'move'
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useProductVariantReorderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductVariantReorderMutation, Types.ProductVariantReorderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductVariantReorderMutation, Types.ProductVariantReorderMutationVariables>(ProductVariantReorderDocument, options);
      }
export type ProductVariantReorderMutationHookResult = ReturnType<typeof useProductVariantReorderMutation>;
export type ProductVariantReorderMutationResult = Apollo.MutationResult<Types.ProductVariantReorderMutation>;
export type ProductVariantReorderMutationOptions = Apollo.BaseMutationOptions<Types.ProductVariantReorderMutation, Types.ProductVariantReorderMutationVariables>;
export const ProductVariantChannelListingUpdateDocument = gql`
    mutation ProductVariantChannelListingUpdate($id: ID!, $input: [ProductVariantChannelListingAddInput!]!) {
  productVariantChannelListingUpdate(id: $id, input: $input) {
    variant {
      id
      channelListings {
        ...ChannelListingProductVariant
      }
      product {
        id
        channelListings {
          ...ChannelListingProductWithoutPricing
        }
      }
    }
    errors {
      ...ProductChannelListingError
    }
  }
}
    ${ChannelListingProductVariantFragmentDoc}
${ChannelListingProductWithoutPricingFragmentDoc}
${ProductChannelListingErrorFragmentDoc}`;
export type ProductVariantChannelListingUpdateMutationFn = Apollo.MutationFunction<Types.ProductVariantChannelListingUpdateMutation, Types.ProductVariantChannelListingUpdateMutationVariables>;

/**
 * __useProductVariantChannelListingUpdateMutation__
 *
 * To run a mutation, you first call `useProductVariantChannelListingUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductVariantChannelListingUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productVariantChannelListingUpdateMutation, { data, loading, error }] = useProductVariantChannelListingUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProductVariantChannelListingUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductVariantChannelListingUpdateMutation, Types.ProductVariantChannelListingUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductVariantChannelListingUpdateMutation, Types.ProductVariantChannelListingUpdateMutationVariables>(ProductVariantChannelListingUpdateDocument, options);
      }
export type ProductVariantChannelListingUpdateMutationHookResult = ReturnType<typeof useProductVariantChannelListingUpdateMutation>;
export type ProductVariantChannelListingUpdateMutationResult = Apollo.MutationResult<Types.ProductVariantChannelListingUpdateMutation>;
export type ProductVariantChannelListingUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ProductVariantChannelListingUpdateMutation, Types.ProductVariantChannelListingUpdateMutationVariables>;
export const ProductVariantPreorderDeactivateDocument = gql`
    mutation ProductVariantPreorderDeactivate($id: ID!) {
  productVariantPreorderDeactivate(id: $id) {
    productVariant {
      id
      preorder {
        ...Preorder
      }
    }
    errors {
      ...ProductError
    }
  }
}
    ${PreorderFragmentDoc}
${ProductErrorFragmentDoc}`;
export type ProductVariantPreorderDeactivateMutationFn = Apollo.MutationFunction<Types.ProductVariantPreorderDeactivateMutation, Types.ProductVariantPreorderDeactivateMutationVariables>;

/**
 * __useProductVariantPreorderDeactivateMutation__
 *
 * To run a mutation, you first call `useProductVariantPreorderDeactivateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductVariantPreorderDeactivateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productVariantPreorderDeactivateMutation, { data, loading, error }] = useProductVariantPreorderDeactivateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductVariantPreorderDeactivateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductVariantPreorderDeactivateMutation, Types.ProductVariantPreorderDeactivateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductVariantPreorderDeactivateMutation, Types.ProductVariantPreorderDeactivateMutationVariables>(ProductVariantPreorderDeactivateDocument, options);
      }
export type ProductVariantPreorderDeactivateMutationHookResult = ReturnType<typeof useProductVariantPreorderDeactivateMutation>;
export type ProductVariantPreorderDeactivateMutationResult = Apollo.MutationResult<Types.ProductVariantPreorderDeactivateMutation>;
export type ProductVariantPreorderDeactivateMutationOptions = Apollo.BaseMutationOptions<Types.ProductVariantPreorderDeactivateMutation, Types.ProductVariantPreorderDeactivateMutationVariables>;
export const ProductVariantBulkUpdateDocument = gql`
    mutation ProductVariantBulkUpdate($product: ID!, $input: [ProductVariantBulkUpdateInput!]!, $errorPolicy: ErrorPolicyEnum) {
  productVariantBulkUpdate(
    errorPolicy: $errorPolicy
    product: $product
    variants: $input
  ) {
    errors {
      ...ProductVariantBulkError
    }
    results {
      errors {
        ...ProductVariantBulkError
      }
    }
  }
}
    ${ProductVariantBulkErrorFragmentDoc}`;
export type ProductVariantBulkUpdateMutationFn = Apollo.MutationFunction<Types.ProductVariantBulkUpdateMutation, Types.ProductVariantBulkUpdateMutationVariables>;

/**
 * __useProductVariantBulkUpdateMutation__
 *
 * To run a mutation, you first call `useProductVariantBulkUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductVariantBulkUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productVariantBulkUpdateMutation, { data, loading, error }] = useProductVariantBulkUpdateMutation({
 *   variables: {
 *      product: // value for 'product'
 *      input: // value for 'input'
 *      errorPolicy: // value for 'errorPolicy'
 *   },
 * });
 */
export function useProductVariantBulkUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ProductVariantBulkUpdateMutation, Types.ProductVariantBulkUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ProductVariantBulkUpdateMutation, Types.ProductVariantBulkUpdateMutationVariables>(ProductVariantBulkUpdateDocument, options);
      }
export type ProductVariantBulkUpdateMutationHookResult = ReturnType<typeof useProductVariantBulkUpdateMutation>;
export type ProductVariantBulkUpdateMutationResult = Apollo.MutationResult<Types.ProductVariantBulkUpdateMutation>;
export type ProductVariantBulkUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ProductVariantBulkUpdateMutation, Types.ProductVariantBulkUpdateMutationVariables>;
export const ProductListDocument = gql`
    query ProductList($first: Int, $after: String, $last: Int, $before: String, $filter: ProductFilterInput, $search: String, $where: ProductWhereInput, $channel: String, $sort: ProductOrder, $hasChannel: Boolean!, $includeCategories: Boolean!, $includeCollections: Boolean!) {
  products(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
    search: $search
    where: $where
    sortBy: $sort
    channel: $channel
  ) {
    edges {
      node {
        ...ProductWithChannelListings
        updatedAt
        created
        description
        attributes {
          ...ProductListAttribute
        }
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
  }
}
    ${ProductWithChannelListingsFragmentDoc}
${ProductListAttributeFragmentDoc}`;

/**
 * __useProductListQuery__
 *
 * To run a query within a React component, call `useProductListQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      search: // value for 'search'
 *      where: // value for 'where'
 *      channel: // value for 'channel'
 *      sort: // value for 'sort'
 *      hasChannel: // value for 'hasChannel'
 *      includeCategories: // value for 'includeCategories'
 *      includeCollections: // value for 'includeCollections'
 *   },
 * });
 */
export function useProductListQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductListQuery, Types.ProductListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductListQuery, Types.ProductListQueryVariables>(ProductListDocument, options);
      }
export function useProductListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductListQuery, Types.ProductListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductListQuery, Types.ProductListQueryVariables>(ProductListDocument, options);
        }
export type ProductListQueryHookResult = ReturnType<typeof useProductListQuery>;
export type ProductListLazyQueryHookResult = ReturnType<typeof useProductListLazyQuery>;
export type ProductListQueryResult = Apollo.QueryResult<Types.ProductListQuery, Types.ProductListQueryVariables>;
export const ProductCountDocument = gql`
    query ProductCount($filter: ProductFilterInput, $channel: String) {
  products(filter: $filter, channel: $channel) {
    totalCount
  }
}
    `;

/**
 * __useProductCountQuery__
 *
 * To run a query within a React component, call `useProductCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductCountQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useProductCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ProductCountQuery, Types.ProductCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductCountQuery, Types.ProductCountQueryVariables>(ProductCountDocument, options);
      }
export function useProductCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductCountQuery, Types.ProductCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductCountQuery, Types.ProductCountQueryVariables>(ProductCountDocument, options);
        }
export type ProductCountQueryHookResult = ReturnType<typeof useProductCountQuery>;
export type ProductCountLazyQueryHookResult = ReturnType<typeof useProductCountLazyQuery>;
export type ProductCountQueryResult = Apollo.QueryResult<Types.ProductCountQuery, Types.ProductCountQueryVariables>;
export const ProductDetailsDocument = gql`
    query ProductDetails($id: ID!, $channel: String, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  product(id: $id, channel: $channel) {
    ...Product
    category {
      ...CategoryWithAncestors
    }
  }
}
    ${ProductFragmentDoc}
${CategoryWithAncestorsFragmentDoc}`;

/**
 * __useProductDetailsQuery__
 *
 * To run a query within a React component, call `useProductDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductDetailsQuery({
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
export function useProductDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductDetailsQuery, Types.ProductDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductDetailsQuery, Types.ProductDetailsQueryVariables>(ProductDetailsDocument, options);
      }
export function useProductDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductDetailsQuery, Types.ProductDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductDetailsQuery, Types.ProductDetailsQueryVariables>(ProductDetailsDocument, options);
        }
export type ProductDetailsQueryHookResult = ReturnType<typeof useProductDetailsQuery>;
export type ProductDetailsLazyQueryHookResult = ReturnType<typeof useProductDetailsLazyQuery>;
export type ProductDetailsQueryResult = Apollo.QueryResult<Types.ProductDetailsQuery, Types.ProductDetailsQueryVariables>;
export const ProductTypeDocument = gql`
    query ProductType($id: ID!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  productType(id: $id) {
    id
    name
    hasVariants
    productAttributes {
      ...AttributeDetails
    }
    taxClass {
      id
      name
    }
  }
}
    ${AttributeDetailsFragmentDoc}`;

/**
 * __useProductTypeQuery__
 *
 * To run a query within a React component, call `useProductTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductTypeQuery({
 *   variables: {
 *      id: // value for 'id'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useProductTypeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductTypeQuery, Types.ProductTypeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductTypeQuery, Types.ProductTypeQueryVariables>(ProductTypeDocument, options);
      }
export function useProductTypeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductTypeQuery, Types.ProductTypeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductTypeQuery, Types.ProductTypeQueryVariables>(ProductTypeDocument, options);
        }
export type ProductTypeQueryHookResult = ReturnType<typeof useProductTypeQuery>;
export type ProductTypeLazyQueryHookResult = ReturnType<typeof useProductTypeLazyQuery>;
export type ProductTypeQueryResult = Apollo.QueryResult<Types.ProductTypeQuery, Types.ProductTypeQueryVariables>;
export const ProductVariantDetailsDocument = gql`
    query ProductVariantDetails($id: ID!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  productVariant(id: $id) {
    ...ProductVariant
  }
}
    ${ProductVariantFragmentDoc}`;

/**
 * __useProductVariantDetailsQuery__
 *
 * To run a query within a React component, call `useProductVariantDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductVariantDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductVariantDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useProductVariantDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductVariantDetailsQuery, Types.ProductVariantDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductVariantDetailsQuery, Types.ProductVariantDetailsQueryVariables>(ProductVariantDetailsDocument, options);
      }
export function useProductVariantDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductVariantDetailsQuery, Types.ProductVariantDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductVariantDetailsQuery, Types.ProductVariantDetailsQueryVariables>(ProductVariantDetailsDocument, options);
        }
export type ProductVariantDetailsQueryHookResult = ReturnType<typeof useProductVariantDetailsQuery>;
export type ProductVariantDetailsLazyQueryHookResult = ReturnType<typeof useProductVariantDetailsLazyQuery>;
export type ProductVariantDetailsQueryResult = Apollo.QueryResult<Types.ProductVariantDetailsQuery, Types.ProductVariantDetailsQueryVariables>;
export const ProductVariantCreateDataDocument = gql`
    query ProductVariantCreateData($id: ID!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  product(id: $id) {
    id
    media {
      id
      sortOrder
      url
    }
    channelListings {
      isPublished
      publishedAt
      channel {
        id
        name
        currencyCode
      }
    }
    name
    productType {
      id
      selectionVariantAttributes: variantAttributes(
        variantSelection: VARIANT_SELECTION
      ) {
        ...VariantAttribute
      }
      nonSelectionVariantAttributes: variantAttributes(
        variantSelection: NOT_VARIANT_SELECTION
      ) {
        ...VariantAttribute
      }
    }
    thumbnail {
      url
    }
    defaultVariant {
      id
    }
    variants {
      id
      name
      sku
      media {
        id
        url
        type
      }
    }
  }
}
    ${VariantAttributeFragmentDoc}`;

/**
 * __useProductVariantCreateDataQuery__
 *
 * To run a query within a React component, call `useProductVariantCreateDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductVariantCreateDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductVariantCreateDataQuery({
 *   variables: {
 *      id: // value for 'id'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useProductVariantCreateDataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductVariantCreateDataQuery, Types.ProductVariantCreateDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductVariantCreateDataQuery, Types.ProductVariantCreateDataQueryVariables>(ProductVariantCreateDataDocument, options);
      }
export function useProductVariantCreateDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductVariantCreateDataQuery, Types.ProductVariantCreateDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductVariantCreateDataQuery, Types.ProductVariantCreateDataQueryVariables>(ProductVariantCreateDataDocument, options);
        }
export type ProductVariantCreateDataQueryHookResult = ReturnType<typeof useProductVariantCreateDataQuery>;
export type ProductVariantCreateDataLazyQueryHookResult = ReturnType<typeof useProductVariantCreateDataLazyQuery>;
export type ProductVariantCreateDataQueryResult = Apollo.QueryResult<Types.ProductVariantCreateDataQuery, Types.ProductVariantCreateDataQueryVariables>;
export const ProductMediaByIdDocument = gql`
    query ProductMediaById($productId: ID!, $mediaId: ID!) {
  product(id: $productId) {
    id
    name
    mainImage: mediaById(id: $mediaId) {
      id
      alt
      url
      type
      oembedData
    }
    media {
      id
      url(size: 48)
      alt
      type
      oembedData
    }
  }
}
    `;

/**
 * __useProductMediaByIdQuery__
 *
 * To run a query within a React component, call `useProductMediaByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductMediaByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductMediaByIdQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *      mediaId: // value for 'mediaId'
 *   },
 * });
 */
export function useProductMediaByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductMediaByIdQuery, Types.ProductMediaByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductMediaByIdQuery, Types.ProductMediaByIdQueryVariables>(ProductMediaByIdDocument, options);
      }
export function useProductMediaByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductMediaByIdQuery, Types.ProductMediaByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductMediaByIdQuery, Types.ProductMediaByIdQueryVariables>(ProductMediaByIdDocument, options);
        }
export type ProductMediaByIdQueryHookResult = ReturnType<typeof useProductMediaByIdQuery>;
export type ProductMediaByIdLazyQueryHookResult = ReturnType<typeof useProductMediaByIdLazyQuery>;
export type ProductMediaByIdQueryResult = Apollo.QueryResult<Types.ProductMediaByIdQuery, Types.ProductMediaByIdQueryVariables>;
export const GridAttributesDocument = gql`
    query GridAttributes($ids: [ID!]!, $hasAttributes: Boolean!, $type: AttributeTypeEnum!) {
  availableAttributes: attributes(first: 10, filter: {type: $type}) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
  selectedAttributes: attributes(first: 25, filter: {ids: $ids}) @include(if: $hasAttributes) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useGridAttributesQuery__
 *
 * To run a query within a React component, call `useGridAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGridAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGridAttributesQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *      hasAttributes: // value for 'hasAttributes'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGridAttributesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.GridAttributesQuery, Types.GridAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GridAttributesQuery, Types.GridAttributesQueryVariables>(GridAttributesDocument, options);
      }
export function useGridAttributesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GridAttributesQuery, Types.GridAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GridAttributesQuery, Types.GridAttributesQueryVariables>(GridAttributesDocument, options);
        }
export type GridAttributesQueryHookResult = ReturnType<typeof useGridAttributesQuery>;
export type GridAttributesLazyQueryHookResult = ReturnType<typeof useGridAttributesLazyQuery>;
export type GridAttributesQueryResult = Apollo.QueryResult<Types.GridAttributesQuery, Types.GridAttributesQueryVariables>;
export const AvailableColumnAttributesDocument = gql`
    query AvailableColumnAttributes($search: String!, $type: AttributeTypeEnum!, $before: String, $after: String, $first: Int, $last: Int) {
  attributes(
    filter: {search: $search, type: $type}
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useAvailableColumnAttributesQuery__
 *
 * To run a query within a React component, call `useAvailableColumnAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableColumnAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableColumnAttributesQuery({
 *   variables: {
 *      search: // value for 'search'
 *      type: // value for 'type'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useAvailableColumnAttributesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AvailableColumnAttributesQuery, Types.AvailableColumnAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AvailableColumnAttributesQuery, Types.AvailableColumnAttributesQueryVariables>(AvailableColumnAttributesDocument, options);
      }
export function useAvailableColumnAttributesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AvailableColumnAttributesQuery, Types.AvailableColumnAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AvailableColumnAttributesQuery, Types.AvailableColumnAttributesQueryVariables>(AvailableColumnAttributesDocument, options);
        }
export type AvailableColumnAttributesQueryHookResult = ReturnType<typeof useAvailableColumnAttributesQuery>;
export type AvailableColumnAttributesLazyQueryHookResult = ReturnType<typeof useAvailableColumnAttributesLazyQuery>;
export type AvailableColumnAttributesQueryResult = Apollo.QueryResult<Types.AvailableColumnAttributesQuery, Types.AvailableColumnAttributesQueryVariables>;
export const GridWarehousesDocument = gql`
    query GridWarehouses($ids: [ID!]!, $hasWarehouses: Boolean!) {
  availableWarehouses: warehouses(first: 10) {
    edges {
      node {
        ...Warehouse
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
  selectedWarehouses: warehouses(first: 100, filter: {ids: $ids}) @include(if: $hasWarehouses) {
    edges {
      node {
        ...Warehouse
      }
    }
  }
}
    ${WarehouseFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useGridWarehousesQuery__
 *
 * To run a query within a React component, call `useGridWarehousesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGridWarehousesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGridWarehousesQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *      hasWarehouses: // value for 'hasWarehouses'
 *   },
 * });
 */
export function useGridWarehousesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.GridWarehousesQuery, Types.GridWarehousesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GridWarehousesQuery, Types.GridWarehousesQueryVariables>(GridWarehousesDocument, options);
      }
export function useGridWarehousesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GridWarehousesQuery, Types.GridWarehousesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GridWarehousesQuery, Types.GridWarehousesQueryVariables>(GridWarehousesDocument, options);
        }
export type GridWarehousesQueryHookResult = ReturnType<typeof useGridWarehousesQuery>;
export type GridWarehousesLazyQueryHookResult = ReturnType<typeof useGridWarehousesLazyQuery>;
export type GridWarehousesQueryResult = Apollo.QueryResult<Types.GridWarehousesQuery, Types.GridWarehousesQueryVariables>;
export const SetRefundReasonTypeDocument = gql`
    mutation SetRefundReasonType($modelTypeId: ID!) {
  refundSettingsUpdate(input: {refundReasonReferenceType: $modelTypeId}) {
    refundSettings {
      reasonReferenceType {
        id
        name
      }
    }
    errors {
      message
      code
    }
  }
}
    `;
export type SetRefundReasonTypeMutationFn = Apollo.MutationFunction<Types.SetRefundReasonTypeMutation, Types.SetRefundReasonTypeMutationVariables>;

/**
 * __useSetRefundReasonTypeMutation__
 *
 * To run a mutation, you first call `useSetRefundReasonTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetRefundReasonTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setRefundReasonTypeMutation, { data, loading, error }] = useSetRefundReasonTypeMutation({
 *   variables: {
 *      modelTypeId: // value for 'modelTypeId'
 *   },
 * });
 */
export function useSetRefundReasonTypeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.SetRefundReasonTypeMutation, Types.SetRefundReasonTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.SetRefundReasonTypeMutation, Types.SetRefundReasonTypeMutationVariables>(SetRefundReasonTypeDocument, options);
      }
export type SetRefundReasonTypeMutationHookResult = ReturnType<typeof useSetRefundReasonTypeMutation>;
export type SetRefundReasonTypeMutationResult = Apollo.MutationResult<Types.SetRefundReasonTypeMutation>;
export type SetRefundReasonTypeMutationOptions = Apollo.BaseMutationOptions<Types.SetRefundReasonTypeMutation, Types.SetRefundReasonTypeMutationVariables>;
export const ClearRefundReasonTypeDocument = gql`
    mutation ClearRefundReasonType {
  refundReasonReferenceClear {
    errors {
      message
      code
    }
    refundSettings {
      reasonReferenceType {
        id
        name
      }
    }
  }
}
    `;
export type ClearRefundReasonTypeMutationFn = Apollo.MutationFunction<Types.ClearRefundReasonTypeMutation, Types.ClearRefundReasonTypeMutationVariables>;

/**
 * __useClearRefundReasonTypeMutation__
 *
 * To run a mutation, you first call `useClearRefundReasonTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearRefundReasonTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearRefundReasonTypeMutation, { data, loading, error }] = useClearRefundReasonTypeMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearRefundReasonTypeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ClearRefundReasonTypeMutation, Types.ClearRefundReasonTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ClearRefundReasonTypeMutation, Types.ClearRefundReasonTypeMutationVariables>(ClearRefundReasonTypeDocument, options);
      }
export type ClearRefundReasonTypeMutationHookResult = ReturnType<typeof useClearRefundReasonTypeMutation>;
export type ClearRefundReasonTypeMutationResult = Apollo.MutationResult<Types.ClearRefundReasonTypeMutation>;
export type ClearRefundReasonTypeMutationOptions = Apollo.BaseMutationOptions<Types.ClearRefundReasonTypeMutation, Types.ClearRefundReasonTypeMutationVariables>;
export const RefundsSettingsDocument = gql`
    query RefundsSettings {
  refundSettings {
    reasonReferenceType {
      id
      name
    }
  }
}
    `;

/**
 * __useRefundsSettingsQuery__
 *
 * To run a query within a React component, call `useRefundsSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRefundsSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRefundsSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRefundsSettingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.RefundsSettingsQuery, Types.RefundsSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.RefundsSettingsQuery, Types.RefundsSettingsQueryVariables>(RefundsSettingsDocument, options);
      }
export function useRefundsSettingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.RefundsSettingsQuery, Types.RefundsSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.RefundsSettingsQuery, Types.RefundsSettingsQueryVariables>(RefundsSettingsDocument, options);
        }
export type RefundsSettingsQueryHookResult = ReturnType<typeof useRefundsSettingsQuery>;
export type RefundsSettingsLazyQueryHookResult = ReturnType<typeof useRefundsSettingsLazyQuery>;
export type RefundsSettingsQueryResult = Apollo.QueryResult<Types.RefundsSettingsQuery, Types.RefundsSettingsQueryVariables>;
export const ModelTypesDocument = gql`
    query ModelTypes {
  pageTypes(first: 100, sortBy: {field: NAME, direction: ASC}) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useModelTypesQuery__
 *
 * To run a query within a React component, call `useModelTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useModelTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModelTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useModelTypesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ModelTypesQuery, Types.ModelTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ModelTypesQuery, Types.ModelTypesQueryVariables>(ModelTypesDocument, options);
      }
export function useModelTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ModelTypesQuery, Types.ModelTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ModelTypesQuery, Types.ModelTypesQueryVariables>(ModelTypesDocument, options);
        }
export type ModelTypesQueryHookResult = ReturnType<typeof useModelTypesQuery>;
export type ModelTypesLazyQueryHookResult = ReturnType<typeof useModelTypesLazyQuery>;
export type ModelTypesQueryResult = Apollo.QueryResult<Types.ModelTypesQuery, Types.ModelTypesQueryVariables>;
export const GlobalSearchDocument = gql`
    query GlobalSearch($query: String!, $includeOrders: Boolean!, $includeCategories: Boolean!, $includeCollections: Boolean!, $includeProducts: Boolean!, $includeVariants: Boolean!, $includeModels: Boolean!, $includeModelTypes: Boolean!) {
  orders(first: 10, filter: {search: $query}) @include(if: $includeOrders) {
    edges {
      node {
        id
        number
        status
        updatedAt
        paymentStatus
        chargeStatus
        total {
          gross {
            amount
            currency
          }
        }
      }
    }
  }
  categories(first: 10, filter: {search: $query}) @include(if: $includeCategories) {
    edges {
      node {
        id
        name
        updatedAt
        backgroundImage(size: 64) {
          url
          alt
        }
        products(first: 1) {
          totalCount
        }
        parent {
          id
          name
        }
        level
        ancestors(first: 1) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
  collections(first: 10, filter: {search: $query}) @include(if: $includeCollections) {
    edges {
      node {
        id
        name
        products(first: 1) {
          totalCount
        }
        backgroundImage(size: 64) {
          url
          alt
        }
      }
    }
  }
  products(first: 10, filter: {search: $query}) @include(if: $includeProducts) {
    edges {
      node {
        id
        category {
          name
        }
        name
        updatedAt
        thumbnail(size: 64) {
          alt
          url
        }
      }
    }
  }
  productVariants(first: 10, filter: {search: $query}) @include(if: $includeVariants) {
    edges {
      node {
        id
        name
        sku
        updatedAt
        media {
          alt
          url(size: 64)
        }
        product {
          id
          name
          category {
            name
          }
        }
      }
    }
  }
  models: pages(first: 10, filter: {search: $query}) @include(if: $includeModels) {
    edges {
      node {
        id
        title
        publishedAt
        pageType {
          name
        }
      }
    }
  }
  modelTypes: pageTypes(first: 5, filter: {search: $query}) @include(if: $includeModelTypes) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGlobalSearchQuery__
 *
 * To run a query within a React component, call `useGlobalSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGlobalSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGlobalSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *      includeOrders: // value for 'includeOrders'
 *      includeCategories: // value for 'includeCategories'
 *      includeCollections: // value for 'includeCollections'
 *      includeProducts: // value for 'includeProducts'
 *      includeVariants: // value for 'includeVariants'
 *      includeModels: // value for 'includeModels'
 *      includeModelTypes: // value for 'includeModelTypes'
 *   },
 * });
 */
export function useGlobalSearchQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.GlobalSearchQuery, Types.GlobalSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.GlobalSearchQuery, Types.GlobalSearchQueryVariables>(GlobalSearchDocument, options);
      }
export function useGlobalSearchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.GlobalSearchQuery, Types.GlobalSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.GlobalSearchQuery, Types.GlobalSearchQueryVariables>(GlobalSearchDocument, options);
        }
export type GlobalSearchQueryHookResult = ReturnType<typeof useGlobalSearchQuery>;
export type GlobalSearchLazyQueryHookResult = ReturnType<typeof useGlobalSearchLazyQuery>;
export type GlobalSearchQueryResult = Apollo.QueryResult<Types.GlobalSearchQuery, Types.GlobalSearchQueryVariables>;
export const SearchAttributesDocument = gql`
    query SearchAttributes($after: String, $first: Int!, $query: String!) {
  search: attributes(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchAttributesQuery__
 *
 * To run a query within a React component, call `useSearchAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAttributesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchAttributesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchAttributesQuery, Types.SearchAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchAttributesQuery, Types.SearchAttributesQueryVariables>(SearchAttributesDocument, options);
      }
export function useSearchAttributesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchAttributesQuery, Types.SearchAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchAttributesQuery, Types.SearchAttributesQueryVariables>(SearchAttributesDocument, options);
        }
export type SearchAttributesQueryHookResult = ReturnType<typeof useSearchAttributesQuery>;
export type SearchAttributesLazyQueryHookResult = ReturnType<typeof useSearchAttributesLazyQuery>;
export type SearchAttributesQueryResult = Apollo.QueryResult<Types.SearchAttributesQuery, Types.SearchAttributesQueryVariables>;
export const SearchAttributeValuesDocument = gql`
    query SearchAttributeValues($id: ID, $after: String, $first: Int!, $query: String!) {
  attribute(id: $id) {
    id
    choices(after: $after, first: $first, filter: {search: $query}) {
      edges {
        node {
          ...AttributeValueDetails
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
}
    ${AttributeValueDetailsFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSearchAttributeValuesQuery__
 *
 * To run a query within a React component, call `useSearchAttributeValuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAttributeValuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAttributeValuesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchAttributeValuesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchAttributeValuesQuery, Types.SearchAttributeValuesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchAttributeValuesQuery, Types.SearchAttributeValuesQueryVariables>(SearchAttributeValuesDocument, options);
      }
export function useSearchAttributeValuesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchAttributeValuesQuery, Types.SearchAttributeValuesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchAttributeValuesQuery, Types.SearchAttributeValuesQueryVariables>(SearchAttributeValuesDocument, options);
        }
export type SearchAttributeValuesQueryHookResult = ReturnType<typeof useSearchAttributeValuesQuery>;
export type SearchAttributeValuesLazyQueryHookResult = ReturnType<typeof useSearchAttributeValuesLazyQuery>;
export type SearchAttributeValuesQueryResult = Apollo.QueryResult<Types.SearchAttributeValuesQuery, Types.SearchAttributeValuesQueryVariables>;
export const SearchAvailableInGridAttributesDocument = gql`
    query SearchAvailableInGridAttributes($first: Int!, $after: String, $query: String!) {
  availableInGrid: attributes(
    first: $first
    after: $after
    filter: {isVariantOnly: false, type: PRODUCT_TYPE, search: $query}
  ) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
    totalCount
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchAvailableInGridAttributesQuery__
 *
 * To run a query within a React component, call `useSearchAvailableInGridAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAvailableInGridAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAvailableInGridAttributesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchAvailableInGridAttributesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchAvailableInGridAttributesQuery, Types.SearchAvailableInGridAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchAvailableInGridAttributesQuery, Types.SearchAvailableInGridAttributesQueryVariables>(SearchAvailableInGridAttributesDocument, options);
      }
export function useSearchAvailableInGridAttributesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchAvailableInGridAttributesQuery, Types.SearchAvailableInGridAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchAvailableInGridAttributesQuery, Types.SearchAvailableInGridAttributesQueryVariables>(SearchAvailableInGridAttributesDocument, options);
        }
export type SearchAvailableInGridAttributesQueryHookResult = ReturnType<typeof useSearchAvailableInGridAttributesQuery>;
export type SearchAvailableInGridAttributesLazyQueryHookResult = ReturnType<typeof useSearchAvailableInGridAttributesLazyQuery>;
export type SearchAvailableInGridAttributesQueryResult = Apollo.QueryResult<Types.SearchAvailableInGridAttributesQuery, Types.SearchAvailableInGridAttributesQueryVariables>;
export const SearchAvailablePageAttributesDocument = gql`
    query SearchAvailablePageAttributes($id: ID!, $after: String, $first: Int!, $query: String!) {
  pageType(id: $id) {
    id
    availableAttributes(after: $after, first: $first, filter: {search: $query}) {
      edges {
        node {
          ...AvailableAttribute
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
}
    ${AvailableAttributeFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSearchAvailablePageAttributesQuery__
 *
 * To run a query within a React component, call `useSearchAvailablePageAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAvailablePageAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAvailablePageAttributesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchAvailablePageAttributesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchAvailablePageAttributesQuery, Types.SearchAvailablePageAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchAvailablePageAttributesQuery, Types.SearchAvailablePageAttributesQueryVariables>(SearchAvailablePageAttributesDocument, options);
      }
export function useSearchAvailablePageAttributesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchAvailablePageAttributesQuery, Types.SearchAvailablePageAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchAvailablePageAttributesQuery, Types.SearchAvailablePageAttributesQueryVariables>(SearchAvailablePageAttributesDocument, options);
        }
export type SearchAvailablePageAttributesQueryHookResult = ReturnType<typeof useSearchAvailablePageAttributesQuery>;
export type SearchAvailablePageAttributesLazyQueryHookResult = ReturnType<typeof useSearchAvailablePageAttributesLazyQuery>;
export type SearchAvailablePageAttributesQueryResult = Apollo.QueryResult<Types.SearchAvailablePageAttributesQuery, Types.SearchAvailablePageAttributesQueryVariables>;
export const SearchAvailableProductAttributesDocument = gql`
    query SearchAvailableProductAttributes($id: ID!, $after: String, $first: Int!, $query: String!) {
  productType(id: $id) {
    id
    availableAttributes(after: $after, first: $first, filter: {search: $query}) {
      edges {
        node {
          ...AvailableAttribute
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
}
    ${AvailableAttributeFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSearchAvailableProductAttributesQuery__
 *
 * To run a query within a React component, call `useSearchAvailableProductAttributesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAvailableProductAttributesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAvailableProductAttributesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchAvailableProductAttributesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchAvailableProductAttributesQuery, Types.SearchAvailableProductAttributesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchAvailableProductAttributesQuery, Types.SearchAvailableProductAttributesQueryVariables>(SearchAvailableProductAttributesDocument, options);
      }
export function useSearchAvailableProductAttributesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchAvailableProductAttributesQuery, Types.SearchAvailableProductAttributesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchAvailableProductAttributesQuery, Types.SearchAvailableProductAttributesQueryVariables>(SearchAvailableProductAttributesDocument, options);
        }
export type SearchAvailableProductAttributesQueryHookResult = ReturnType<typeof useSearchAvailableProductAttributesQuery>;
export type SearchAvailableProductAttributesLazyQueryHookResult = ReturnType<typeof useSearchAvailableProductAttributesLazyQuery>;
export type SearchAvailableProductAttributesQueryResult = Apollo.QueryResult<Types.SearchAvailableProductAttributesQuery, Types.SearchAvailableProductAttributesQueryVariables>;
export const SearchCategoriesDocument = gql`
    query SearchCategories($after: String, $first: Int!, $query: String!) {
  search: categories(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        ...CategoryWithAncestors
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${CategoryWithAncestorsFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSearchCategoriesQuery__
 *
 * To run a query within a React component, call `useSearchCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCategoriesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchCategoriesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchCategoriesQuery, Types.SearchCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchCategoriesQuery, Types.SearchCategoriesQueryVariables>(SearchCategoriesDocument, options);
      }
export function useSearchCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchCategoriesQuery, Types.SearchCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchCategoriesQuery, Types.SearchCategoriesQueryVariables>(SearchCategoriesDocument, options);
        }
export type SearchCategoriesQueryHookResult = ReturnType<typeof useSearchCategoriesQuery>;
export type SearchCategoriesLazyQueryHookResult = ReturnType<typeof useSearchCategoriesLazyQuery>;
export type SearchCategoriesQueryResult = Apollo.QueryResult<Types.SearchCategoriesQuery, Types.SearchCategoriesQueryVariables>;
export const SearchCategoriesWithTotalProductsDocument = gql`
    query SearchCategoriesWithTotalProducts($after: String, $first: Int!, $query: String!) {
  search: categories(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        ...CategoryWithTotalProducts
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${CategoryWithTotalProductsFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSearchCategoriesWithTotalProductsQuery__
 *
 * To run a query within a React component, call `useSearchCategoriesWithTotalProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCategoriesWithTotalProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCategoriesWithTotalProductsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchCategoriesWithTotalProductsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchCategoriesWithTotalProductsQuery, Types.SearchCategoriesWithTotalProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchCategoriesWithTotalProductsQuery, Types.SearchCategoriesWithTotalProductsQueryVariables>(SearchCategoriesWithTotalProductsDocument, options);
      }
export function useSearchCategoriesWithTotalProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchCategoriesWithTotalProductsQuery, Types.SearchCategoriesWithTotalProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchCategoriesWithTotalProductsQuery, Types.SearchCategoriesWithTotalProductsQueryVariables>(SearchCategoriesWithTotalProductsDocument, options);
        }
export type SearchCategoriesWithTotalProductsQueryHookResult = ReturnType<typeof useSearchCategoriesWithTotalProductsQuery>;
export type SearchCategoriesWithTotalProductsLazyQueryHookResult = ReturnType<typeof useSearchCategoriesWithTotalProductsLazyQuery>;
export type SearchCategoriesWithTotalProductsQueryResult = Apollo.QueryResult<Types.SearchCategoriesWithTotalProductsQuery, Types.SearchCategoriesWithTotalProductsQueryVariables>;
export const SearchCollectionsDocument = gql`
    query SearchCollections($after: String, $first: Int!, $query: String!, $channel: String) {
  search: collections(
    after: $after
    first: $first
    filter: {search: $query}
    channel: $channel
  ) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchCollectionsQuery__
 *
 * To run a query within a React component, call `useSearchCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCollectionsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useSearchCollectionsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchCollectionsQuery, Types.SearchCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchCollectionsQuery, Types.SearchCollectionsQueryVariables>(SearchCollectionsDocument, options);
      }
export function useSearchCollectionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchCollectionsQuery, Types.SearchCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchCollectionsQuery, Types.SearchCollectionsQueryVariables>(SearchCollectionsDocument, options);
        }
export type SearchCollectionsQueryHookResult = ReturnType<typeof useSearchCollectionsQuery>;
export type SearchCollectionsLazyQueryHookResult = ReturnType<typeof useSearchCollectionsLazyQuery>;
export type SearchCollectionsQueryResult = Apollo.QueryResult<Types.SearchCollectionsQuery, Types.SearchCollectionsQueryVariables>;
export const SearchCollectionsWithTotalProductsDocument = gql`
    query SearchCollectionsWithTotalProducts($after: String, $first: Int!, $query: String!, $channel: String) {
  search: collections(
    after: $after
    first: $first
    filter: {search: $query}
    channel: $channel
  ) {
    edges {
      node {
        ...CollectionWithTotalProducts
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${CollectionWithTotalProductsFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSearchCollectionsWithTotalProductsQuery__
 *
 * To run a query within a React component, call `useSearchCollectionsWithTotalProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCollectionsWithTotalProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCollectionsWithTotalProductsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useSearchCollectionsWithTotalProductsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchCollectionsWithTotalProductsQuery, Types.SearchCollectionsWithTotalProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchCollectionsWithTotalProductsQuery, Types.SearchCollectionsWithTotalProductsQueryVariables>(SearchCollectionsWithTotalProductsDocument, options);
      }
export function useSearchCollectionsWithTotalProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchCollectionsWithTotalProductsQuery, Types.SearchCollectionsWithTotalProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchCollectionsWithTotalProductsQuery, Types.SearchCollectionsWithTotalProductsQueryVariables>(SearchCollectionsWithTotalProductsDocument, options);
        }
export type SearchCollectionsWithTotalProductsQueryHookResult = ReturnType<typeof useSearchCollectionsWithTotalProductsQuery>;
export type SearchCollectionsWithTotalProductsLazyQueryHookResult = ReturnType<typeof useSearchCollectionsWithTotalProductsLazyQuery>;
export type SearchCollectionsWithTotalProductsQueryResult = Apollo.QueryResult<Types.SearchCollectionsWithTotalProductsQuery, Types.SearchCollectionsWithTotalProductsQueryVariables>;
export const SearchCustomersDocument = gql`
    query SearchCustomers($after: String, $first: Int!, $query: String!) {
  search: customers(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        email
        firstName
        lastName
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchCustomersQuery__
 *
 * To run a query within a React component, call `useSearchCustomersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCustomersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCustomersQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchCustomersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchCustomersQuery, Types.SearchCustomersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchCustomersQuery, Types.SearchCustomersQueryVariables>(SearchCustomersDocument, options);
      }
export function useSearchCustomersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchCustomersQuery, Types.SearchCustomersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchCustomersQuery, Types.SearchCustomersQueryVariables>(SearchCustomersDocument, options);
        }
export type SearchCustomersQueryHookResult = ReturnType<typeof useSearchCustomersQuery>;
export type SearchCustomersLazyQueryHookResult = ReturnType<typeof useSearchCustomersLazyQuery>;
export type SearchCustomersQueryResult = Apollo.QueryResult<Types.SearchCustomersQuery, Types.SearchCustomersQueryVariables>;
export const SearchGiftCardTagsDocument = gql`
    query SearchGiftCardTags($query: String!, $first: Int!, $after: String, $last: Int, $before: String) {
  search: giftCardTags(
    filter: {search: $query}
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    totalCount
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchGiftCardTagsQuery__
 *
 * To run a query within a React component, call `useSearchGiftCardTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGiftCardTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGiftCardTagsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useSearchGiftCardTagsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchGiftCardTagsQuery, Types.SearchGiftCardTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchGiftCardTagsQuery, Types.SearchGiftCardTagsQueryVariables>(SearchGiftCardTagsDocument, options);
      }
export function useSearchGiftCardTagsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchGiftCardTagsQuery, Types.SearchGiftCardTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchGiftCardTagsQuery, Types.SearchGiftCardTagsQueryVariables>(SearchGiftCardTagsDocument, options);
        }
export type SearchGiftCardTagsQueryHookResult = ReturnType<typeof useSearchGiftCardTagsQuery>;
export type SearchGiftCardTagsLazyQueryHookResult = ReturnType<typeof useSearchGiftCardTagsLazyQuery>;
export type SearchGiftCardTagsQueryResult = Apollo.QueryResult<Types.SearchGiftCardTagsQuery, Types.SearchGiftCardTagsQueryVariables>;
export const SearchOrderVariantDocument = gql`
    query SearchOrderVariant($channel: String!, $first: Int!, $query: String!, $after: String, $address: AddressInput, $isPublished: Boolean, $stockAvailability: StockAvailability) {
  search: products(
    first: $first
    after: $after
    filter: {search: $query, isPublished: $isPublished, stockAvailability: $stockAvailability}
    channel: $channel
  ) {
    edges {
      node {
        id
        name
        thumbnail {
          url
        }
        variants {
          id
          name
          sku
          pricing(address: $address) {
            priceUndiscounted {
              gross {
                ...Money
              }
            }
            price {
              gross {
                ...Money
              }
            }
            onSale
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    ${MoneyFragmentDoc}`;

/**
 * __useSearchOrderVariantQuery__
 *
 * To run a query within a React component, call `useSearchOrderVariantQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchOrderVariantQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchOrderVariantQuery({
 *   variables: {
 *      channel: // value for 'channel'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      after: // value for 'after'
 *      address: // value for 'address'
 *      isPublished: // value for 'isPublished'
 *      stockAvailability: // value for 'stockAvailability'
 *   },
 * });
 */
export function useSearchOrderVariantQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchOrderVariantQuery, Types.SearchOrderVariantQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchOrderVariantQuery, Types.SearchOrderVariantQueryVariables>(SearchOrderVariantDocument, options);
      }
export function useSearchOrderVariantLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchOrderVariantQuery, Types.SearchOrderVariantQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchOrderVariantQuery, Types.SearchOrderVariantQueryVariables>(SearchOrderVariantDocument, options);
        }
export type SearchOrderVariantQueryHookResult = ReturnType<typeof useSearchOrderVariantQuery>;
export type SearchOrderVariantLazyQueryHookResult = ReturnType<typeof useSearchOrderVariantLazyQuery>;
export type SearchOrderVariantQueryResult = Apollo.QueryResult<Types.SearchOrderVariantQuery, Types.SearchOrderVariantQueryVariables>;
export const SearchPagesDocument = gql`
    query SearchPages($after: String, $first: Int!, $query: String!, $where: PageWhereInput) {
  search: pages(after: $after, first: $first, search: $query, where: $where) {
    edges {
      node {
        id
        title
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchPagesQuery__
 *
 * To run a query within a React component, call `useSearchPagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPagesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useSearchPagesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchPagesQuery, Types.SearchPagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchPagesQuery, Types.SearchPagesQueryVariables>(SearchPagesDocument, options);
      }
export function useSearchPagesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchPagesQuery, Types.SearchPagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchPagesQuery, Types.SearchPagesQueryVariables>(SearchPagesDocument, options);
        }
export type SearchPagesQueryHookResult = ReturnType<typeof useSearchPagesQuery>;
export type SearchPagesLazyQueryHookResult = ReturnType<typeof useSearchPagesLazyQuery>;
export type SearchPagesQueryResult = Apollo.QueryResult<Types.SearchPagesQuery, Types.SearchPagesQueryVariables>;
export const SearchPageTypesDocument = gql`
    query SearchPageTypes($after: String, $first: Int!, $query: String!) {
  search: pageTypes(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchPageTypesQuery__
 *
 * To run a query within a React component, call `useSearchPageTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPageTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPageTypesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchPageTypesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchPageTypesQuery, Types.SearchPageTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchPageTypesQuery, Types.SearchPageTypesQueryVariables>(SearchPageTypesDocument, options);
      }
export function useSearchPageTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchPageTypesQuery, Types.SearchPageTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchPageTypesQuery, Types.SearchPageTypesQueryVariables>(SearchPageTypesDocument, options);
        }
export type SearchPageTypesQueryHookResult = ReturnType<typeof useSearchPageTypesQuery>;
export type SearchPageTypesLazyQueryHookResult = ReturnType<typeof useSearchPageTypesLazyQuery>;
export type SearchPageTypesQueryResult = Apollo.QueryResult<Types.SearchPageTypesQuery, Types.SearchPageTypesQueryVariables>;
export const SearchPermissionGroupsDocument = gql`
    query SearchPermissionGroups($after: String, $first: Int!, $query: String!) {
  search: permissionGroups(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
        userCanManage
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchPermissionGroupsQuery__
 *
 * To run a query within a React component, call `useSearchPermissionGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPermissionGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPermissionGroupsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchPermissionGroupsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchPermissionGroupsQuery, Types.SearchPermissionGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchPermissionGroupsQuery, Types.SearchPermissionGroupsQueryVariables>(SearchPermissionGroupsDocument, options);
      }
export function useSearchPermissionGroupsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchPermissionGroupsQuery, Types.SearchPermissionGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchPermissionGroupsQuery, Types.SearchPermissionGroupsQueryVariables>(SearchPermissionGroupsDocument, options);
        }
export type SearchPermissionGroupsQueryHookResult = ReturnType<typeof useSearchPermissionGroupsQuery>;
export type SearchPermissionGroupsLazyQueryHookResult = ReturnType<typeof useSearchPermissionGroupsLazyQuery>;
export type SearchPermissionGroupsQueryResult = Apollo.QueryResult<Types.SearchPermissionGroupsQuery, Types.SearchPermissionGroupsQueryVariables>;
export const SearchProductsDocument = gql`
    query SearchProducts($after: String, $first: Int!, $query: String!, $channel: String, $where: ProductWhereInput) {
  search: products(
    after: $after
    first: $first
    search: $query
    channel: $channel
    where: $where
  ) {
    edges {
      node {
        ...SearchProduct
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${SearchProductFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSearchProductsQuery__
 *
 * To run a query within a React component, call `useSearchProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProductsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      channel: // value for 'channel'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useSearchProductsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchProductsQuery, Types.SearchProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchProductsQuery, Types.SearchProductsQueryVariables>(SearchProductsDocument, options);
      }
export function useSearchProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchProductsQuery, Types.SearchProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchProductsQuery, Types.SearchProductsQueryVariables>(SearchProductsDocument, options);
        }
export type SearchProductsQueryHookResult = ReturnType<typeof useSearchProductsQuery>;
export type SearchProductsLazyQueryHookResult = ReturnType<typeof useSearchProductsLazyQuery>;
export type SearchProductsQueryResult = Apollo.QueryResult<Types.SearchProductsQuery, Types.SearchProductsQueryVariables>;
export const SearchProductTypesDocument = gql`
    query SearchProductTypes($after: String, $first: Int!, $query: String!) {
  search: productTypes(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchProductTypesQuery__
 *
 * To run a query within a React component, call `useSearchProductTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProductTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProductTypesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchProductTypesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchProductTypesQuery, Types.SearchProductTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchProductTypesQuery, Types.SearchProductTypesQueryVariables>(SearchProductTypesDocument, options);
      }
export function useSearchProductTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchProductTypesQuery, Types.SearchProductTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchProductTypesQuery, Types.SearchProductTypesQueryVariables>(SearchProductTypesDocument, options);
        }
export type SearchProductTypesQueryHookResult = ReturnType<typeof useSearchProductTypesQuery>;
export type SearchProductTypesLazyQueryHookResult = ReturnType<typeof useSearchProductTypesLazyQuery>;
export type SearchProductTypesQueryResult = Apollo.QueryResult<Types.SearchProductTypesQuery, Types.SearchProductTypesQueryVariables>;
export const SearchShippingZonesDocument = gql`
    query SearchShippingZones($query: String!, $first: Int!, $after: String, $last: Int, $before: String) {
  search: shippingZones(
    filter: {search: $query}
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    totalCount
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchShippingZonesQuery__
 *
 * To run a query within a React component, call `useSearchShippingZonesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchShippingZonesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchShippingZonesQuery({
 *   variables: {
 *      query: // value for 'query'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useSearchShippingZonesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchShippingZonesQuery, Types.SearchShippingZonesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchShippingZonesQuery, Types.SearchShippingZonesQueryVariables>(SearchShippingZonesDocument, options);
      }
export function useSearchShippingZonesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchShippingZonesQuery, Types.SearchShippingZonesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchShippingZonesQuery, Types.SearchShippingZonesQueryVariables>(SearchShippingZonesDocument, options);
        }
export type SearchShippingZonesQueryHookResult = ReturnType<typeof useSearchShippingZonesQuery>;
export type SearchShippingZonesLazyQueryHookResult = ReturnType<typeof useSearchShippingZonesLazyQuery>;
export type SearchShippingZonesQueryResult = Apollo.QueryResult<Types.SearchShippingZonesQuery, Types.SearchShippingZonesQueryVariables>;
export const SearchStaffMembersDocument = gql`
    query SearchStaffMembers($after: String, $first: Int!, $query: String!) {
  search: staffUsers(after: $after, first: $first, filter: {search: $query}) {
    edges {
      node {
        id
        email
        firstName
        lastName
        isActive
        avatar {
          alt
          url
        }
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchStaffMembersQuery__
 *
 * To run a query within a React component, call `useSearchStaffMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchStaffMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchStaffMembersQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchStaffMembersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchStaffMembersQuery, Types.SearchStaffMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchStaffMembersQuery, Types.SearchStaffMembersQueryVariables>(SearchStaffMembersDocument, options);
      }
export function useSearchStaffMembersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchStaffMembersQuery, Types.SearchStaffMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchStaffMembersQuery, Types.SearchStaffMembersQueryVariables>(SearchStaffMembersDocument, options);
        }
export type SearchStaffMembersQueryHookResult = ReturnType<typeof useSearchStaffMembersQuery>;
export type SearchStaffMembersLazyQueryHookResult = ReturnType<typeof useSearchStaffMembersLazyQuery>;
export type SearchStaffMembersQueryResult = Apollo.QueryResult<Types.SearchStaffMembersQuery, Types.SearchStaffMembersQueryVariables>;
export const SearchVariantsDocument = gql`
    query SearchVariants($after: String, $first: Int!, $query: String!, $channel: String) {
  search: productVariants(
    after: $after
    first: $first
    filter: {search: $query}
    channel: $channel
  ) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchVariantsQuery__
 *
 * To run a query within a React component, call `useSearchVariantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchVariantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchVariantsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useSearchVariantsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchVariantsQuery, Types.SearchVariantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchVariantsQuery, Types.SearchVariantsQueryVariables>(SearchVariantsDocument, options);
      }
export function useSearchVariantsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchVariantsQuery, Types.SearchVariantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchVariantsQuery, Types.SearchVariantsQueryVariables>(SearchVariantsDocument, options);
        }
export type SearchVariantsQueryHookResult = ReturnType<typeof useSearchVariantsQuery>;
export type SearchVariantsLazyQueryHookResult = ReturnType<typeof useSearchVariantsLazyQuery>;
export type SearchVariantsQueryResult = Apollo.QueryResult<Types.SearchVariantsQuery, Types.SearchVariantsQueryVariables>;
export const SearchVariantsWithProductDataDocument = gql`
    query SearchVariantsWithProductData($after: String, $first: Int!, $query: String!, $channel: String) {
  search: productVariants(
    after: $after
    first: $first
    filter: {search: $query}
    channel: $channel
  ) {
    edges {
      node {
        id
        name
        product {
          name
        }
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchVariantsWithProductDataQuery__
 *
 * To run a query within a React component, call `useSearchVariantsWithProductDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchVariantsWithProductDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchVariantsWithProductDataQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useSearchVariantsWithProductDataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchVariantsWithProductDataQuery, Types.SearchVariantsWithProductDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchVariantsWithProductDataQuery, Types.SearchVariantsWithProductDataQueryVariables>(SearchVariantsWithProductDataDocument, options);
      }
export function useSearchVariantsWithProductDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchVariantsWithProductDataQuery, Types.SearchVariantsWithProductDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchVariantsWithProductDataQuery, Types.SearchVariantsWithProductDataQueryVariables>(SearchVariantsWithProductDataDocument, options);
        }
export type SearchVariantsWithProductDataQueryHookResult = ReturnType<typeof useSearchVariantsWithProductDataQuery>;
export type SearchVariantsWithProductDataLazyQueryHookResult = ReturnType<typeof useSearchVariantsWithProductDataLazyQuery>;
export type SearchVariantsWithProductDataQueryResult = Apollo.QueryResult<Types.SearchVariantsWithProductDataQuery, Types.SearchVariantsWithProductDataQueryVariables>;
export const SearchWarehousesDocument = gql`
    query SearchWarehouses($after: String, $first: Int!, $query: String!, $channnelsId: [ID!]) {
  search: warehouses(
    after: $after
    first: $first
    sortBy: {direction: ASC, field: NAME}
    filter: {search: $query, channels: $channnelsId}
  ) {
    totalCount
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useSearchWarehousesQuery__
 *
 * To run a query within a React component, call `useSearchWarehousesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchWarehousesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchWarehousesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      channnelsId: // value for 'channnelsId'
 *   },
 * });
 */
export function useSearchWarehousesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SearchWarehousesQuery, Types.SearchWarehousesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SearchWarehousesQuery, Types.SearchWarehousesQueryVariables>(SearchWarehousesDocument, options);
      }
export function useSearchWarehousesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SearchWarehousesQuery, Types.SearchWarehousesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SearchWarehousesQuery, Types.SearchWarehousesQueryVariables>(SearchWarehousesDocument, options);
        }
export type SearchWarehousesQueryHookResult = ReturnType<typeof useSearchWarehousesQuery>;
export type SearchWarehousesLazyQueryHookResult = ReturnType<typeof useSearchWarehousesLazyQuery>;
export type SearchWarehousesQueryResult = Apollo.QueryResult<Types.SearchWarehousesQuery, Types.SearchWarehousesQueryVariables>;
export const DeleteShippingZoneDocument = gql`
    mutation DeleteShippingZone($id: ID!) {
  shippingZoneDelete(id: $id) {
    errors {
      ...ShippingError
    }
  }
}
    ${ShippingErrorFragmentDoc}`;
export type DeleteShippingZoneMutationFn = Apollo.MutationFunction<Types.DeleteShippingZoneMutation, Types.DeleteShippingZoneMutationVariables>;

/**
 * __useDeleteShippingZoneMutation__
 *
 * To run a mutation, you first call `useDeleteShippingZoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShippingZoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShippingZoneMutation, { data, loading, error }] = useDeleteShippingZoneMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteShippingZoneMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.DeleteShippingZoneMutation, Types.DeleteShippingZoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.DeleteShippingZoneMutation, Types.DeleteShippingZoneMutationVariables>(DeleteShippingZoneDocument, options);
      }
export type DeleteShippingZoneMutationHookResult = ReturnType<typeof useDeleteShippingZoneMutation>;
export type DeleteShippingZoneMutationResult = Apollo.MutationResult<Types.DeleteShippingZoneMutation>;
export type DeleteShippingZoneMutationOptions = Apollo.BaseMutationOptions<Types.DeleteShippingZoneMutation, Types.DeleteShippingZoneMutationVariables>;
export const BulkDeleteShippingZoneDocument = gql`
    mutation BulkDeleteShippingZone($ids: [ID!]!) {
  shippingZoneBulkDelete(ids: $ids) {
    errors {
      ...ShippingError
    }
  }
}
    ${ShippingErrorFragmentDoc}`;
export type BulkDeleteShippingZoneMutationFn = Apollo.MutationFunction<Types.BulkDeleteShippingZoneMutation, Types.BulkDeleteShippingZoneMutationVariables>;

/**
 * __useBulkDeleteShippingZoneMutation__
 *
 * To run a mutation, you first call `useBulkDeleteShippingZoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteShippingZoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteShippingZoneMutation, { data, loading, error }] = useBulkDeleteShippingZoneMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useBulkDeleteShippingZoneMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.BulkDeleteShippingZoneMutation, Types.BulkDeleteShippingZoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.BulkDeleteShippingZoneMutation, Types.BulkDeleteShippingZoneMutationVariables>(BulkDeleteShippingZoneDocument, options);
      }
export type BulkDeleteShippingZoneMutationHookResult = ReturnType<typeof useBulkDeleteShippingZoneMutation>;
export type BulkDeleteShippingZoneMutationResult = Apollo.MutationResult<Types.BulkDeleteShippingZoneMutation>;
export type BulkDeleteShippingZoneMutationOptions = Apollo.BaseMutationOptions<Types.BulkDeleteShippingZoneMutation, Types.BulkDeleteShippingZoneMutationVariables>;
export const UpdateDefaultWeightUnitDocument = gql`
    mutation UpdateDefaultWeightUnit($unit: WeightUnitsEnum) {
  shopSettingsUpdate(input: {defaultWeightUnit: $unit}) {
    errors {
      ...ShopSettingsUpdateErrorFragment
    }
    shop {
      defaultWeightUnit
    }
  }
}
    ${ShopSettingsUpdateErrorFragmentFragmentDoc}`;
export type UpdateDefaultWeightUnitMutationFn = Apollo.MutationFunction<Types.UpdateDefaultWeightUnitMutation, Types.UpdateDefaultWeightUnitMutationVariables>;

/**
 * __useUpdateDefaultWeightUnitMutation__
 *
 * To run a mutation, you first call `useUpdateDefaultWeightUnitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDefaultWeightUnitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDefaultWeightUnitMutation, { data, loading, error }] = useUpdateDefaultWeightUnitMutation({
 *   variables: {
 *      unit: // value for 'unit'
 *   },
 * });
 */
export function useUpdateDefaultWeightUnitMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateDefaultWeightUnitMutation, Types.UpdateDefaultWeightUnitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateDefaultWeightUnitMutation, Types.UpdateDefaultWeightUnitMutationVariables>(UpdateDefaultWeightUnitDocument, options);
      }
export type UpdateDefaultWeightUnitMutationHookResult = ReturnType<typeof useUpdateDefaultWeightUnitMutation>;
export type UpdateDefaultWeightUnitMutationResult = Apollo.MutationResult<Types.UpdateDefaultWeightUnitMutation>;
export type UpdateDefaultWeightUnitMutationOptions = Apollo.BaseMutationOptions<Types.UpdateDefaultWeightUnitMutation, Types.UpdateDefaultWeightUnitMutationVariables>;
export const CreateShippingZoneDocument = gql`
    mutation CreateShippingZone($input: ShippingZoneCreateInput!) {
  shippingZoneCreate(input: $input) {
    errors {
      ...ShippingError
    }
    shippingZone {
      ...ShippingZone
    }
  }
}
    ${ShippingErrorFragmentDoc}
${ShippingZoneFragmentDoc}`;
export type CreateShippingZoneMutationFn = Apollo.MutationFunction<Types.CreateShippingZoneMutation, Types.CreateShippingZoneMutationVariables>;

/**
 * __useCreateShippingZoneMutation__
 *
 * To run a mutation, you first call `useCreateShippingZoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShippingZoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShippingZoneMutation, { data, loading, error }] = useCreateShippingZoneMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateShippingZoneMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CreateShippingZoneMutation, Types.CreateShippingZoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CreateShippingZoneMutation, Types.CreateShippingZoneMutationVariables>(CreateShippingZoneDocument, options);
      }
export type CreateShippingZoneMutationHookResult = ReturnType<typeof useCreateShippingZoneMutation>;
export type CreateShippingZoneMutationResult = Apollo.MutationResult<Types.CreateShippingZoneMutation>;
export type CreateShippingZoneMutationOptions = Apollo.BaseMutationOptions<Types.CreateShippingZoneMutation, Types.CreateShippingZoneMutationVariables>;
export const UpdateShippingZoneDocument = gql`
    mutation UpdateShippingZone($id: ID!, $input: ShippingZoneUpdateInput!) {
  shippingZoneUpdate(id: $id, input: $input) {
    errors {
      ...ShippingError
    }
    shippingZone {
      ...ShippingZone
      channels {
        id
        name
        currencyCode
      }
      warehouses {
        id
        name
      }
    }
  }
}
    ${ShippingErrorFragmentDoc}
${ShippingZoneFragmentDoc}`;
export type UpdateShippingZoneMutationFn = Apollo.MutationFunction<Types.UpdateShippingZoneMutation, Types.UpdateShippingZoneMutationVariables>;

/**
 * __useUpdateShippingZoneMutation__
 *
 * To run a mutation, you first call `useUpdateShippingZoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShippingZoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShippingZoneMutation, { data, loading, error }] = useUpdateShippingZoneMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShippingZoneMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateShippingZoneMutation, Types.UpdateShippingZoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateShippingZoneMutation, Types.UpdateShippingZoneMutationVariables>(UpdateShippingZoneDocument, options);
      }
export type UpdateShippingZoneMutationHookResult = ReturnType<typeof useUpdateShippingZoneMutation>;
export type UpdateShippingZoneMutationResult = Apollo.MutationResult<Types.UpdateShippingZoneMutation>;
export type UpdateShippingZoneMutationOptions = Apollo.BaseMutationOptions<Types.UpdateShippingZoneMutation, Types.UpdateShippingZoneMutationVariables>;
export const UpdateShippingRateDocument = gql`
    mutation UpdateShippingRate($id: ID!, $input: ShippingPriceInput!) {
  shippingPriceUpdate(id: $id, input: $input) {
    errors {
      ...ShippingError
    }
    shippingMethod {
      ...ShippingMethodType
    }
  }
}
    ${ShippingErrorFragmentDoc}
${ShippingMethodTypeFragmentDoc}`;
export type UpdateShippingRateMutationFn = Apollo.MutationFunction<Types.UpdateShippingRateMutation, Types.UpdateShippingRateMutationVariables>;

/**
 * __useUpdateShippingRateMutation__
 *
 * To run a mutation, you first call `useUpdateShippingRateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShippingRateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShippingRateMutation, { data, loading, error }] = useUpdateShippingRateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShippingRateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateShippingRateMutation, Types.UpdateShippingRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateShippingRateMutation, Types.UpdateShippingRateMutationVariables>(UpdateShippingRateDocument, options);
      }
export type UpdateShippingRateMutationHookResult = ReturnType<typeof useUpdateShippingRateMutation>;
export type UpdateShippingRateMutationResult = Apollo.MutationResult<Types.UpdateShippingRateMutation>;
export type UpdateShippingRateMutationOptions = Apollo.BaseMutationOptions<Types.UpdateShippingRateMutation, Types.UpdateShippingRateMutationVariables>;
export const CreateShippingRateDocument = gql`
    mutation CreateShippingRate($input: ShippingPriceInput!) {
  shippingPriceCreate(input: $input) {
    errors {
      ...ShippingError
    }
    shippingZone {
      ...ShippingZoneDetails
    }
    shippingMethod {
      ...ShippingMethodType
    }
  }
}
    ${ShippingErrorFragmentDoc}
${ShippingZoneDetailsFragmentDoc}
${ShippingMethodTypeFragmentDoc}`;
export type CreateShippingRateMutationFn = Apollo.MutationFunction<Types.CreateShippingRateMutation, Types.CreateShippingRateMutationVariables>;

/**
 * __useCreateShippingRateMutation__
 *
 * To run a mutation, you first call `useCreateShippingRateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShippingRateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShippingRateMutation, { data, loading, error }] = useCreateShippingRateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateShippingRateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.CreateShippingRateMutation, Types.CreateShippingRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.CreateShippingRateMutation, Types.CreateShippingRateMutationVariables>(CreateShippingRateDocument, options);
      }
export type CreateShippingRateMutationHookResult = ReturnType<typeof useCreateShippingRateMutation>;
export type CreateShippingRateMutationResult = Apollo.MutationResult<Types.CreateShippingRateMutation>;
export type CreateShippingRateMutationOptions = Apollo.BaseMutationOptions<Types.CreateShippingRateMutation, Types.CreateShippingRateMutationVariables>;
export const DeleteShippingRateDocument = gql`
    mutation DeleteShippingRate($id: ID!) {
  shippingPriceDelete(id: $id) {
    errors {
      ...ShippingError
    }
    shippingZone {
      ...ShippingZoneDetails
    }
  }
}
    ${ShippingErrorFragmentDoc}
${ShippingZoneDetailsFragmentDoc}`;
export type DeleteShippingRateMutationFn = Apollo.MutationFunction<Types.DeleteShippingRateMutation, Types.DeleteShippingRateMutationVariables>;

/**
 * __useDeleteShippingRateMutation__
 *
 * To run a mutation, you first call `useDeleteShippingRateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShippingRateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShippingRateMutation, { data, loading, error }] = useDeleteShippingRateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteShippingRateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.DeleteShippingRateMutation, Types.DeleteShippingRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.DeleteShippingRateMutation, Types.DeleteShippingRateMutationVariables>(DeleteShippingRateDocument, options);
      }
export type DeleteShippingRateMutationHookResult = ReturnType<typeof useDeleteShippingRateMutation>;
export type DeleteShippingRateMutationResult = Apollo.MutationResult<Types.DeleteShippingRateMutation>;
export type DeleteShippingRateMutationOptions = Apollo.BaseMutationOptions<Types.DeleteShippingRateMutation, Types.DeleteShippingRateMutationVariables>;
export const BulkDeleteShippingRateDocument = gql`
    mutation BulkDeleteShippingRate($ids: [ID!]!) {
  shippingPriceBulkDelete(ids: $ids) {
    errors {
      ...ShippingError
    }
  }
}
    ${ShippingErrorFragmentDoc}`;
export type BulkDeleteShippingRateMutationFn = Apollo.MutationFunction<Types.BulkDeleteShippingRateMutation, Types.BulkDeleteShippingRateMutationVariables>;

/**
 * __useBulkDeleteShippingRateMutation__
 *
 * To run a mutation, you first call `useBulkDeleteShippingRateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDeleteShippingRateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDeleteShippingRateMutation, { data, loading, error }] = useBulkDeleteShippingRateMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useBulkDeleteShippingRateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.BulkDeleteShippingRateMutation, Types.BulkDeleteShippingRateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.BulkDeleteShippingRateMutation, Types.BulkDeleteShippingRateMutationVariables>(BulkDeleteShippingRateDocument, options);
      }
export type BulkDeleteShippingRateMutationHookResult = ReturnType<typeof useBulkDeleteShippingRateMutation>;
export type BulkDeleteShippingRateMutationResult = Apollo.MutationResult<Types.BulkDeleteShippingRateMutation>;
export type BulkDeleteShippingRateMutationOptions = Apollo.BaseMutationOptions<Types.BulkDeleteShippingRateMutation, Types.BulkDeleteShippingRateMutationVariables>;
export const ShippingMethodChannelListingUpdateDocument = gql`
    mutation ShippingMethodChannelListingUpdate($id: ID!, $input: ShippingMethodChannelListingInput!) {
  shippingMethodChannelListingUpdate(id: $id, input: $input) {
    shippingMethod {
      ...ShippingMethodType
    }
    errors {
      ...ShippingChannelsError
    }
  }
}
    ${ShippingMethodTypeFragmentDoc}
${ShippingChannelsErrorFragmentDoc}`;
export type ShippingMethodChannelListingUpdateMutationFn = Apollo.MutationFunction<Types.ShippingMethodChannelListingUpdateMutation, Types.ShippingMethodChannelListingUpdateMutationVariables>;

/**
 * __useShippingMethodChannelListingUpdateMutation__
 *
 * To run a mutation, you first call `useShippingMethodChannelListingUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShippingMethodChannelListingUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shippingMethodChannelListingUpdateMutation, { data, loading, error }] = useShippingMethodChannelListingUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useShippingMethodChannelListingUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ShippingMethodChannelListingUpdateMutation, Types.ShippingMethodChannelListingUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ShippingMethodChannelListingUpdateMutation, Types.ShippingMethodChannelListingUpdateMutationVariables>(ShippingMethodChannelListingUpdateDocument, options);
      }
export type ShippingMethodChannelListingUpdateMutationHookResult = ReturnType<typeof useShippingMethodChannelListingUpdateMutation>;
export type ShippingMethodChannelListingUpdateMutationResult = Apollo.MutationResult<Types.ShippingMethodChannelListingUpdateMutation>;
export type ShippingMethodChannelListingUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ShippingMethodChannelListingUpdateMutation, Types.ShippingMethodChannelListingUpdateMutationVariables>;
export const ShippingPriceExcludeProductDocument = gql`
    mutation ShippingPriceExcludeProduct($id: ID!, $input: ShippingPriceExcludeProductsInput!) {
  shippingPriceExcludeProducts(id: $id, input: $input) {
    errors {
      ...ShippingError
    }
  }
}
    ${ShippingErrorFragmentDoc}`;
export type ShippingPriceExcludeProductMutationFn = Apollo.MutationFunction<Types.ShippingPriceExcludeProductMutation, Types.ShippingPriceExcludeProductMutationVariables>;

/**
 * __useShippingPriceExcludeProductMutation__
 *
 * To run a mutation, you first call `useShippingPriceExcludeProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShippingPriceExcludeProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shippingPriceExcludeProductMutation, { data, loading, error }] = useShippingPriceExcludeProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useShippingPriceExcludeProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ShippingPriceExcludeProductMutation, Types.ShippingPriceExcludeProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ShippingPriceExcludeProductMutation, Types.ShippingPriceExcludeProductMutationVariables>(ShippingPriceExcludeProductDocument, options);
      }
export type ShippingPriceExcludeProductMutationHookResult = ReturnType<typeof useShippingPriceExcludeProductMutation>;
export type ShippingPriceExcludeProductMutationResult = Apollo.MutationResult<Types.ShippingPriceExcludeProductMutation>;
export type ShippingPriceExcludeProductMutationOptions = Apollo.BaseMutationOptions<Types.ShippingPriceExcludeProductMutation, Types.ShippingPriceExcludeProductMutationVariables>;
export const ShippingPriceRemoveProductFromExcludeDocument = gql`
    mutation ShippingPriceRemoveProductFromExclude($id: ID!, $products: [ID!]!) {
  shippingPriceRemoveProductFromExclude(id: $id, products: $products) {
    errors {
      ...ShippingError
    }
  }
}
    ${ShippingErrorFragmentDoc}`;
export type ShippingPriceRemoveProductFromExcludeMutationFn = Apollo.MutationFunction<Types.ShippingPriceRemoveProductFromExcludeMutation, Types.ShippingPriceRemoveProductFromExcludeMutationVariables>;

/**
 * __useShippingPriceRemoveProductFromExcludeMutation__
 *
 * To run a mutation, you first call `useShippingPriceRemoveProductFromExcludeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShippingPriceRemoveProductFromExcludeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shippingPriceRemoveProductFromExcludeMutation, { data, loading, error }] = useShippingPriceRemoveProductFromExcludeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      products: // value for 'products'
 *   },
 * });
 */
export function useShippingPriceRemoveProductFromExcludeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ShippingPriceRemoveProductFromExcludeMutation, Types.ShippingPriceRemoveProductFromExcludeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ShippingPriceRemoveProductFromExcludeMutation, Types.ShippingPriceRemoveProductFromExcludeMutationVariables>(ShippingPriceRemoveProductFromExcludeDocument, options);
      }
export type ShippingPriceRemoveProductFromExcludeMutationHookResult = ReturnType<typeof useShippingPriceRemoveProductFromExcludeMutation>;
export type ShippingPriceRemoveProductFromExcludeMutationResult = Apollo.MutationResult<Types.ShippingPriceRemoveProductFromExcludeMutation>;
export type ShippingPriceRemoveProductFromExcludeMutationOptions = Apollo.BaseMutationOptions<Types.ShippingPriceRemoveProductFromExcludeMutation, Types.ShippingPriceRemoveProductFromExcludeMutationVariables>;
export const ShippingZonesDocument = gql`
    query ShippingZones($first: Int, $after: String, $last: Int, $before: String, $filter: ShippingZoneFilterInput) {
  shippingZones(
    first: $first
    after: $after
    last: $last
    before: $before
    filter: $filter
  ) {
    edges {
      node {
        ...ShippingZone
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${ShippingZoneFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useShippingZonesQuery__
 *
 * To run a query within a React component, call `useShippingZonesQuery` and pass it any options that fit your needs.
 * When your component renders, `useShippingZonesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShippingZonesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useShippingZonesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ShippingZonesQuery, Types.ShippingZonesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ShippingZonesQuery, Types.ShippingZonesQueryVariables>(ShippingZonesDocument, options);
      }
export function useShippingZonesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ShippingZonesQuery, Types.ShippingZonesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ShippingZonesQuery, Types.ShippingZonesQueryVariables>(ShippingZonesDocument, options);
        }
export type ShippingZonesQueryHookResult = ReturnType<typeof useShippingZonesQuery>;
export type ShippingZonesLazyQueryHookResult = ReturnType<typeof useShippingZonesLazyQuery>;
export type ShippingZonesQueryResult = Apollo.QueryResult<Types.ShippingZonesQuery, Types.ShippingZonesQueryVariables>;
export const ShippingZoneDocument = gql`
    query ShippingZone($id: ID!, $before: String, $after: String, $first: Int, $last: Int) {
  shippingZone(id: $id) {
    ...ShippingZone
    default
    shippingMethods {
      ...ShippingMethodWithExcludedProducts
    }
    channels {
      id
      name
      currencyCode
    }
    warehouses {
      id
      name
    }
  }
}
    ${ShippingZoneFragmentDoc}
${ShippingMethodWithExcludedProductsFragmentDoc}`;

/**
 * __useShippingZoneQuery__
 *
 * To run a query within a React component, call `useShippingZoneQuery` and pass it any options that fit your needs.
 * When your component renders, `useShippingZoneQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShippingZoneQuery({
 *   variables: {
 *      id: // value for 'id'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useShippingZoneQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ShippingZoneQuery, Types.ShippingZoneQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ShippingZoneQuery, Types.ShippingZoneQueryVariables>(ShippingZoneDocument, options);
      }
export function useShippingZoneLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ShippingZoneQuery, Types.ShippingZoneQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ShippingZoneQuery, Types.ShippingZoneQueryVariables>(ShippingZoneDocument, options);
        }
export type ShippingZoneQueryHookResult = ReturnType<typeof useShippingZoneQuery>;
export type ShippingZoneLazyQueryHookResult = ReturnType<typeof useShippingZoneLazyQuery>;
export type ShippingZoneQueryResult = Apollo.QueryResult<Types.ShippingZoneQuery, Types.ShippingZoneQueryVariables>;
export const ShippingZoneChannelsDocument = gql`
    query ShippingZoneChannels($id: ID!) {
  shippingZone(id: $id) {
    id
    channels {
      id
      name
      currencyCode
    }
  }
}
    `;

/**
 * __useShippingZoneChannelsQuery__
 *
 * To run a query within a React component, call `useShippingZoneChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useShippingZoneChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShippingZoneChannelsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useShippingZoneChannelsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ShippingZoneChannelsQuery, Types.ShippingZoneChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ShippingZoneChannelsQuery, Types.ShippingZoneChannelsQueryVariables>(ShippingZoneChannelsDocument, options);
      }
export function useShippingZoneChannelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ShippingZoneChannelsQuery, Types.ShippingZoneChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ShippingZoneChannelsQuery, Types.ShippingZoneChannelsQueryVariables>(ShippingZoneChannelsDocument, options);
        }
export type ShippingZoneChannelsQueryHookResult = ReturnType<typeof useShippingZoneChannelsQuery>;
export type ShippingZoneChannelsLazyQueryHookResult = ReturnType<typeof useShippingZoneChannelsLazyQuery>;
export type ShippingZoneChannelsQueryResult = Apollo.QueryResult<Types.ShippingZoneChannelsQuery, Types.ShippingZoneChannelsQueryVariables>;
export const ChannelShippingZonesDocument = gql`
    query ChannelShippingZones($filter: ShippingZoneFilterInput) {
  shippingZones(filter: $filter, first: 100) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useChannelShippingZonesQuery__
 *
 * To run a query within a React component, call `useChannelShippingZonesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelShippingZonesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelShippingZonesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useChannelShippingZonesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ChannelShippingZonesQuery, Types.ChannelShippingZonesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ChannelShippingZonesQuery, Types.ChannelShippingZonesQueryVariables>(ChannelShippingZonesDocument, options);
      }
export function useChannelShippingZonesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ChannelShippingZonesQuery, Types.ChannelShippingZonesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ChannelShippingZonesQuery, Types.ChannelShippingZonesQueryVariables>(ChannelShippingZonesDocument, options);
        }
export type ChannelShippingZonesQueryHookResult = ReturnType<typeof useChannelShippingZonesQuery>;
export type ChannelShippingZonesLazyQueryHookResult = ReturnType<typeof useChannelShippingZonesLazyQuery>;
export type ChannelShippingZonesQueryResult = Apollo.QueryResult<Types.ChannelShippingZonesQuery, Types.ChannelShippingZonesQueryVariables>;
export const ShippingZonesCountDocument = gql`
    query ShippingZonesCount {
  shippingZones {
    totalCount
  }
}
    `;

/**
 * __useShippingZonesCountQuery__
 *
 * To run a query within a React component, call `useShippingZonesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useShippingZonesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShippingZonesCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useShippingZonesCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.ShippingZonesCountQuery, Types.ShippingZonesCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ShippingZonesCountQuery, Types.ShippingZonesCountQueryVariables>(ShippingZonesCountDocument, options);
      }
export function useShippingZonesCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ShippingZonesCountQuery, Types.ShippingZonesCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ShippingZonesCountQuery, Types.ShippingZonesCountQueryVariables>(ShippingZonesCountDocument, options);
        }
export type ShippingZonesCountQueryHookResult = ReturnType<typeof useShippingZonesCountQuery>;
export type ShippingZonesCountLazyQueryHookResult = ReturnType<typeof useShippingZonesCountLazyQuery>;
export type ShippingZonesCountQueryResult = Apollo.QueryResult<Types.ShippingZonesCountQuery, Types.ShippingZonesCountQueryVariables>;
export const ShopSettingsUpdateDocument = gql`
    mutation ShopSettingsUpdate($shopSettingsInput: ShopSettingsInput!, $addressInput: AddressInput) {
  shopSettingsUpdate(input: $shopSettingsInput) {
    errors {
      ...ShopError
    }
    shop {
      ...Shop
    }
  }
  shopAddressUpdate(input: $addressInput) {
    errors {
      ...ShopError
    }
    shop {
      companyAddress {
        ...Address
      }
    }
  }
}
    ${ShopErrorFragmentDoc}
${ShopFragmentDoc}
${AddressFragmentDoc}`;
export type ShopSettingsUpdateMutationFn = Apollo.MutationFunction<Types.ShopSettingsUpdateMutation, Types.ShopSettingsUpdateMutationVariables>;

/**
 * __useShopSettingsUpdateMutation__
 *
 * To run a mutation, you first call `useShopSettingsUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShopSettingsUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shopSettingsUpdateMutation, { data, loading, error }] = useShopSettingsUpdateMutation({
 *   variables: {
 *      shopSettingsInput: // value for 'shopSettingsInput'
 *      addressInput: // value for 'addressInput'
 *   },
 * });
 */
export function useShopSettingsUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ShopSettingsUpdateMutation, Types.ShopSettingsUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ShopSettingsUpdateMutation, Types.ShopSettingsUpdateMutationVariables>(ShopSettingsUpdateDocument, options);
      }
export type ShopSettingsUpdateMutationHookResult = ReturnType<typeof useShopSettingsUpdateMutation>;
export type ShopSettingsUpdateMutationResult = Apollo.MutationResult<Types.ShopSettingsUpdateMutation>;
export type ShopSettingsUpdateMutationOptions = Apollo.BaseMutationOptions<Types.ShopSettingsUpdateMutation, Types.ShopSettingsUpdateMutationVariables>;
export const RefundSettingsUpdateDocument = gql`
    mutation RefundSettingsUpdate($refundSettingsInput: RefundSettingsUpdateInput!) {
  refundSettingsUpdate(input: $refundSettingsInput) {
    errors {
      code
      message
    }
    refundSettings {
      reasonReferenceType {
        name
        id
      }
    }
  }
}
    `;
export type RefundSettingsUpdateMutationFn = Apollo.MutationFunction<Types.RefundSettingsUpdateMutation, Types.RefundSettingsUpdateMutationVariables>;

/**
 * __useRefundSettingsUpdateMutation__
 *
 * To run a mutation, you first call `useRefundSettingsUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefundSettingsUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refundSettingsUpdateMutation, { data, loading, error }] = useRefundSettingsUpdateMutation({
 *   variables: {
 *      refundSettingsInput: // value for 'refundSettingsInput'
 *   },
 * });
 */
export function useRefundSettingsUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.RefundSettingsUpdateMutation, Types.RefundSettingsUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.RefundSettingsUpdateMutation, Types.RefundSettingsUpdateMutationVariables>(RefundSettingsUpdateDocument, options);
      }
export type RefundSettingsUpdateMutationHookResult = ReturnType<typeof useRefundSettingsUpdateMutation>;
export type RefundSettingsUpdateMutationResult = Apollo.MutationResult<Types.RefundSettingsUpdateMutation>;
export type RefundSettingsUpdateMutationOptions = Apollo.BaseMutationOptions<Types.RefundSettingsUpdateMutation, Types.RefundSettingsUpdateMutationVariables>;
export const RefundReasonReferenceClearDocument = gql`
    mutation RefundReasonReferenceClear {
  refundReasonReferenceClear {
    refundSettings {
      reasonReferenceType {
        id
        name
      }
    }
    errors {
      code
      message
    }
  }
}
    `;
export type RefundReasonReferenceClearMutationFn = Apollo.MutationFunction<Types.RefundReasonReferenceClearMutation, Types.RefundReasonReferenceClearMutationVariables>;

/**
 * __useRefundReasonReferenceClearMutation__
 *
 * To run a mutation, you first call `useRefundReasonReferenceClearMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefundReasonReferenceClearMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refundReasonReferenceClearMutation, { data, loading, error }] = useRefundReasonReferenceClearMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefundReasonReferenceClearMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.RefundReasonReferenceClearMutation, Types.RefundReasonReferenceClearMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.RefundReasonReferenceClearMutation, Types.RefundReasonReferenceClearMutationVariables>(RefundReasonReferenceClearDocument, options);
      }
export type RefundReasonReferenceClearMutationHookResult = ReturnType<typeof useRefundReasonReferenceClearMutation>;
export type RefundReasonReferenceClearMutationResult = Apollo.MutationResult<Types.RefundReasonReferenceClearMutation>;
export type RefundReasonReferenceClearMutationOptions = Apollo.BaseMutationOptions<Types.RefundReasonReferenceClearMutation, Types.RefundReasonReferenceClearMutationVariables>;
export const SiteSettingsDocument = gql`
    query SiteSettings {
  shop {
    ...Shop
  }
}
    ${ShopFragmentDoc}`;

/**
 * __useSiteSettingsQuery__
 *
 * To run a query within a React component, call `useSiteSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSiteSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSiteSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSiteSettingsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.SiteSettingsQuery, Types.SiteSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SiteSettingsQuery, Types.SiteSettingsQueryVariables>(SiteSettingsDocument, options);
      }
export function useSiteSettingsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SiteSettingsQuery, Types.SiteSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SiteSettingsQuery, Types.SiteSettingsQueryVariables>(SiteSettingsDocument, options);
        }
export type SiteSettingsQueryHookResult = ReturnType<typeof useSiteSettingsQuery>;
export type SiteSettingsLazyQueryHookResult = ReturnType<typeof useSiteSettingsLazyQuery>;
export type SiteSettingsQueryResult = Apollo.QueryResult<Types.SiteSettingsQuery, Types.SiteSettingsQueryVariables>;
export const StaffMemberAddDocument = gql`
    mutation StaffMemberAdd($input: StaffCreateInput!) {
  staffCreate(input: $input) {
    errors {
      ...StaffError
    }
    user {
      ...StaffMemberDetails
    }
  }
}
    ${StaffErrorFragmentDoc}
${StaffMemberDetailsFragmentDoc}`;
export type StaffMemberAddMutationFn = Apollo.MutationFunction<Types.StaffMemberAddMutation, Types.StaffMemberAddMutationVariables>;

/**
 * __useStaffMemberAddMutation__
 *
 * To run a mutation, you first call `useStaffMemberAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStaffMemberAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [staffMemberAddMutation, { data, loading, error }] = useStaffMemberAddMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStaffMemberAddMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.StaffMemberAddMutation, Types.StaffMemberAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.StaffMemberAddMutation, Types.StaffMemberAddMutationVariables>(StaffMemberAddDocument, options);
      }
export type StaffMemberAddMutationHookResult = ReturnType<typeof useStaffMemberAddMutation>;
export type StaffMemberAddMutationResult = Apollo.MutationResult<Types.StaffMemberAddMutation>;
export type StaffMemberAddMutationOptions = Apollo.BaseMutationOptions<Types.StaffMemberAddMutation, Types.StaffMemberAddMutationVariables>;
export const StaffMemberUpdateDocument = gql`
    mutation StaffMemberUpdate($id: ID!, $input: StaffUpdateInput!) {
  staffUpdate(id: $id, input: $input) {
    errors {
      ...StaffError
    }
    user {
      ...StaffMemberDetails
    }
  }
}
    ${StaffErrorFragmentDoc}
${StaffMemberDetailsFragmentDoc}`;
export type StaffMemberUpdateMutationFn = Apollo.MutationFunction<Types.StaffMemberUpdateMutation, Types.StaffMemberUpdateMutationVariables>;

/**
 * __useStaffMemberUpdateMutation__
 *
 * To run a mutation, you first call `useStaffMemberUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStaffMemberUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [staffMemberUpdateMutation, { data, loading, error }] = useStaffMemberUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStaffMemberUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.StaffMemberUpdateMutation, Types.StaffMemberUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.StaffMemberUpdateMutation, Types.StaffMemberUpdateMutationVariables>(StaffMemberUpdateDocument, options);
      }
export type StaffMemberUpdateMutationHookResult = ReturnType<typeof useStaffMemberUpdateMutation>;
export type StaffMemberUpdateMutationResult = Apollo.MutationResult<Types.StaffMemberUpdateMutation>;
export type StaffMemberUpdateMutationOptions = Apollo.BaseMutationOptions<Types.StaffMemberUpdateMutation, Types.StaffMemberUpdateMutationVariables>;
export const UserPassowrdChangeDocument = gql`
    mutation UserPassowrdChange($newPassword: String!, $oldPassword: String!) {
  passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
    errors {
      ...AccountError
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type UserPassowrdChangeMutationFn = Apollo.MutationFunction<Types.UserPassowrdChangeMutation, Types.UserPassowrdChangeMutationVariables>;

/**
 * __useUserPassowrdChangeMutation__
 *
 * To run a mutation, you first call `useUserPassowrdChangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserPassowrdChangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userPassowrdChangeMutation, { data, loading, error }] = useUserPassowrdChangeMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *      oldPassword: // value for 'oldPassword'
 *   },
 * });
 */
export function useUserPassowrdChangeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UserPassowrdChangeMutation, Types.UserPassowrdChangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UserPassowrdChangeMutation, Types.UserPassowrdChangeMutationVariables>(UserPassowrdChangeDocument, options);
      }
export type UserPassowrdChangeMutationHookResult = ReturnType<typeof useUserPassowrdChangeMutation>;
export type UserPassowrdChangeMutationResult = Apollo.MutationResult<Types.UserPassowrdChangeMutation>;
export type UserPassowrdChangeMutationOptions = Apollo.BaseMutationOptions<Types.UserPassowrdChangeMutation, Types.UserPassowrdChangeMutationVariables>;
export const UserAccountUpdateDocument = gql`
    mutation UserAccountUpdate($input: AccountInput!) {
  accountUpdate(input: $input) {
    user {
      metadata {
        key
        value
      }
    }
    errors {
      ...AccountError
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type UserAccountUpdateMutationFn = Apollo.MutationFunction<Types.UserAccountUpdateMutation, Types.UserAccountUpdateMutationVariables>;

/**
 * __useUserAccountUpdateMutation__
 *
 * To run a mutation, you first call `useUserAccountUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserAccountUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userAccountUpdateMutation, { data, loading, error }] = useUserAccountUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserAccountUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UserAccountUpdateMutation, Types.UserAccountUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UserAccountUpdateMutation, Types.UserAccountUpdateMutationVariables>(UserAccountUpdateDocument, options);
      }
export type UserAccountUpdateMutationHookResult = ReturnType<typeof useUserAccountUpdateMutation>;
export type UserAccountUpdateMutationResult = Apollo.MutationResult<Types.UserAccountUpdateMutation>;
export type UserAccountUpdateMutationOptions = Apollo.BaseMutationOptions<Types.UserAccountUpdateMutation, Types.UserAccountUpdateMutationVariables>;
export const StaffMemberDeleteDocument = gql`
    mutation StaffMemberDelete($id: ID!) {
  staffDelete(id: $id) {
    errors {
      ...StaffError
    }
  }
}
    ${StaffErrorFragmentDoc}`;
export type StaffMemberDeleteMutationFn = Apollo.MutationFunction<Types.StaffMemberDeleteMutation, Types.StaffMemberDeleteMutationVariables>;

/**
 * __useStaffMemberDeleteMutation__
 *
 * To run a mutation, you first call `useStaffMemberDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStaffMemberDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [staffMemberDeleteMutation, { data, loading, error }] = useStaffMemberDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStaffMemberDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.StaffMemberDeleteMutation, Types.StaffMemberDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.StaffMemberDeleteMutation, Types.StaffMemberDeleteMutationVariables>(StaffMemberDeleteDocument, options);
      }
export type StaffMemberDeleteMutationHookResult = ReturnType<typeof useStaffMemberDeleteMutation>;
export type StaffMemberDeleteMutationResult = Apollo.MutationResult<Types.StaffMemberDeleteMutation>;
export type StaffMemberDeleteMutationOptions = Apollo.BaseMutationOptions<Types.StaffMemberDeleteMutation, Types.StaffMemberDeleteMutationVariables>;
export const UserAvatarUpdateDocument = gql`
    mutation UserAvatarUpdate($image: Upload!) {
  userAvatarUpdate(image: $image) {
    errors {
      ...AccountError
    }
    user {
      id
      avatar {
        url
      }
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type UserAvatarUpdateMutationFn = Apollo.MutationFunction<Types.UserAvatarUpdateMutation, Types.UserAvatarUpdateMutationVariables>;

/**
 * __useUserAvatarUpdateMutation__
 *
 * To run a mutation, you first call `useUserAvatarUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserAvatarUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userAvatarUpdateMutation, { data, loading, error }] = useUserAvatarUpdateMutation({
 *   variables: {
 *      image: // value for 'image'
 *   },
 * });
 */
export function useUserAvatarUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UserAvatarUpdateMutation, Types.UserAvatarUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UserAvatarUpdateMutation, Types.UserAvatarUpdateMutationVariables>(UserAvatarUpdateDocument, options);
      }
export type UserAvatarUpdateMutationHookResult = ReturnType<typeof useUserAvatarUpdateMutation>;
export type UserAvatarUpdateMutationResult = Apollo.MutationResult<Types.UserAvatarUpdateMutation>;
export type UserAvatarUpdateMutationOptions = Apollo.BaseMutationOptions<Types.UserAvatarUpdateMutation, Types.UserAvatarUpdateMutationVariables>;
export const UserAvatarDeleteDocument = gql`
    mutation UserAvatarDelete {
  userAvatarDelete {
    errors {
      ...AccountError
    }
    user {
      id
      avatar {
        url
      }
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type UserAvatarDeleteMutationFn = Apollo.MutationFunction<Types.UserAvatarDeleteMutation, Types.UserAvatarDeleteMutationVariables>;

/**
 * __useUserAvatarDeleteMutation__
 *
 * To run a mutation, you first call `useUserAvatarDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserAvatarDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userAvatarDeleteMutation, { data, loading, error }] = useUserAvatarDeleteMutation({
 *   variables: {
 *   },
 * });
 */
export function useUserAvatarDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UserAvatarDeleteMutation, Types.UserAvatarDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UserAvatarDeleteMutation, Types.UserAvatarDeleteMutationVariables>(UserAvatarDeleteDocument, options);
      }
export type UserAvatarDeleteMutationHookResult = ReturnType<typeof useUserAvatarDeleteMutation>;
export type UserAvatarDeleteMutationResult = Apollo.MutationResult<Types.UserAvatarDeleteMutation>;
export type UserAvatarDeleteMutationOptions = Apollo.BaseMutationOptions<Types.UserAvatarDeleteMutation, Types.UserAvatarDeleteMutationVariables>;
export const ChangeUserPasswordDocument = gql`
    mutation ChangeUserPassword($newPassword: String!, $oldPassword: String!) {
  passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
    errors {
      ...AccountError
    }
  }
}
    ${AccountErrorFragmentDoc}`;
export type ChangeUserPasswordMutationFn = Apollo.MutationFunction<Types.ChangeUserPasswordMutation, Types.ChangeUserPasswordMutationVariables>;

/**
 * __useChangeUserPasswordMutation__
 *
 * To run a mutation, you first call `useChangeUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUserPasswordMutation, { data, loading, error }] = useChangeUserPasswordMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *      oldPassword: // value for 'oldPassword'
 *   },
 * });
 */
export function useChangeUserPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.ChangeUserPasswordMutation, Types.ChangeUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.ChangeUserPasswordMutation, Types.ChangeUserPasswordMutationVariables>(ChangeUserPasswordDocument, options);
      }
export type ChangeUserPasswordMutationHookResult = ReturnType<typeof useChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationResult = Apollo.MutationResult<Types.ChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationOptions = Apollo.BaseMutationOptions<Types.ChangeUserPasswordMutation, Types.ChangeUserPasswordMutationVariables>;
export const StaffListDocument = gql`
    query StaffList($first: Int, $after: String, $last: Int, $before: String, $filter: StaffUserInput, $sort: UserSortingInput) {
  staffUsers(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      cursor
      node {
        ...StaffMember
        avatar(size: 128) {
          url
        }
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
    ${StaffMemberFragmentDoc}`;

/**
 * __useStaffListQuery__
 *
 * To run a query within a React component, call `useStaffListQuery` and pass it any options that fit your needs.
 * When your component renders, `useStaffListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStaffListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useStaffListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.StaffListQuery, Types.StaffListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.StaffListQuery, Types.StaffListQueryVariables>(StaffListDocument, options);
      }
export function useStaffListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.StaffListQuery, Types.StaffListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.StaffListQuery, Types.StaffListQueryVariables>(StaffListDocument, options);
        }
export type StaffListQueryHookResult = ReturnType<typeof useStaffListQuery>;
export type StaffListLazyQueryHookResult = ReturnType<typeof useStaffListLazyQuery>;
export type StaffListQueryResult = Apollo.QueryResult<Types.StaffListQuery, Types.StaffListQueryVariables>;
export const StaffMemberDetailsDocument = gql`
    query StaffMemberDetails($id: ID!) {
  user(id: $id) {
    ...StaffMemberDetails
  }
}
    ${StaffMemberDetailsFragmentDoc}`;

/**
 * __useStaffMemberDetailsQuery__
 *
 * To run a query within a React component, call `useStaffMemberDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStaffMemberDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStaffMemberDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStaffMemberDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.StaffMemberDetailsQuery, Types.StaffMemberDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.StaffMemberDetailsQuery, Types.StaffMemberDetailsQueryVariables>(StaffMemberDetailsDocument, options);
      }
export function useStaffMemberDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.StaffMemberDetailsQuery, Types.StaffMemberDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.StaffMemberDetailsQuery, Types.StaffMemberDetailsQueryVariables>(StaffMemberDetailsDocument, options);
        }
export type StaffMemberDetailsQueryHookResult = ReturnType<typeof useStaffMemberDetailsQuery>;
export type StaffMemberDetailsLazyQueryHookResult = ReturnType<typeof useStaffMemberDetailsLazyQuery>;
export type StaffMemberDetailsQueryResult = Apollo.QueryResult<Types.StaffMemberDetailsQuery, Types.StaffMemberDetailsQueryVariables>;
export const MenuCreateDocument = gql`
    mutation MenuCreate($input: MenuCreateInput!) {
  menuCreate(input: $input) {
    errors {
      ...MenuError
    }
    menu {
      id
    }
  }
}
    ${MenuErrorFragmentDoc}`;
export type MenuCreateMutationFn = Apollo.MutationFunction<Types.MenuCreateMutation, Types.MenuCreateMutationVariables>;

/**
 * __useMenuCreateMutation__
 *
 * To run a mutation, you first call `useMenuCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMenuCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [menuCreateMutation, { data, loading, error }] = useMenuCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMenuCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MenuCreateMutation, Types.MenuCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MenuCreateMutation, Types.MenuCreateMutationVariables>(MenuCreateDocument, options);
      }
export type MenuCreateMutationHookResult = ReturnType<typeof useMenuCreateMutation>;
export type MenuCreateMutationResult = Apollo.MutationResult<Types.MenuCreateMutation>;
export type MenuCreateMutationOptions = Apollo.BaseMutationOptions<Types.MenuCreateMutation, Types.MenuCreateMutationVariables>;
export const MenuBulkDeleteDocument = gql`
    mutation MenuBulkDelete($ids: [ID!]!) {
  menuBulkDelete(ids: $ids) {
    errors {
      ...MenuError
    }
  }
}
    ${MenuErrorFragmentDoc}`;
export type MenuBulkDeleteMutationFn = Apollo.MutationFunction<Types.MenuBulkDeleteMutation, Types.MenuBulkDeleteMutationVariables>;

/**
 * __useMenuBulkDeleteMutation__
 *
 * To run a mutation, you first call `useMenuBulkDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMenuBulkDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [menuBulkDeleteMutation, { data, loading, error }] = useMenuBulkDeleteMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useMenuBulkDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MenuBulkDeleteMutation, Types.MenuBulkDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MenuBulkDeleteMutation, Types.MenuBulkDeleteMutationVariables>(MenuBulkDeleteDocument, options);
      }
export type MenuBulkDeleteMutationHookResult = ReturnType<typeof useMenuBulkDeleteMutation>;
export type MenuBulkDeleteMutationResult = Apollo.MutationResult<Types.MenuBulkDeleteMutation>;
export type MenuBulkDeleteMutationOptions = Apollo.BaseMutationOptions<Types.MenuBulkDeleteMutation, Types.MenuBulkDeleteMutationVariables>;
export const MenuDeleteDocument = gql`
    mutation MenuDelete($id: ID!) {
  menuDelete(id: $id) {
    errors {
      ...MenuError
    }
  }
}
    ${MenuErrorFragmentDoc}`;
export type MenuDeleteMutationFn = Apollo.MutationFunction<Types.MenuDeleteMutation, Types.MenuDeleteMutationVariables>;

/**
 * __useMenuDeleteMutation__
 *
 * To run a mutation, you first call `useMenuDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMenuDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [menuDeleteMutation, { data, loading, error }] = useMenuDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMenuDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MenuDeleteMutation, Types.MenuDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MenuDeleteMutation, Types.MenuDeleteMutationVariables>(MenuDeleteDocument, options);
      }
export type MenuDeleteMutationHookResult = ReturnType<typeof useMenuDeleteMutation>;
export type MenuDeleteMutationResult = Apollo.MutationResult<Types.MenuDeleteMutation>;
export type MenuDeleteMutationOptions = Apollo.BaseMutationOptions<Types.MenuDeleteMutation, Types.MenuDeleteMutationVariables>;
export const MenuItemCreateDocument = gql`
    mutation MenuItemCreate($input: MenuItemCreateInput!) {
  menuItemCreate(input: $input) {
    errors {
      ...MenuError
    }
    menuItem {
      menu {
        id
        items {
          ...MenuItemNested
        }
      }
    }
  }
}
    ${MenuErrorFragmentDoc}
${MenuItemNestedFragmentDoc}`;
export type MenuItemCreateMutationFn = Apollo.MutationFunction<Types.MenuItemCreateMutation, Types.MenuItemCreateMutationVariables>;

/**
 * __useMenuItemCreateMutation__
 *
 * To run a mutation, you first call `useMenuItemCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMenuItemCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [menuItemCreateMutation, { data, loading, error }] = useMenuItemCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMenuItemCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MenuItemCreateMutation, Types.MenuItemCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MenuItemCreateMutation, Types.MenuItemCreateMutationVariables>(MenuItemCreateDocument, options);
      }
export type MenuItemCreateMutationHookResult = ReturnType<typeof useMenuItemCreateMutation>;
export type MenuItemCreateMutationResult = Apollo.MutationResult<Types.MenuItemCreateMutation>;
export type MenuItemCreateMutationOptions = Apollo.BaseMutationOptions<Types.MenuItemCreateMutation, Types.MenuItemCreateMutationVariables>;
export const MenuUpdateDocument = gql`
    mutation MenuUpdate($id: ID!, $name: String!, $moves: [MenuItemMoveInput!]!, $removeIds: [ID!]!) {
  menuUpdate(id: $id, input: {name: $name}) {
    errors {
      ...MenuError
    }
  }
  menuItemMove(menu: $id, moves: $moves) {
    errors {
      ...MenuError
    }
  }
  menuItemBulkDelete(ids: $removeIds) {
    errors {
      ...MenuError
    }
  }
}
    ${MenuErrorFragmentDoc}`;
export type MenuUpdateMutationFn = Apollo.MutationFunction<Types.MenuUpdateMutation, Types.MenuUpdateMutationVariables>;

/**
 * __useMenuUpdateMutation__
 *
 * To run a mutation, you first call `useMenuUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMenuUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [menuUpdateMutation, { data, loading, error }] = useMenuUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      moves: // value for 'moves'
 *      removeIds: // value for 'removeIds'
 *   },
 * });
 */
export function useMenuUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MenuUpdateMutation, Types.MenuUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MenuUpdateMutation, Types.MenuUpdateMutationVariables>(MenuUpdateDocument, options);
      }
export type MenuUpdateMutationHookResult = ReturnType<typeof useMenuUpdateMutation>;
export type MenuUpdateMutationResult = Apollo.MutationResult<Types.MenuUpdateMutation>;
export type MenuUpdateMutationOptions = Apollo.BaseMutationOptions<Types.MenuUpdateMutation, Types.MenuUpdateMutationVariables>;
export const MenuItemUpdateDocument = gql`
    mutation MenuItemUpdate($id: ID!, $input: MenuItemInput!) {
  menuItemUpdate(id: $id, input: $input) {
    errors {
      ...MenuError
    }
    menuItem {
      ...MenuItem
    }
  }
}
    ${MenuErrorFragmentDoc}
${MenuItemFragmentDoc}`;
export type MenuItemUpdateMutationFn = Apollo.MutationFunction<Types.MenuItemUpdateMutation, Types.MenuItemUpdateMutationVariables>;

/**
 * __useMenuItemUpdateMutation__
 *
 * To run a mutation, you first call `useMenuItemUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMenuItemUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [menuItemUpdateMutation, { data, loading, error }] = useMenuItemUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMenuItemUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.MenuItemUpdateMutation, Types.MenuItemUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.MenuItemUpdateMutation, Types.MenuItemUpdateMutationVariables>(MenuItemUpdateDocument, options);
      }
export type MenuItemUpdateMutationHookResult = ReturnType<typeof useMenuItemUpdateMutation>;
export type MenuItemUpdateMutationResult = Apollo.MutationResult<Types.MenuItemUpdateMutation>;
export type MenuItemUpdateMutationOptions = Apollo.BaseMutationOptions<Types.MenuItemUpdateMutation, Types.MenuItemUpdateMutationVariables>;
export const MenuListDocument = gql`
    query MenuList($first: Int, $after: String, $last: Int, $before: String, $sort: MenuSortingInput) {
  menus(first: $first, after: $after, before: $before, last: $last, sortBy: $sort) {
    edges {
      node {
        ...Menu
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${MenuFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useMenuListQuery__
 *
 * To run a query within a React component, call `useMenuListQuery` and pass it any options that fit your needs.
 * When your component renders, `useMenuListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMenuListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useMenuListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.MenuListQuery, Types.MenuListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.MenuListQuery, Types.MenuListQueryVariables>(MenuListDocument, options);
      }
export function useMenuListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.MenuListQuery, Types.MenuListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.MenuListQuery, Types.MenuListQueryVariables>(MenuListDocument, options);
        }
export type MenuListQueryHookResult = ReturnType<typeof useMenuListQuery>;
export type MenuListLazyQueryHookResult = ReturnType<typeof useMenuListLazyQuery>;
export type MenuListQueryResult = Apollo.QueryResult<Types.MenuListQuery, Types.MenuListQueryVariables>;
export const MenuDetailsDocument = gql`
    query MenuDetails($id: ID!) {
  menu(id: $id) {
    ...MenuDetails
  }
}
    ${MenuDetailsFragmentDoc}`;

/**
 * __useMenuDetailsQuery__
 *
 * To run a query within a React component, call `useMenuDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMenuDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMenuDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMenuDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.MenuDetailsQuery, Types.MenuDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.MenuDetailsQuery, Types.MenuDetailsQueryVariables>(MenuDetailsDocument, options);
      }
export function useMenuDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.MenuDetailsQuery, Types.MenuDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.MenuDetailsQuery, Types.MenuDetailsQueryVariables>(MenuDetailsDocument, options);
        }
export type MenuDetailsQueryHookResult = ReturnType<typeof useMenuDetailsQuery>;
export type MenuDetailsLazyQueryHookResult = ReturnType<typeof useMenuDetailsLazyQuery>;
export type MenuDetailsQueryResult = Apollo.QueryResult<Types.MenuDetailsQuery, Types.MenuDetailsQueryVariables>;
export const TaxConfigurationUpdateDocument = gql`
    mutation TaxConfigurationUpdate($id: ID!, $input: TaxConfigurationUpdateInput!) {
  taxConfigurationUpdate(id: $id, input: $input) {
    errors {
      ...TaxConfigurationUpdateError
    }
    taxConfiguration {
      ...TaxConfiguration
    }
  }
}
    ${TaxConfigurationUpdateErrorFragmentDoc}
${TaxConfigurationFragmentDoc}`;
export type TaxConfigurationUpdateMutationFn = Apollo.MutationFunction<Types.TaxConfigurationUpdateMutation, Types.TaxConfigurationUpdateMutationVariables>;

/**
 * __useTaxConfigurationUpdateMutation__
 *
 * To run a mutation, you first call `useTaxConfigurationUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTaxConfigurationUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [taxConfigurationUpdateMutation, { data, loading, error }] = useTaxConfigurationUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTaxConfigurationUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.TaxConfigurationUpdateMutation, Types.TaxConfigurationUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.TaxConfigurationUpdateMutation, Types.TaxConfigurationUpdateMutationVariables>(TaxConfigurationUpdateDocument, options);
      }
export type TaxConfigurationUpdateMutationHookResult = ReturnType<typeof useTaxConfigurationUpdateMutation>;
export type TaxConfigurationUpdateMutationResult = Apollo.MutationResult<Types.TaxConfigurationUpdateMutation>;
export type TaxConfigurationUpdateMutationOptions = Apollo.BaseMutationOptions<Types.TaxConfigurationUpdateMutation, Types.TaxConfigurationUpdateMutationVariables>;
export const TaxCountryConfigurationUpdateDocument = gql`
    mutation TaxCountryConfigurationUpdate($countryCode: CountryCode!, $updateTaxClassRates: [TaxClassRateInput!]!) {
  taxCountryConfigurationUpdate(
    countryCode: $countryCode
    updateTaxClassRates: $updateTaxClassRates
  ) {
    errors {
      ...TaxCountryConfigurationUpdateError
    }
    taxCountryConfiguration {
      ...TaxCountryConfiguration
    }
  }
}
    ${TaxCountryConfigurationUpdateErrorFragmentDoc}
${TaxCountryConfigurationFragmentDoc}`;
export type TaxCountryConfigurationUpdateMutationFn = Apollo.MutationFunction<Types.TaxCountryConfigurationUpdateMutation, Types.TaxCountryConfigurationUpdateMutationVariables>;

/**
 * __useTaxCountryConfigurationUpdateMutation__
 *
 * To run a mutation, you first call `useTaxCountryConfigurationUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTaxCountryConfigurationUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [taxCountryConfigurationUpdateMutation, { data, loading, error }] = useTaxCountryConfigurationUpdateMutation({
 *   variables: {
 *      countryCode: // value for 'countryCode'
 *      updateTaxClassRates: // value for 'updateTaxClassRates'
 *   },
 * });
 */
export function useTaxCountryConfigurationUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.TaxCountryConfigurationUpdateMutation, Types.TaxCountryConfigurationUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.TaxCountryConfigurationUpdateMutation, Types.TaxCountryConfigurationUpdateMutationVariables>(TaxCountryConfigurationUpdateDocument, options);
      }
export type TaxCountryConfigurationUpdateMutationHookResult = ReturnType<typeof useTaxCountryConfigurationUpdateMutation>;
export type TaxCountryConfigurationUpdateMutationResult = Apollo.MutationResult<Types.TaxCountryConfigurationUpdateMutation>;
export type TaxCountryConfigurationUpdateMutationOptions = Apollo.BaseMutationOptions<Types.TaxCountryConfigurationUpdateMutation, Types.TaxCountryConfigurationUpdateMutationVariables>;
export const TaxCountryConfigurationDeleteDocument = gql`
    mutation TaxCountryConfigurationDelete($countryCode: CountryCode!) {
  taxCountryConfigurationDelete(countryCode: $countryCode) {
    errors {
      ...TaxCountryConfigurationDeleteError
    }
    taxCountryConfiguration {
      ...TaxCountryConfiguration
    }
  }
}
    ${TaxCountryConfigurationDeleteErrorFragmentDoc}
${TaxCountryConfigurationFragmentDoc}`;
export type TaxCountryConfigurationDeleteMutationFn = Apollo.MutationFunction<Types.TaxCountryConfigurationDeleteMutation, Types.TaxCountryConfigurationDeleteMutationVariables>;

/**
 * __useTaxCountryConfigurationDeleteMutation__
 *
 * To run a mutation, you first call `useTaxCountryConfigurationDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTaxCountryConfigurationDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [taxCountryConfigurationDeleteMutation, { data, loading, error }] = useTaxCountryConfigurationDeleteMutation({
 *   variables: {
 *      countryCode: // value for 'countryCode'
 *   },
 * });
 */
export function useTaxCountryConfigurationDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.TaxCountryConfigurationDeleteMutation, Types.TaxCountryConfigurationDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.TaxCountryConfigurationDeleteMutation, Types.TaxCountryConfigurationDeleteMutationVariables>(TaxCountryConfigurationDeleteDocument, options);
      }
export type TaxCountryConfigurationDeleteMutationHookResult = ReturnType<typeof useTaxCountryConfigurationDeleteMutation>;
export type TaxCountryConfigurationDeleteMutationResult = Apollo.MutationResult<Types.TaxCountryConfigurationDeleteMutation>;
export type TaxCountryConfigurationDeleteMutationOptions = Apollo.BaseMutationOptions<Types.TaxCountryConfigurationDeleteMutation, Types.TaxCountryConfigurationDeleteMutationVariables>;
export const TaxClassUpdateDocument = gql`
    mutation TaxClassUpdate($id: ID!, $input: TaxClassUpdateInput!) {
  taxClassUpdate(id: $id, input: $input) {
    errors {
      ...TaxClassUpdateError
    }
    taxClass {
      ...TaxClass
    }
  }
}
    ${TaxClassUpdateErrorFragmentDoc}
${TaxClassFragmentDoc}`;
export type TaxClassUpdateMutationFn = Apollo.MutationFunction<Types.TaxClassUpdateMutation, Types.TaxClassUpdateMutationVariables>;

/**
 * __useTaxClassUpdateMutation__
 *
 * To run a mutation, you first call `useTaxClassUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTaxClassUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [taxClassUpdateMutation, { data, loading, error }] = useTaxClassUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTaxClassUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.TaxClassUpdateMutation, Types.TaxClassUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.TaxClassUpdateMutation, Types.TaxClassUpdateMutationVariables>(TaxClassUpdateDocument, options);
      }
export type TaxClassUpdateMutationHookResult = ReturnType<typeof useTaxClassUpdateMutation>;
export type TaxClassUpdateMutationResult = Apollo.MutationResult<Types.TaxClassUpdateMutation>;
export type TaxClassUpdateMutationOptions = Apollo.BaseMutationOptions<Types.TaxClassUpdateMutation, Types.TaxClassUpdateMutationVariables>;
export const TaxClassCreateDocument = gql`
    mutation TaxClassCreate($input: TaxClassCreateInput!) {
  taxClassCreate(input: $input) {
    errors {
      ...TaxClassCreateError
    }
    taxClass {
      ...TaxClass
    }
  }
}
    ${TaxClassCreateErrorFragmentDoc}
${TaxClassFragmentDoc}`;
export type TaxClassCreateMutationFn = Apollo.MutationFunction<Types.TaxClassCreateMutation, Types.TaxClassCreateMutationVariables>;

/**
 * __useTaxClassCreateMutation__
 *
 * To run a mutation, you first call `useTaxClassCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTaxClassCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [taxClassCreateMutation, { data, loading, error }] = useTaxClassCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTaxClassCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.TaxClassCreateMutation, Types.TaxClassCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.TaxClassCreateMutation, Types.TaxClassCreateMutationVariables>(TaxClassCreateDocument, options);
      }
export type TaxClassCreateMutationHookResult = ReturnType<typeof useTaxClassCreateMutation>;
export type TaxClassCreateMutationResult = Apollo.MutationResult<Types.TaxClassCreateMutation>;
export type TaxClassCreateMutationOptions = Apollo.BaseMutationOptions<Types.TaxClassCreateMutation, Types.TaxClassCreateMutationVariables>;
export const TaxClassDeleteDocument = gql`
    mutation TaxClassDelete($id: ID!) {
  taxClassDelete(id: $id) {
    errors {
      ...TaxClassDeleteError
    }
  }
}
    ${TaxClassDeleteErrorFragmentDoc}`;
export type TaxClassDeleteMutationFn = Apollo.MutationFunction<Types.TaxClassDeleteMutation, Types.TaxClassDeleteMutationVariables>;

/**
 * __useTaxClassDeleteMutation__
 *
 * To run a mutation, you first call `useTaxClassDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTaxClassDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [taxClassDeleteMutation, { data, loading, error }] = useTaxClassDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTaxClassDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.TaxClassDeleteMutation, Types.TaxClassDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.TaxClassDeleteMutation, Types.TaxClassDeleteMutationVariables>(TaxClassDeleteDocument, options);
      }
export type TaxClassDeleteMutationHookResult = ReturnType<typeof useTaxClassDeleteMutation>;
export type TaxClassDeleteMutationResult = Apollo.MutationResult<Types.TaxClassDeleteMutation>;
export type TaxClassDeleteMutationOptions = Apollo.BaseMutationOptions<Types.TaxClassDeleteMutation, Types.TaxClassDeleteMutationVariables>;
export const TaxConfigurationsListDocument = gql`
    query TaxConfigurationsList($before: String, $after: String, $first: Int, $last: Int, $filter: TaxConfigurationFilterInput) {
  taxConfigurations(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
  ) {
    edges {
      node {
        ...TaxConfiguration
      }
    }
  }
}
    ${TaxConfigurationFragmentDoc}`;

/**
 * __useTaxConfigurationsListQuery__
 *
 * To run a query within a React component, call `useTaxConfigurationsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaxConfigurationsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaxConfigurationsListQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useTaxConfigurationsListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.TaxConfigurationsListQuery, Types.TaxConfigurationsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.TaxConfigurationsListQuery, Types.TaxConfigurationsListQueryVariables>(TaxConfigurationsListDocument, options);
      }
export function useTaxConfigurationsListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.TaxConfigurationsListQuery, Types.TaxConfigurationsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.TaxConfigurationsListQuery, Types.TaxConfigurationsListQueryVariables>(TaxConfigurationsListDocument, options);
        }
export type TaxConfigurationsListQueryHookResult = ReturnType<typeof useTaxConfigurationsListQuery>;
export type TaxConfigurationsListLazyQueryHookResult = ReturnType<typeof useTaxConfigurationsListLazyQuery>;
export type TaxConfigurationsListQueryResult = Apollo.QueryResult<Types.TaxConfigurationsListQuery, Types.TaxConfigurationsListQueryVariables>;
export const TaxCountriesListDocument = gql`
    query TaxCountriesList {
  taxCountryConfigurations {
    ...TaxCountryConfiguration
  }
}
    ${TaxCountryConfigurationFragmentDoc}`;

/**
 * __useTaxCountriesListQuery__
 *
 * To run a query within a React component, call `useTaxCountriesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaxCountriesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaxCountriesListQuery({
 *   variables: {
 *   },
 * });
 */
export function useTaxCountriesListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.TaxCountriesListQuery, Types.TaxCountriesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.TaxCountriesListQuery, Types.TaxCountriesListQueryVariables>(TaxCountriesListDocument, options);
      }
export function useTaxCountriesListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.TaxCountriesListQuery, Types.TaxCountriesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.TaxCountriesListQuery, Types.TaxCountriesListQueryVariables>(TaxCountriesListDocument, options);
        }
export type TaxCountriesListQueryHookResult = ReturnType<typeof useTaxCountriesListQuery>;
export type TaxCountriesListLazyQueryHookResult = ReturnType<typeof useTaxCountriesListLazyQuery>;
export type TaxCountriesListQueryResult = Apollo.QueryResult<Types.TaxCountriesListQuery, Types.TaxCountriesListQueryVariables>;
export const TaxClassesListDocument = gql`
    query TaxClassesList($before: String, $after: String, $first: Int, $last: Int, $filter: TaxClassFilterInput, $sortBy: TaxClassSortingInput) {
  taxClasses(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
    sortBy: $sortBy
  ) {
    edges {
      node {
        ...TaxClass
      }
    }
  }
}
    ${TaxClassFragmentDoc}`;

/**
 * __useTaxClassesListQuery__
 *
 * To run a query within a React component, call `useTaxClassesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaxClassesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaxClassesListQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useTaxClassesListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.TaxClassesListQuery, Types.TaxClassesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.TaxClassesListQuery, Types.TaxClassesListQueryVariables>(TaxClassesListDocument, options);
      }
export function useTaxClassesListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.TaxClassesListQuery, Types.TaxClassesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.TaxClassesListQuery, Types.TaxClassesListQueryVariables>(TaxClassesListDocument, options);
        }
export type TaxClassesListQueryHookResult = ReturnType<typeof useTaxClassesListQuery>;
export type TaxClassesListLazyQueryHookResult = ReturnType<typeof useTaxClassesListLazyQuery>;
export type TaxClassesListQueryResult = Apollo.QueryResult<Types.TaxClassesListQuery, Types.TaxClassesListQueryVariables>;
export const TaxClassAssignDocument = gql`
    query TaxClassAssign($first: Int, $after: String) {
  taxClasses(first: $first, after: $after) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
    `;

/**
 * __useTaxClassAssignQuery__
 *
 * To run a query within a React component, call `useTaxClassAssignQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaxClassAssignQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaxClassAssignQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useTaxClassAssignQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.TaxClassAssignQuery, Types.TaxClassAssignQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.TaxClassAssignQuery, Types.TaxClassAssignQueryVariables>(TaxClassAssignDocument, options);
      }
export function useTaxClassAssignLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.TaxClassAssignQuery, Types.TaxClassAssignQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.TaxClassAssignQuery, Types.TaxClassAssignQueryVariables>(TaxClassAssignDocument, options);
        }
export type TaxClassAssignQueryHookResult = ReturnType<typeof useTaxClassAssignQuery>;
export type TaxClassAssignLazyQueryHookResult = ReturnType<typeof useTaxClassAssignLazyQuery>;
export type TaxClassAssignQueryResult = Apollo.QueryResult<Types.TaxClassAssignQuery, Types.TaxClassAssignQueryVariables>;
export const TaxStrategyChoicesDocument = gql`
    query TaxStrategyChoices {
  shop {
    availableTaxApps {
      id
      name
      version
      identifier
      created
      brand {
        logo {
          default
        }
      }
    }
  }
}
    `;

/**
 * __useTaxStrategyChoicesQuery__
 *
 * To run a query within a React component, call `useTaxStrategyChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaxStrategyChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaxStrategyChoicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTaxStrategyChoicesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.TaxStrategyChoicesQuery, Types.TaxStrategyChoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.TaxStrategyChoicesQuery, Types.TaxStrategyChoicesQueryVariables>(TaxStrategyChoicesDocument, options);
      }
export function useTaxStrategyChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.TaxStrategyChoicesQuery, Types.TaxStrategyChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.TaxStrategyChoicesQuery, Types.TaxStrategyChoicesQueryVariables>(TaxStrategyChoicesDocument, options);
        }
export type TaxStrategyChoicesQueryHookResult = ReturnType<typeof useTaxStrategyChoicesQuery>;
export type TaxStrategyChoicesLazyQueryHookResult = ReturnType<typeof useTaxStrategyChoicesLazyQuery>;
export type TaxStrategyChoicesQueryResult = Apollo.QueryResult<Types.TaxStrategyChoicesQuery, Types.TaxStrategyChoicesQueryVariables>;
export const UpdateProductTranslationsDocument = gql`
    mutation UpdateProductTranslations($id: ID!, $input: TranslationInput!, $language: LanguageCodeEnum!) {
  productTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...ProductTranslateErrorFragment
    }
    product {
      id
      name
      description
      seoDescription
      seoTitle
      translation(languageCode: $language) {
        id
        description
        language {
          code
          language
        }
        name
        seoDescription
        seoTitle
      }
    }
  }
}
    ${ProductTranslateErrorFragmentFragmentDoc}`;
export type UpdateProductTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateProductTranslationsMutation, Types.UpdateProductTranslationsMutationVariables>;

/**
 * __useUpdateProductTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateProductTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductTranslationsMutation, { data, loading, error }] = useUpdateProductTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateProductTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateProductTranslationsMutation, Types.UpdateProductTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateProductTranslationsMutation, Types.UpdateProductTranslationsMutationVariables>(UpdateProductTranslationsDocument, options);
      }
export type UpdateProductTranslationsMutationHookResult = ReturnType<typeof useUpdateProductTranslationsMutation>;
export type UpdateProductTranslationsMutationResult = Apollo.MutationResult<Types.UpdateProductTranslationsMutation>;
export type UpdateProductTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateProductTranslationsMutation, Types.UpdateProductTranslationsMutationVariables>;
export const UpdateProductVariantTranslationsDocument = gql`
    mutation UpdateProductVariantTranslations($id: ID!, $input: NameTranslationInput!, $language: LanguageCodeEnum!) {
  productVariantTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...ProductVariantTranslateErrorFragment
    }
    productVariant {
      id
      name
      translation(languageCode: $language) {
        id
        name
        language {
          code
          language
        }
      }
    }
  }
}
    ${ProductVariantTranslateErrorFragmentFragmentDoc}`;
export type UpdateProductVariantTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateProductVariantTranslationsMutation, Types.UpdateProductVariantTranslationsMutationVariables>;

/**
 * __useUpdateProductVariantTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateProductVariantTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductVariantTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductVariantTranslationsMutation, { data, loading, error }] = useUpdateProductVariantTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateProductVariantTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateProductVariantTranslationsMutation, Types.UpdateProductVariantTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateProductVariantTranslationsMutation, Types.UpdateProductVariantTranslationsMutationVariables>(UpdateProductVariantTranslationsDocument, options);
      }
export type UpdateProductVariantTranslationsMutationHookResult = ReturnType<typeof useUpdateProductVariantTranslationsMutation>;
export type UpdateProductVariantTranslationsMutationResult = Apollo.MutationResult<Types.UpdateProductVariantTranslationsMutation>;
export type UpdateProductVariantTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateProductVariantTranslationsMutation, Types.UpdateProductVariantTranslationsMutationVariables>;
export const UpdateCategoryTranslationsDocument = gql`
    mutation UpdateCategoryTranslations($id: ID!, $input: TranslationInput!, $language: LanguageCodeEnum!) {
  categoryTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...CategoryTranslateErrorFragment
    }
    category {
      id
      name
      description
      seoDescription
      seoTitle
      translation(languageCode: $language) {
        id
        description
        language {
          language
        }
        name
        seoDescription
        seoTitle
      }
    }
  }
}
    ${CategoryTranslateErrorFragmentFragmentDoc}`;
export type UpdateCategoryTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateCategoryTranslationsMutation, Types.UpdateCategoryTranslationsMutationVariables>;

/**
 * __useUpdateCategoryTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryTranslationsMutation, { data, loading, error }] = useUpdateCategoryTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateCategoryTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateCategoryTranslationsMutation, Types.UpdateCategoryTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateCategoryTranslationsMutation, Types.UpdateCategoryTranslationsMutationVariables>(UpdateCategoryTranslationsDocument, options);
      }
export type UpdateCategoryTranslationsMutationHookResult = ReturnType<typeof useUpdateCategoryTranslationsMutation>;
export type UpdateCategoryTranslationsMutationResult = Apollo.MutationResult<Types.UpdateCategoryTranslationsMutation>;
export type UpdateCategoryTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateCategoryTranslationsMutation, Types.UpdateCategoryTranslationsMutationVariables>;
export const UpdateCollectionTranslationsDocument = gql`
    mutation UpdateCollectionTranslations($id: ID!, $input: TranslationInput!, $language: LanguageCodeEnum!) {
  collectionTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...CollectionTranslateErrorFragment
    }
    collection {
      id
      name
      description
      seoDescription
      seoTitle
      translation(languageCode: $language) {
        id
        description
        language {
          language
        }
        name
        seoDescription
        seoTitle
      }
    }
  }
}
    ${CollectionTranslateErrorFragmentFragmentDoc}`;
export type UpdateCollectionTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateCollectionTranslationsMutation, Types.UpdateCollectionTranslationsMutationVariables>;

/**
 * __useUpdateCollectionTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionTranslationsMutation, { data, loading, error }] = useUpdateCollectionTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateCollectionTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateCollectionTranslationsMutation, Types.UpdateCollectionTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateCollectionTranslationsMutation, Types.UpdateCollectionTranslationsMutationVariables>(UpdateCollectionTranslationsDocument, options);
      }
export type UpdateCollectionTranslationsMutationHookResult = ReturnType<typeof useUpdateCollectionTranslationsMutation>;
export type UpdateCollectionTranslationsMutationResult = Apollo.MutationResult<Types.UpdateCollectionTranslationsMutation>;
export type UpdateCollectionTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateCollectionTranslationsMutation, Types.UpdateCollectionTranslationsMutationVariables>;
export const UpdatePageTranslationsDocument = gql`
    mutation UpdatePageTranslations($id: ID!, $input: PageTranslationInput!, $language: LanguageCodeEnum!) {
  pageTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...PageTranslateErrorFragment
    }
    page {
      ...PageTranslation
    }
  }
}
    ${PageTranslateErrorFragmentFragmentDoc}
${PageTranslationFragmentDoc}`;
export type UpdatePageTranslationsMutationFn = Apollo.MutationFunction<Types.UpdatePageTranslationsMutation, Types.UpdatePageTranslationsMutationVariables>;

/**
 * __useUpdatePageTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdatePageTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePageTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePageTranslationsMutation, { data, loading, error }] = useUpdatePageTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdatePageTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdatePageTranslationsMutation, Types.UpdatePageTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdatePageTranslationsMutation, Types.UpdatePageTranslationsMutationVariables>(UpdatePageTranslationsDocument, options);
      }
export type UpdatePageTranslationsMutationHookResult = ReturnType<typeof useUpdatePageTranslationsMutation>;
export type UpdatePageTranslationsMutationResult = Apollo.MutationResult<Types.UpdatePageTranslationsMutation>;
export type UpdatePageTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdatePageTranslationsMutation, Types.UpdatePageTranslationsMutationVariables>;
export const UpdateVoucherTranslationsDocument = gql`
    mutation UpdateVoucherTranslations($id: ID!, $input: NameTranslationInput!, $language: LanguageCodeEnum!) {
  voucherTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...VoucherTranslateErrorFragment
    }
    voucher {
      id
      name
      translation(languageCode: $language) {
        id
        language {
          code
          language
        }
        name
      }
    }
  }
}
    ${VoucherTranslateErrorFragmentFragmentDoc}`;
export type UpdateVoucherTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateVoucherTranslationsMutation, Types.UpdateVoucherTranslationsMutationVariables>;

/**
 * __useUpdateVoucherTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateVoucherTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVoucherTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVoucherTranslationsMutation, { data, loading, error }] = useUpdateVoucherTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateVoucherTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateVoucherTranslationsMutation, Types.UpdateVoucherTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateVoucherTranslationsMutation, Types.UpdateVoucherTranslationsMutationVariables>(UpdateVoucherTranslationsDocument, options);
      }
export type UpdateVoucherTranslationsMutationHookResult = ReturnType<typeof useUpdateVoucherTranslationsMutation>;
export type UpdateVoucherTranslationsMutationResult = Apollo.MutationResult<Types.UpdateVoucherTranslationsMutation>;
export type UpdateVoucherTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateVoucherTranslationsMutation, Types.UpdateVoucherTranslationsMutationVariables>;
export const UpdateSaleTranslationsDocument = gql`
    mutation UpdateSaleTranslations($id: ID!, $input: NameTranslationInput!, $language: LanguageCodeEnum!) {
  saleTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...SaleTranslateErrorFragment
    }
    sale {
      id
      name
      translation(languageCode: $language) {
        id
        language {
          code
          language
        }
        name
      }
    }
  }
}
    ${SaleTranslateErrorFragmentFragmentDoc}`;
export type UpdateSaleTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateSaleTranslationsMutation, Types.UpdateSaleTranslationsMutationVariables>;

/**
 * __useUpdateSaleTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateSaleTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSaleTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSaleTranslationsMutation, { data, loading, error }] = useUpdateSaleTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateSaleTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateSaleTranslationsMutation, Types.UpdateSaleTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateSaleTranslationsMutation, Types.UpdateSaleTranslationsMutationVariables>(UpdateSaleTranslationsDocument, options);
      }
export type UpdateSaleTranslationsMutationHookResult = ReturnType<typeof useUpdateSaleTranslationsMutation>;
export type UpdateSaleTranslationsMutationResult = Apollo.MutationResult<Types.UpdateSaleTranslationsMutation>;
export type UpdateSaleTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateSaleTranslationsMutation, Types.UpdateSaleTranslationsMutationVariables>;
export const UpdateAttributeTranslationsDocument = gql`
    mutation UpdateAttributeTranslations($id: ID!, $input: NameTranslationInput!, $language: LanguageCodeEnum!) {
  attributeTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...AttributeTranslateErrorFragment
    }
    attribute {
      id
      name
      translation(languageCode: $language) {
        id
        name
      }
    }
  }
}
    ${AttributeTranslateErrorFragmentFragmentDoc}`;
export type UpdateAttributeTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateAttributeTranslationsMutation, Types.UpdateAttributeTranslationsMutationVariables>;

/**
 * __useUpdateAttributeTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeTranslationsMutation, { data, loading, error }] = useUpdateAttributeTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateAttributeTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateAttributeTranslationsMutation, Types.UpdateAttributeTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateAttributeTranslationsMutation, Types.UpdateAttributeTranslationsMutationVariables>(UpdateAttributeTranslationsDocument, options);
      }
export type UpdateAttributeTranslationsMutationHookResult = ReturnType<typeof useUpdateAttributeTranslationsMutation>;
export type UpdateAttributeTranslationsMutationResult = Apollo.MutationResult<Types.UpdateAttributeTranslationsMutation>;
export type UpdateAttributeTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateAttributeTranslationsMutation, Types.UpdateAttributeTranslationsMutationVariables>;
export const UpdateAttributeValueTranslationsDocument = gql`
    mutation UpdateAttributeValueTranslations($id: ID!, $input: AttributeValueTranslationInput!, $language: LanguageCodeEnum!) {
  attributeValueTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...AttributeValueTranslateErrorFragment
    }
    attributeValue {
      id
      name
      richText
      translation(languageCode: $language) {
        id
        name
        richText
      }
    }
  }
}
    ${AttributeValueTranslateErrorFragmentFragmentDoc}`;
export type UpdateAttributeValueTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateAttributeValueTranslationsMutation, Types.UpdateAttributeValueTranslationsMutationVariables>;

/**
 * __useUpdateAttributeValueTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateAttributeValueTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttributeValueTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttributeValueTranslationsMutation, { data, loading, error }] = useUpdateAttributeValueTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateAttributeValueTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateAttributeValueTranslationsMutation, Types.UpdateAttributeValueTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateAttributeValueTranslationsMutation, Types.UpdateAttributeValueTranslationsMutationVariables>(UpdateAttributeValueTranslationsDocument, options);
      }
export type UpdateAttributeValueTranslationsMutationHookResult = ReturnType<typeof useUpdateAttributeValueTranslationsMutation>;
export type UpdateAttributeValueTranslationsMutationResult = Apollo.MutationResult<Types.UpdateAttributeValueTranslationsMutation>;
export type UpdateAttributeValueTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateAttributeValueTranslationsMutation, Types.UpdateAttributeValueTranslationsMutationVariables>;
export const UpdateShippingMethodTranslationsDocument = gql`
    mutation UpdateShippingMethodTranslations($id: ID!, $input: ShippingPriceTranslationInput!, $language: LanguageCodeEnum!) {
  shippingPriceTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      ...ShippingPriceTranslateErrorFragment
    }
    shippingMethod {
      id
      name
      description
      translation(languageCode: $language) {
        id
        language {
          language
        }
        name
        description
      }
    }
  }
}
    ${ShippingPriceTranslateErrorFragmentFragmentDoc}`;
export type UpdateShippingMethodTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateShippingMethodTranslationsMutation, Types.UpdateShippingMethodTranslationsMutationVariables>;

/**
 * __useUpdateShippingMethodTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateShippingMethodTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShippingMethodTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShippingMethodTranslationsMutation, { data, loading, error }] = useUpdateShippingMethodTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateShippingMethodTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateShippingMethodTranslationsMutation, Types.UpdateShippingMethodTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateShippingMethodTranslationsMutation, Types.UpdateShippingMethodTranslationsMutationVariables>(UpdateShippingMethodTranslationsDocument, options);
      }
export type UpdateShippingMethodTranslationsMutationHookResult = ReturnType<typeof useUpdateShippingMethodTranslationsMutation>;
export type UpdateShippingMethodTranslationsMutationResult = Apollo.MutationResult<Types.UpdateShippingMethodTranslationsMutation>;
export type UpdateShippingMethodTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateShippingMethodTranslationsMutation, Types.UpdateShippingMethodTranslationsMutationVariables>;
export const UpdateMenuItemTranslationsDocument = gql`
    mutation UpdateMenuItemTranslations($id: ID!, $input: NameTranslationInput!, $language: LanguageCodeEnum!) {
  menuItemTranslate(id: $id, input: $input, languageCode: $language) {
    errors {
      field
      message
    }
    menuItem {
      id
      name
      translation(languageCode: $language) {
        id
        language {
          language
        }
        name
      }
    }
  }
}
    `;
export type UpdateMenuItemTranslationsMutationFn = Apollo.MutationFunction<Types.UpdateMenuItemTranslationsMutation, Types.UpdateMenuItemTranslationsMutationVariables>;

/**
 * __useUpdateMenuItemTranslationsMutation__
 *
 * To run a mutation, you first call `useUpdateMenuItemTranslationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMenuItemTranslationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMenuItemTranslationsMutation, { data, loading, error }] = useUpdateMenuItemTranslationsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUpdateMenuItemTranslationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateMenuItemTranslationsMutation, Types.UpdateMenuItemTranslationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateMenuItemTranslationsMutation, Types.UpdateMenuItemTranslationsMutationVariables>(UpdateMenuItemTranslationsDocument, options);
      }
export type UpdateMenuItemTranslationsMutationHookResult = ReturnType<typeof useUpdateMenuItemTranslationsMutation>;
export type UpdateMenuItemTranslationsMutationResult = Apollo.MutationResult<Types.UpdateMenuItemTranslationsMutation>;
export type UpdateMenuItemTranslationsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateMenuItemTranslationsMutation, Types.UpdateMenuItemTranslationsMutationVariables>;
export const CategoryTranslationsDocument = gql`
    query CategoryTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: CATEGORY
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...CategoryTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${CategoryTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useCategoryTranslationsQuery__
 *
 * To run a query within a React component, call `useCategoryTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useCategoryTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CategoryTranslationsQuery, Types.CategoryTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CategoryTranslationsQuery, Types.CategoryTranslationsQueryVariables>(CategoryTranslationsDocument, options);
      }
export function useCategoryTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CategoryTranslationsQuery, Types.CategoryTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CategoryTranslationsQuery, Types.CategoryTranslationsQueryVariables>(CategoryTranslationsDocument, options);
        }
export type CategoryTranslationsQueryHookResult = ReturnType<typeof useCategoryTranslationsQuery>;
export type CategoryTranslationsLazyQueryHookResult = ReturnType<typeof useCategoryTranslationsLazyQuery>;
export type CategoryTranslationsQueryResult = Apollo.QueryResult<Types.CategoryTranslationsQuery, Types.CategoryTranslationsQueryVariables>;
export const CollectionTranslationsDocument = gql`
    query CollectionTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: COLLECTION
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...CollectionTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${CollectionTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useCollectionTranslationsQuery__
 *
 * To run a query within a React component, call `useCollectionTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useCollectionTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CollectionTranslationsQuery, Types.CollectionTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CollectionTranslationsQuery, Types.CollectionTranslationsQueryVariables>(CollectionTranslationsDocument, options);
      }
export function useCollectionTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CollectionTranslationsQuery, Types.CollectionTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CollectionTranslationsQuery, Types.CollectionTranslationsQueryVariables>(CollectionTranslationsDocument, options);
        }
export type CollectionTranslationsQueryHookResult = ReturnType<typeof useCollectionTranslationsQuery>;
export type CollectionTranslationsLazyQueryHookResult = ReturnType<typeof useCollectionTranslationsLazyQuery>;
export type CollectionTranslationsQueryResult = Apollo.QueryResult<Types.CollectionTranslationsQuery, Types.CollectionTranslationsQueryVariables>;
export const ProductTranslationsDocument = gql`
    query ProductTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: PRODUCT
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...ProductTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${ProductTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useProductTranslationsQuery__
 *
 * To run a query within a React component, call `useProductTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useProductTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductTranslationsQuery, Types.ProductTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductTranslationsQuery, Types.ProductTranslationsQueryVariables>(ProductTranslationsDocument, options);
      }
export function useProductTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductTranslationsQuery, Types.ProductTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductTranslationsQuery, Types.ProductTranslationsQueryVariables>(ProductTranslationsDocument, options);
        }
export type ProductTranslationsQueryHookResult = ReturnType<typeof useProductTranslationsQuery>;
export type ProductTranslationsLazyQueryHookResult = ReturnType<typeof useProductTranslationsLazyQuery>;
export type ProductTranslationsQueryResult = Apollo.QueryResult<Types.ProductTranslationsQuery, Types.ProductTranslationsQueryVariables>;
export const PageTranslationsDocument = gql`
    query PageTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: PAGE
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...PageTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __usePageTranslationsQuery__
 *
 * To run a query within a React component, call `usePageTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function usePageTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PageTranslationsQuery, Types.PageTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PageTranslationsQuery, Types.PageTranslationsQueryVariables>(PageTranslationsDocument, options);
      }
export function usePageTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PageTranslationsQuery, Types.PageTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PageTranslationsQuery, Types.PageTranslationsQueryVariables>(PageTranslationsDocument, options);
        }
export type PageTranslationsQueryHookResult = ReturnType<typeof usePageTranslationsQuery>;
export type PageTranslationsLazyQueryHookResult = ReturnType<typeof usePageTranslationsLazyQuery>;
export type PageTranslationsQueryResult = Apollo.QueryResult<Types.PageTranslationsQuery, Types.PageTranslationsQueryVariables>;
export const VoucherTranslationsDocument = gql`
    query VoucherTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: VOUCHER
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...VoucherTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${VoucherTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useVoucherTranslationsQuery__
 *
 * To run a query within a React component, call `useVoucherTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVoucherTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVoucherTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useVoucherTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.VoucherTranslationsQuery, Types.VoucherTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.VoucherTranslationsQuery, Types.VoucherTranslationsQueryVariables>(VoucherTranslationsDocument, options);
      }
export function useVoucherTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.VoucherTranslationsQuery, Types.VoucherTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.VoucherTranslationsQuery, Types.VoucherTranslationsQueryVariables>(VoucherTranslationsDocument, options);
        }
export type VoucherTranslationsQueryHookResult = ReturnType<typeof useVoucherTranslationsQuery>;
export type VoucherTranslationsLazyQueryHookResult = ReturnType<typeof useVoucherTranslationsLazyQuery>;
export type VoucherTranslationsQueryResult = Apollo.QueryResult<Types.VoucherTranslationsQuery, Types.VoucherTranslationsQueryVariables>;
export const SaleTranslationsDocument = gql`
    query SaleTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: SALE
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...SaleTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${SaleTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useSaleTranslationsQuery__
 *
 * To run a query within a React component, call `useSaleTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSaleTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSaleTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useSaleTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SaleTranslationsQuery, Types.SaleTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SaleTranslationsQuery, Types.SaleTranslationsQueryVariables>(SaleTranslationsDocument, options);
      }
export function useSaleTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SaleTranslationsQuery, Types.SaleTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SaleTranslationsQuery, Types.SaleTranslationsQueryVariables>(SaleTranslationsDocument, options);
        }
export type SaleTranslationsQueryHookResult = ReturnType<typeof useSaleTranslationsQuery>;
export type SaleTranslationsLazyQueryHookResult = ReturnType<typeof useSaleTranslationsLazyQuery>;
export type SaleTranslationsQueryResult = Apollo.QueryResult<Types.SaleTranslationsQuery, Types.SaleTranslationsQueryVariables>;
export const AttributeTranslationsDocument = gql`
    query AttributeTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: ATTRIBUTE
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...AttributeTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${AttributeTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useAttributeTranslationsQuery__
 *
 * To run a query within a React component, call `useAttributeTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttributeTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttributeTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useAttributeTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AttributeTranslationsQuery, Types.AttributeTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AttributeTranslationsQuery, Types.AttributeTranslationsQueryVariables>(AttributeTranslationsDocument, options);
      }
export function useAttributeTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AttributeTranslationsQuery, Types.AttributeTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AttributeTranslationsQuery, Types.AttributeTranslationsQueryVariables>(AttributeTranslationsDocument, options);
        }
export type AttributeTranslationsQueryHookResult = ReturnType<typeof useAttributeTranslationsQuery>;
export type AttributeTranslationsLazyQueryHookResult = ReturnType<typeof useAttributeTranslationsLazyQuery>;
export type AttributeTranslationsQueryResult = Apollo.QueryResult<Types.AttributeTranslationsQuery, Types.AttributeTranslationsQueryVariables>;
export const ShippingMethodTranslationsDocument = gql`
    query ShippingMethodTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: SHIPPING_METHOD
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...ShippingMethodTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${ShippingMethodTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useShippingMethodTranslationsQuery__
 *
 * To run a query within a React component, call `useShippingMethodTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useShippingMethodTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShippingMethodTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useShippingMethodTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ShippingMethodTranslationsQuery, Types.ShippingMethodTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ShippingMethodTranslationsQuery, Types.ShippingMethodTranslationsQueryVariables>(ShippingMethodTranslationsDocument, options);
      }
export function useShippingMethodTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ShippingMethodTranslationsQuery, Types.ShippingMethodTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ShippingMethodTranslationsQuery, Types.ShippingMethodTranslationsQueryVariables>(ShippingMethodTranslationsDocument, options);
        }
export type ShippingMethodTranslationsQueryHookResult = ReturnType<typeof useShippingMethodTranslationsQuery>;
export type ShippingMethodTranslationsLazyQueryHookResult = ReturnType<typeof useShippingMethodTranslationsLazyQuery>;
export type ShippingMethodTranslationsQueryResult = Apollo.QueryResult<Types.ShippingMethodTranslationsQuery, Types.ShippingMethodTranslationsQueryVariables>;
export const MenuItemTranslationsDocument = gql`
    query MenuItemTranslations($language: LanguageCodeEnum!, $first: Int, $after: String, $last: Int, $before: String) {
  translations(
    kind: MENU_ITEM
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    edges {
      node {
        ...MenuItemTranslation
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${MenuItemTranslationFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useMenuItemTranslationsQuery__
 *
 * To run a query within a React component, call `useMenuItemTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMenuItemTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMenuItemTranslationsQuery({
 *   variables: {
 *      language: // value for 'language'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useMenuItemTranslationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.MenuItemTranslationsQuery, Types.MenuItemTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.MenuItemTranslationsQuery, Types.MenuItemTranslationsQueryVariables>(MenuItemTranslationsDocument, options);
      }
export function useMenuItemTranslationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.MenuItemTranslationsQuery, Types.MenuItemTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.MenuItemTranslationsQuery, Types.MenuItemTranslationsQueryVariables>(MenuItemTranslationsDocument, options);
        }
export type MenuItemTranslationsQueryHookResult = ReturnType<typeof useMenuItemTranslationsQuery>;
export type MenuItemTranslationsLazyQueryHookResult = ReturnType<typeof useMenuItemTranslationsLazyQuery>;
export type MenuItemTranslationsQueryResult = Apollo.QueryResult<Types.MenuItemTranslationsQuery, Types.MenuItemTranslationsQueryVariables>;
export const ProductTranslationDetailsDocument = gql`
    query ProductTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(kind: PRODUCT, id: $id) {
    ...ProductTranslation
  }
}
    ${ProductTranslationFragmentDoc}`;

/**
 * __useProductTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useProductTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useProductTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductTranslationDetailsQuery, Types.ProductTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductTranslationDetailsQuery, Types.ProductTranslationDetailsQueryVariables>(ProductTranslationDetailsDocument, options);
      }
export function useProductTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductTranslationDetailsQuery, Types.ProductTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductTranslationDetailsQuery, Types.ProductTranslationDetailsQueryVariables>(ProductTranslationDetailsDocument, options);
        }
export type ProductTranslationDetailsQueryHookResult = ReturnType<typeof useProductTranslationDetailsQuery>;
export type ProductTranslationDetailsLazyQueryHookResult = ReturnType<typeof useProductTranslationDetailsLazyQuery>;
export type ProductTranslationDetailsQueryResult = Apollo.QueryResult<Types.ProductTranslationDetailsQuery, Types.ProductTranslationDetailsQueryVariables>;
export const ProductVariantListDocument = gql`
    query ProductVariantList($id: ID!) {
  product(id: $id) {
    id
    variants {
      id
      name
      sku
    }
  }
}
    `;

/**
 * __useProductVariantListQuery__
 *
 * To run a query within a React component, call `useProductVariantListQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductVariantListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductVariantListQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductVariantListQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductVariantListQuery, Types.ProductVariantListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductVariantListQuery, Types.ProductVariantListQueryVariables>(ProductVariantListDocument, options);
      }
export function useProductVariantListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductVariantListQuery, Types.ProductVariantListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductVariantListQuery, Types.ProductVariantListQueryVariables>(ProductVariantListDocument, options);
        }
export type ProductVariantListQueryHookResult = ReturnType<typeof useProductVariantListQuery>;
export type ProductVariantListLazyQueryHookResult = ReturnType<typeof useProductVariantListLazyQuery>;
export type ProductVariantListQueryResult = Apollo.QueryResult<Types.ProductVariantListQuery, Types.ProductVariantListQueryVariables>;
export const ProductVariantTranslationDetailsDocument = gql`
    query ProductVariantTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(kind: VARIANT, id: $id) {
    ...ProductVariantTranslation
  }
}
    ${ProductVariantTranslationFragmentDoc}`;

/**
 * __useProductVariantTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useProductVariantTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductVariantTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductVariantTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useProductVariantTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ProductVariantTranslationDetailsQuery, Types.ProductVariantTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ProductVariantTranslationDetailsQuery, Types.ProductVariantTranslationDetailsQueryVariables>(ProductVariantTranslationDetailsDocument, options);
      }
export function useProductVariantTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ProductVariantTranslationDetailsQuery, Types.ProductVariantTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ProductVariantTranslationDetailsQuery, Types.ProductVariantTranslationDetailsQueryVariables>(ProductVariantTranslationDetailsDocument, options);
        }
export type ProductVariantTranslationDetailsQueryHookResult = ReturnType<typeof useProductVariantTranslationDetailsQuery>;
export type ProductVariantTranslationDetailsLazyQueryHookResult = ReturnType<typeof useProductVariantTranslationDetailsLazyQuery>;
export type ProductVariantTranslationDetailsQueryResult = Apollo.QueryResult<Types.ProductVariantTranslationDetailsQuery, Types.ProductVariantTranslationDetailsQueryVariables>;
export const CategoryTranslationDetailsDocument = gql`
    query CategoryTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(kind: CATEGORY, id: $id) {
    ...CategoryTranslation
  }
}
    ${CategoryTranslationFragmentDoc}`;

/**
 * __useCategoryTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useCategoryTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useCategoryTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CategoryTranslationDetailsQuery, Types.CategoryTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CategoryTranslationDetailsQuery, Types.CategoryTranslationDetailsQueryVariables>(CategoryTranslationDetailsDocument, options);
      }
export function useCategoryTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CategoryTranslationDetailsQuery, Types.CategoryTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CategoryTranslationDetailsQuery, Types.CategoryTranslationDetailsQueryVariables>(CategoryTranslationDetailsDocument, options);
        }
export type CategoryTranslationDetailsQueryHookResult = ReturnType<typeof useCategoryTranslationDetailsQuery>;
export type CategoryTranslationDetailsLazyQueryHookResult = ReturnType<typeof useCategoryTranslationDetailsLazyQuery>;
export type CategoryTranslationDetailsQueryResult = Apollo.QueryResult<Types.CategoryTranslationDetailsQuery, Types.CategoryTranslationDetailsQueryVariables>;
export const CollectionTranslationDetailsDocument = gql`
    query CollectionTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(id: $id, kind: COLLECTION) {
    ...CollectionTranslation
  }
}
    ${CollectionTranslationFragmentDoc}`;

/**
 * __useCollectionTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useCollectionTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useCollectionTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.CollectionTranslationDetailsQuery, Types.CollectionTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.CollectionTranslationDetailsQuery, Types.CollectionTranslationDetailsQueryVariables>(CollectionTranslationDetailsDocument, options);
      }
export function useCollectionTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.CollectionTranslationDetailsQuery, Types.CollectionTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.CollectionTranslationDetailsQuery, Types.CollectionTranslationDetailsQueryVariables>(CollectionTranslationDetailsDocument, options);
        }
export type CollectionTranslationDetailsQueryHookResult = ReturnType<typeof useCollectionTranslationDetailsQuery>;
export type CollectionTranslationDetailsLazyQueryHookResult = ReturnType<typeof useCollectionTranslationDetailsLazyQuery>;
export type CollectionTranslationDetailsQueryResult = Apollo.QueryResult<Types.CollectionTranslationDetailsQuery, Types.CollectionTranslationDetailsQueryVariables>;
export const PageTranslationDetailsDocument = gql`
    query PageTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(id: $id, kind: PAGE) {
    ...PageTranslation
  }
}
    ${PageTranslationFragmentDoc}`;

/**
 * __usePageTranslationDetailsQuery__
 *
 * To run a query within a React component, call `usePageTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function usePageTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.PageTranslationDetailsQuery, Types.PageTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.PageTranslationDetailsQuery, Types.PageTranslationDetailsQueryVariables>(PageTranslationDetailsDocument, options);
      }
export function usePageTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.PageTranslationDetailsQuery, Types.PageTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.PageTranslationDetailsQuery, Types.PageTranslationDetailsQueryVariables>(PageTranslationDetailsDocument, options);
        }
export type PageTranslationDetailsQueryHookResult = ReturnType<typeof usePageTranslationDetailsQuery>;
export type PageTranslationDetailsLazyQueryHookResult = ReturnType<typeof usePageTranslationDetailsLazyQuery>;
export type PageTranslationDetailsQueryResult = Apollo.QueryResult<Types.PageTranslationDetailsQuery, Types.PageTranslationDetailsQueryVariables>;
export const SaleTranslationDetailsDocument = gql`
    query SaleTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(kind: SALE, id: $id) {
    ...SaleTranslation
  }
}
    ${SaleTranslationFragmentDoc}`;

/**
 * __useSaleTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useSaleTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSaleTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSaleTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useSaleTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.SaleTranslationDetailsQuery, Types.SaleTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.SaleTranslationDetailsQuery, Types.SaleTranslationDetailsQueryVariables>(SaleTranslationDetailsDocument, options);
      }
export function useSaleTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.SaleTranslationDetailsQuery, Types.SaleTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.SaleTranslationDetailsQuery, Types.SaleTranslationDetailsQueryVariables>(SaleTranslationDetailsDocument, options);
        }
export type SaleTranslationDetailsQueryHookResult = ReturnType<typeof useSaleTranslationDetailsQuery>;
export type SaleTranslationDetailsLazyQueryHookResult = ReturnType<typeof useSaleTranslationDetailsLazyQuery>;
export type SaleTranslationDetailsQueryResult = Apollo.QueryResult<Types.SaleTranslationDetailsQuery, Types.SaleTranslationDetailsQueryVariables>;
export const VoucherTranslationDetailsDocument = gql`
    query VoucherTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(kind: VOUCHER, id: $id) {
    ...VoucherTranslation
  }
}
    ${VoucherTranslationFragmentDoc}`;

/**
 * __useVoucherTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useVoucherTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVoucherTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVoucherTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useVoucherTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.VoucherTranslationDetailsQuery, Types.VoucherTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.VoucherTranslationDetailsQuery, Types.VoucherTranslationDetailsQueryVariables>(VoucherTranslationDetailsDocument, options);
      }
export function useVoucherTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.VoucherTranslationDetailsQuery, Types.VoucherTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.VoucherTranslationDetailsQuery, Types.VoucherTranslationDetailsQueryVariables>(VoucherTranslationDetailsDocument, options);
        }
export type VoucherTranslationDetailsQueryHookResult = ReturnType<typeof useVoucherTranslationDetailsQuery>;
export type VoucherTranslationDetailsLazyQueryHookResult = ReturnType<typeof useVoucherTranslationDetailsLazyQuery>;
export type VoucherTranslationDetailsQueryResult = Apollo.QueryResult<Types.VoucherTranslationDetailsQuery, Types.VoucherTranslationDetailsQueryVariables>;
export const AttributeTranslationDetailsDocument = gql`
    query AttributeTranslationDetails($id: ID!, $language: LanguageCodeEnum!, $firstValues: Int, $afterValues: String, $lastValues: Int, $beforeValues: String) {
  translation(kind: ATTRIBUTE, id: $id) {
    ...AttributeTranslationDetails
  }
}
    ${AttributeTranslationDetailsFragmentDoc}`;

/**
 * __useAttributeTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useAttributeTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAttributeTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAttributeTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *      firstValues: // value for 'firstValues'
 *      afterValues: // value for 'afterValues'
 *      lastValues: // value for 'lastValues'
 *      beforeValues: // value for 'beforeValues'
 *   },
 * });
 */
export function useAttributeTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.AttributeTranslationDetailsQuery, Types.AttributeTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.AttributeTranslationDetailsQuery, Types.AttributeTranslationDetailsQueryVariables>(AttributeTranslationDetailsDocument, options);
      }
export function useAttributeTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.AttributeTranslationDetailsQuery, Types.AttributeTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.AttributeTranslationDetailsQuery, Types.AttributeTranslationDetailsQueryVariables>(AttributeTranslationDetailsDocument, options);
        }
export type AttributeTranslationDetailsQueryHookResult = ReturnType<typeof useAttributeTranslationDetailsQuery>;
export type AttributeTranslationDetailsLazyQueryHookResult = ReturnType<typeof useAttributeTranslationDetailsLazyQuery>;
export type AttributeTranslationDetailsQueryResult = Apollo.QueryResult<Types.AttributeTranslationDetailsQuery, Types.AttributeTranslationDetailsQueryVariables>;
export const ShippingMethodTranslationDetailsDocument = gql`
    query ShippingMethodTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(kind: SHIPPING_METHOD, id: $id) {
    ...ShippingMethodTranslation
  }
}
    ${ShippingMethodTranslationFragmentDoc}`;

/**
 * __useShippingMethodTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useShippingMethodTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useShippingMethodTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShippingMethodTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useShippingMethodTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.ShippingMethodTranslationDetailsQuery, Types.ShippingMethodTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.ShippingMethodTranslationDetailsQuery, Types.ShippingMethodTranslationDetailsQueryVariables>(ShippingMethodTranslationDetailsDocument, options);
      }
export function useShippingMethodTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.ShippingMethodTranslationDetailsQuery, Types.ShippingMethodTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.ShippingMethodTranslationDetailsQuery, Types.ShippingMethodTranslationDetailsQueryVariables>(ShippingMethodTranslationDetailsDocument, options);
        }
export type ShippingMethodTranslationDetailsQueryHookResult = ReturnType<typeof useShippingMethodTranslationDetailsQuery>;
export type ShippingMethodTranslationDetailsLazyQueryHookResult = ReturnType<typeof useShippingMethodTranslationDetailsLazyQuery>;
export type ShippingMethodTranslationDetailsQueryResult = Apollo.QueryResult<Types.ShippingMethodTranslationDetailsQuery, Types.ShippingMethodTranslationDetailsQueryVariables>;
export const MenuItemTranslationDetailsDocument = gql`
    query MenuItemTranslationDetails($id: ID!, $language: LanguageCodeEnum!) {
  translation(kind: MENU_ITEM, id: $id) {
    ...MenuItemTranslation
  }
}
    ${MenuItemTranslationFragmentDoc}`;

/**
 * __useMenuItemTranslationDetailsQuery__
 *
 * To run a query within a React component, call `useMenuItemTranslationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMenuItemTranslationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMenuItemTranslationDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useMenuItemTranslationDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.MenuItemTranslationDetailsQuery, Types.MenuItemTranslationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.MenuItemTranslationDetailsQuery, Types.MenuItemTranslationDetailsQueryVariables>(MenuItemTranslationDetailsDocument, options);
      }
export function useMenuItemTranslationDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.MenuItemTranslationDetailsQuery, Types.MenuItemTranslationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.MenuItemTranslationDetailsQuery, Types.MenuItemTranslationDetailsQueryVariables>(MenuItemTranslationDetailsDocument, options);
        }
export type MenuItemTranslationDetailsQueryHookResult = ReturnType<typeof useMenuItemTranslationDetailsQuery>;
export type MenuItemTranslationDetailsLazyQueryHookResult = ReturnType<typeof useMenuItemTranslationDetailsLazyQuery>;
export type MenuItemTranslationDetailsQueryResult = Apollo.QueryResult<Types.MenuItemTranslationDetailsQuery, Types.MenuItemTranslationDetailsQueryVariables>;
export const UpdateMetadataDocument = gql`
    mutation UpdateMetadata($id: ID!, $input: [MetadataInput!]!, $keysToDelete: [String!]!) {
  updateMetadata(id: $id, input: $input) {
    errors {
      ...MetadataError
    }
    item {
      ...Metadata
      ... on Node {
        id
      }
    }
  }
  deleteMetadata(id: $id, keys: $keysToDelete) {
    errors {
      ...MetadataError
    }
    item {
      ...Metadata
      ... on Node {
        id
      }
    }
  }
}
    ${MetadataErrorFragmentDoc}
${MetadataFragmentDoc}`;
export type UpdateMetadataMutationFn = Apollo.MutationFunction<Types.UpdateMetadataMutation, Types.UpdateMetadataMutationVariables>;

/**
 * __useUpdateMetadataMutation__
 *
 * To run a mutation, you first call `useUpdateMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMetadataMutation, { data, loading, error }] = useUpdateMetadataMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      keysToDelete: // value for 'keysToDelete'
 *   },
 * });
 */
export function useUpdateMetadataMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdateMetadataMutation, Types.UpdateMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdateMetadataMutation, Types.UpdateMetadataMutationVariables>(UpdateMetadataDocument, options);
      }
export type UpdateMetadataMutationHookResult = ReturnType<typeof useUpdateMetadataMutation>;
export type UpdateMetadataMutationResult = Apollo.MutationResult<Types.UpdateMetadataMutation>;
export type UpdateMetadataMutationOptions = Apollo.BaseMutationOptions<Types.UpdateMetadataMutation, Types.UpdateMetadataMutationVariables>;
export const UpdatePrivateMetadataDocument = gql`
    mutation UpdatePrivateMetadata($id: ID!, $input: [MetadataInput!]!, $keysToDelete: [String!]!) {
  updatePrivateMetadata(id: $id, input: $input) {
    errors {
      ...MetadataError
    }
    item {
      ...Metadata
      ... on Node {
        id
      }
    }
  }
  deletePrivateMetadata(id: $id, keys: $keysToDelete) {
    errors {
      ...MetadataError
    }
    item {
      ...Metadata
      ... on Node {
        id
      }
    }
  }
}
    ${MetadataErrorFragmentDoc}
${MetadataFragmentDoc}`;
export type UpdatePrivateMetadataMutationFn = Apollo.MutationFunction<Types.UpdatePrivateMetadataMutation, Types.UpdatePrivateMetadataMutationVariables>;

/**
 * __useUpdatePrivateMetadataMutation__
 *
 * To run a mutation, you first call `useUpdatePrivateMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePrivateMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePrivateMetadataMutation, { data, loading, error }] = useUpdatePrivateMetadataMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      keysToDelete: // value for 'keysToDelete'
 *   },
 * });
 */
export function useUpdatePrivateMetadataMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.UpdatePrivateMetadataMutation, Types.UpdatePrivateMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.UpdatePrivateMetadataMutation, Types.UpdatePrivateMetadataMutationVariables>(UpdatePrivateMetadataDocument, options);
      }
export type UpdatePrivateMetadataMutationHookResult = ReturnType<typeof useUpdatePrivateMetadataMutation>;
export type UpdatePrivateMetadataMutationResult = Apollo.MutationResult<Types.UpdatePrivateMetadataMutation>;
export type UpdatePrivateMetadataMutationOptions = Apollo.BaseMutationOptions<Types.UpdatePrivateMetadataMutation, Types.UpdatePrivateMetadataMutationVariables>;
export const WarehouseDeleteDocument = gql`
    mutation WarehouseDelete($id: ID!) {
  deleteWarehouse(id: $id) {
    errors {
      ...WarehouseError
    }
  }
}
    ${WarehouseErrorFragmentDoc}`;
export type WarehouseDeleteMutationFn = Apollo.MutationFunction<Types.WarehouseDeleteMutation, Types.WarehouseDeleteMutationVariables>;

/**
 * __useWarehouseDeleteMutation__
 *
 * To run a mutation, you first call `useWarehouseDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWarehouseDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [warehouseDeleteMutation, { data, loading, error }] = useWarehouseDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWarehouseDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.WarehouseDeleteMutation, Types.WarehouseDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.WarehouseDeleteMutation, Types.WarehouseDeleteMutationVariables>(WarehouseDeleteDocument, options);
      }
export type WarehouseDeleteMutationHookResult = ReturnType<typeof useWarehouseDeleteMutation>;
export type WarehouseDeleteMutationResult = Apollo.MutationResult<Types.WarehouseDeleteMutation>;
export type WarehouseDeleteMutationOptions = Apollo.BaseMutationOptions<Types.WarehouseDeleteMutation, Types.WarehouseDeleteMutationVariables>;
export const WarehouseCreateDocument = gql`
    mutation WarehouseCreate($input: WarehouseCreateInput!) {
  createWarehouse(input: $input) {
    errors {
      ...WarehouseError
    }
    warehouse {
      ...WarehouseDetails
    }
  }
}
    ${WarehouseErrorFragmentDoc}
${WarehouseDetailsFragmentDoc}`;
export type WarehouseCreateMutationFn = Apollo.MutationFunction<Types.WarehouseCreateMutation, Types.WarehouseCreateMutationVariables>;

/**
 * __useWarehouseCreateMutation__
 *
 * To run a mutation, you first call `useWarehouseCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWarehouseCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [warehouseCreateMutation, { data, loading, error }] = useWarehouseCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useWarehouseCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.WarehouseCreateMutation, Types.WarehouseCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.WarehouseCreateMutation, Types.WarehouseCreateMutationVariables>(WarehouseCreateDocument, options);
      }
export type WarehouseCreateMutationHookResult = ReturnType<typeof useWarehouseCreateMutation>;
export type WarehouseCreateMutationResult = Apollo.MutationResult<Types.WarehouseCreateMutation>;
export type WarehouseCreateMutationOptions = Apollo.BaseMutationOptions<Types.WarehouseCreateMutation, Types.WarehouseCreateMutationVariables>;
export const WarehouseUpdateDocument = gql`
    mutation WarehouseUpdate($id: ID!, $input: WarehouseUpdateInput!) {
  updateWarehouse(id: $id, input: $input) {
    errors {
      ...WarehouseError
    }
    warehouse {
      ...WarehouseDetails
    }
  }
}
    ${WarehouseErrorFragmentDoc}
${WarehouseDetailsFragmentDoc}`;
export type WarehouseUpdateMutationFn = Apollo.MutationFunction<Types.WarehouseUpdateMutation, Types.WarehouseUpdateMutationVariables>;

/**
 * __useWarehouseUpdateMutation__
 *
 * To run a mutation, you first call `useWarehouseUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWarehouseUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [warehouseUpdateMutation, { data, loading, error }] = useWarehouseUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useWarehouseUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.WarehouseUpdateMutation, Types.WarehouseUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.WarehouseUpdateMutation, Types.WarehouseUpdateMutationVariables>(WarehouseUpdateDocument, options);
      }
export type WarehouseUpdateMutationHookResult = ReturnType<typeof useWarehouseUpdateMutation>;
export type WarehouseUpdateMutationResult = Apollo.MutationResult<Types.WarehouseUpdateMutation>;
export type WarehouseUpdateMutationOptions = Apollo.BaseMutationOptions<Types.WarehouseUpdateMutation, Types.WarehouseUpdateMutationVariables>;
export const WarehouseListDocument = gql`
    query WarehouseList($first: Int, $after: String, $last: Int, $before: String, $filter: WarehouseFilterInput, $sort: WarehouseSortingInput) {
  warehouses(
    before: $before
    after: $after
    first: $first
    last: $last
    filter: $filter
    sortBy: $sort
  ) {
    edges {
      node {
        ...WarehouseWithShipping
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${WarehouseWithShippingFragmentDoc}
${PageInfoFragmentDoc}`;

/**
 * __useWarehouseListQuery__
 *
 * To run a query within a React component, call `useWarehouseListQuery` and pass it any options that fit your needs.
 * When your component renders, `useWarehouseListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWarehouseListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useWarehouseListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.WarehouseListQuery, Types.WarehouseListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.WarehouseListQuery, Types.WarehouseListQueryVariables>(WarehouseListDocument, options);
      }
export function useWarehouseListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.WarehouseListQuery, Types.WarehouseListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.WarehouseListQuery, Types.WarehouseListQueryVariables>(WarehouseListDocument, options);
        }
export type WarehouseListQueryHookResult = ReturnType<typeof useWarehouseListQuery>;
export type WarehouseListLazyQueryHookResult = ReturnType<typeof useWarehouseListLazyQuery>;
export type WarehouseListQueryResult = Apollo.QueryResult<Types.WarehouseListQuery, Types.WarehouseListQueryVariables>;
export const WarehouseDetailsDocument = gql`
    query WarehouseDetails($id: ID!) {
  warehouse(id: $id) {
    ...WarehouseDetails
  }
}
    ${WarehouseDetailsFragmentDoc}`;

/**
 * __useWarehouseDetailsQuery__
 *
 * To run a query within a React component, call `useWarehouseDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWarehouseDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWarehouseDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWarehouseDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.WarehouseDetailsQuery, Types.WarehouseDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.WarehouseDetailsQuery, Types.WarehouseDetailsQueryVariables>(WarehouseDetailsDocument, options);
      }
export function useWarehouseDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.WarehouseDetailsQuery, Types.WarehouseDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.WarehouseDetailsQuery, Types.WarehouseDetailsQueryVariables>(WarehouseDetailsDocument, options);
        }
export type WarehouseDetailsQueryHookResult = ReturnType<typeof useWarehouseDetailsQuery>;
export type WarehouseDetailsLazyQueryHookResult = ReturnType<typeof useWarehouseDetailsLazyQuery>;
export type WarehouseDetailsQueryResult = Apollo.QueryResult<Types.WarehouseDetailsQuery, Types.WarehouseDetailsQueryVariables>;
export const WarehousesCountDocument = gql`
    query WarehousesCount {
  warehouses {
    totalCount
  }
}
    `;

/**
 * __useWarehousesCountQuery__
 *
 * To run a query within a React component, call `useWarehousesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useWarehousesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWarehousesCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useWarehousesCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Types.WarehousesCountQuery, Types.WarehousesCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.WarehousesCountQuery, Types.WarehousesCountQueryVariables>(WarehousesCountDocument, options);
      }
export function useWarehousesCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.WarehousesCountQuery, Types.WarehousesCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.WarehousesCountQuery, Types.WarehousesCountQueryVariables>(WarehousesCountDocument, options);
        }
export type WarehousesCountQueryHookResult = ReturnType<typeof useWarehousesCountQuery>;
export type WarehousesCountLazyQueryHookResult = ReturnType<typeof useWarehousesCountLazyQuery>;
export type WarehousesCountQueryResult = Apollo.QueryResult<Types.WarehousesCountQuery, Types.WarehousesCountQueryVariables>;
export const SaveOnBoardingStateDocument = gql`
    mutation SaveOnBoardingState($id: ID!, $input: [MetadataInput!]!) {
  updateMetadata(id: $id, input: $input) {
    errors {
      ...MetadataError
    }
  }
}
    ${MetadataErrorFragmentDoc}`;
export type SaveOnBoardingStateMutationFn = Apollo.MutationFunction<Types.SaveOnBoardingStateMutation, Types.SaveOnBoardingStateMutationVariables>;

/**
 * __useSaveOnBoardingStateMutation__
 *
 * To run a mutation, you first call `useSaveOnBoardingStateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveOnBoardingStateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveOnBoardingStateMutation, { data, loading, error }] = useSaveOnBoardingStateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveOnBoardingStateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.SaveOnBoardingStateMutation, Types.SaveOnBoardingStateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.SaveOnBoardingStateMutation, Types.SaveOnBoardingStateMutationVariables>(SaveOnBoardingStateDocument, options);
      }
export type SaveOnBoardingStateMutationHookResult = ReturnType<typeof useSaveOnBoardingStateMutation>;
export type SaveOnBoardingStateMutationResult = Apollo.MutationResult<Types.SaveOnBoardingStateMutation>;
export type SaveOnBoardingStateMutationOptions = Apollo.BaseMutationOptions<Types.SaveOnBoardingStateMutation, Types.SaveOnBoardingStateMutationVariables>;
export const WelcomePageActivitiesDocument = gql`
    query WelcomePageActivities($hasPermissionToManageOrders: Boolean!) {
  activities: homepageEvents(last: 10) @include(if: $hasPermissionToManageOrders) {
    edges {
      node {
        ...Activities
      }
    }
  }
}
    ${ActivitiesFragmentDoc}`;

/**
 * __useWelcomePageActivitiesQuery__
 *
 * To run a query within a React component, call `useWelcomePageActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useWelcomePageActivitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWelcomePageActivitiesQuery({
 *   variables: {
 *      hasPermissionToManageOrders: // value for 'hasPermissionToManageOrders'
 *   },
 * });
 */
export function useWelcomePageActivitiesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.WelcomePageActivitiesQuery, Types.WelcomePageActivitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.WelcomePageActivitiesQuery, Types.WelcomePageActivitiesQueryVariables>(WelcomePageActivitiesDocument, options);
      }
export function useWelcomePageActivitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.WelcomePageActivitiesQuery, Types.WelcomePageActivitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.WelcomePageActivitiesQuery, Types.WelcomePageActivitiesQueryVariables>(WelcomePageActivitiesDocument, options);
        }
export type WelcomePageActivitiesQueryHookResult = ReturnType<typeof useWelcomePageActivitiesQuery>;
export type WelcomePageActivitiesLazyQueryHookResult = ReturnType<typeof useWelcomePageActivitiesLazyQuery>;
export type WelcomePageActivitiesQueryResult = Apollo.QueryResult<Types.WelcomePageActivitiesQuery, Types.WelcomePageActivitiesQueryVariables>;
export const WelcomePageAnalyticsDocument = gql`
    query WelcomePageAnalytics($channel: String!, $hasPermissionToManageOrders: Boolean!) {
  salesToday: ordersTotal(period: TODAY, channel: $channel) @include(if: $hasPermissionToManageOrders) {
    gross {
      amount
      currency
    }
  }
}
    `;

/**
 * __useWelcomePageAnalyticsQuery__
 *
 * To run a query within a React component, call `useWelcomePageAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWelcomePageAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWelcomePageAnalyticsQuery({
 *   variables: {
 *      channel: // value for 'channel'
 *      hasPermissionToManageOrders: // value for 'hasPermissionToManageOrders'
 *   },
 * });
 */
export function useWelcomePageAnalyticsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.WelcomePageAnalyticsQuery, Types.WelcomePageAnalyticsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.WelcomePageAnalyticsQuery, Types.WelcomePageAnalyticsQueryVariables>(WelcomePageAnalyticsDocument, options);
      }
export function useWelcomePageAnalyticsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.WelcomePageAnalyticsQuery, Types.WelcomePageAnalyticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.WelcomePageAnalyticsQuery, Types.WelcomePageAnalyticsQueryVariables>(WelcomePageAnalyticsDocument, options);
        }
export type WelcomePageAnalyticsQueryHookResult = ReturnType<typeof useWelcomePageAnalyticsQuery>;
export type WelcomePageAnalyticsLazyQueryHookResult = ReturnType<typeof useWelcomePageAnalyticsLazyQuery>;
export type WelcomePageAnalyticsQueryResult = Apollo.QueryResult<Types.WelcomePageAnalyticsQuery, Types.WelcomePageAnalyticsQueryVariables>;
export const WelcomePageNotificationsDocument = gql`
    query welcomePageNotifications($channel: String!) {
  productsOutOfStock: products(
    filter: {stockAvailability: OUT_OF_STOCK}
    channel: $channel
  ) {
    totalCount
  }
}
    `;

/**
 * __useWelcomePageNotificationsQuery__
 *
 * To run a query within a React component, call `useWelcomePageNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWelcomePageNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWelcomePageNotificationsQuery({
 *   variables: {
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useWelcomePageNotificationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.WelcomePageNotificationsQuery, Types.WelcomePageNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.WelcomePageNotificationsQuery, Types.WelcomePageNotificationsQueryVariables>(WelcomePageNotificationsDocument, options);
      }
export function useWelcomePageNotificationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.WelcomePageNotificationsQuery, Types.WelcomePageNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.WelcomePageNotificationsQuery, Types.WelcomePageNotificationsQueryVariables>(WelcomePageNotificationsDocument, options);
        }
export type WelcomePageNotificationsQueryHookResult = ReturnType<typeof useWelcomePageNotificationsQuery>;
export type WelcomePageNotificationsLazyQueryHookResult = ReturnType<typeof useWelcomePageNotificationsLazyQuery>;
export type WelcomePageNotificationsQueryResult = Apollo.QueryResult<Types.WelcomePageNotificationsQuery, Types.WelcomePageNotificationsQueryVariables>;