/* eslint-disable */
import * as Types from './types.channelPermissions.generated';

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
  permissions {
    code
    name
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
  privateMetadata {
    key
    value
  }
  metadata {
    key
    value
  }
  tokens {
    authToken
    id
    name
  }
  webhooks {
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
}
    `;
export const AppPermissionFragmentDoc = gql`
    fragment AppPermission on Permission {
  name
  code
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
  permissions {
    ...AppPermission
  }
}
    ${AppPermissionFragmentDoc}`;
export const AppAvatarFragmentDoc = gql`
    fragment AppAvatar on App {
  id
  name
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
export const AttributeDetailsFragmentDoc = gql`
    fragment AttributeDetails on Attribute {
  ...Attribute
  ...Metadata
  availableInGrid
  inputType
  entityType
  unit
  storefrontSearchPosition
  valueRequired
}
    ${AttributeFragmentDoc}
${MetadataFragmentDoc}`;
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
export const UserFragmentDoc = gql`
    fragment User on User {
  id
  email
  firstName
  lastName
  isStaff
  userPermissions {
    ...UserPermission
  }
  avatar {
    url
  }
}
    ${UserPermissionFragmentDoc}`;
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
export const ChannelErrorFragmentDoc = gql`
    fragment ChannelError on ChannelError {
  code
  field
  message
}
    `;
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
}
    ${ChannelFragmentDoc}
${WarehouseFragmentDoc}`;
export const CollectionFragmentDoc = gql`
    fragment Collection on Collection {
  id
  name
  channelListings {
    isPublished
    publicationDate
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
  ...Metadata
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
${MetadataFragmentDoc}
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
export const VoucherFragmentDoc = gql`
    fragment Voucher on Voucher {
  ...Metadata
  id
  code
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
  code
  usageLimit
  used
  applyOncePerOrder
  applyOncePerCustomer
  onlyForStaff
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
}
    ${VoucherFragmentDoc}
${ChannelListingProductWithoutPricingFragmentDoc}
${PageInfoFragmentDoc}`;
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
export const GiftCardsSettingsFragmentDoc = gql`
    fragment GiftCardsSettings on GiftCardSettings {
  expiryType
  expiryPeriod {
    type
    amount
  }
}
    `;
export const UserBaseFragmentDoc = gql`
    fragment UserBase on User {
  id
  firstName
  lastName
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
  user {
    ...UserBase
    email
  }
  app {
    id
    name
  }
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
    ${UserBaseFragmentDoc}
${MoneyFragmentDoc}`;
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
  createdBy {
    ...UserBase
  }
  usedBy {
    ...UserBase
  }
  usedByEmail
  createdByEmail
  app {
    id
    name
  }
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
  message
  quantity
  transactionReference
  type
  user {
    id
    email
    firstName
    lastName
  }
  app {
    id
    name
    appUrl
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
  id
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
  token
  ...Metadata
  billingAddress {
    ...Address
  }
  transactions {
    id
  }
  giftCards {
    events {
      id
      type
      orderId
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
  }
  isShippingRequired
  canFinalize
  created
  customerNote
  discounts {
    id
    type
    calculationMode: valueType
    value
    reason
    amount {
      ...Money
    }
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
  actions
  totalAuthorized {
    ...Money
  }
  totalCaptured {
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
  }
  isPaid
}
    ${MetadataFragmentDoc}
${AddressFragmentDoc}
${MoneyFragmentDoc}
${OrderEventFragmentDoc}
${FulfillmentFragmentDoc}
${OrderLineFragmentDoc}
${InvoiceFragmentDoc}`;
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
export const PageTypeFragmentDoc = gql`
    fragment PageType on PageType {
  id
  name
  hasPages
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
export const PageSelectedAttributeFragmentDoc = gql`
    fragment PageSelectedAttribute on SelectedAttribute {
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
    ${AttributeValueListFragmentDoc}
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
  publicationDate
}
    ${PageFragmentDoc}
${PageAttributesFragmentDoc}
${MetadataFragmentDoc}`;
export const PermissionGroupFragmentDoc = gql`
    fragment PermissionGroup on Group {
  id
  name
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
export const StaffMemberFragmentDoc = gql`
    fragment StaffMember on User {
  id
  email
  firstName
  isActive
  lastName
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
export const NewPermissionGroupDetailsFragmentDoc = gql`
    fragment NewPermissionGroupDetails on Group {
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
export const PermissionGroupDetailsFragmentDoc = gql`
    fragment PermissionGroupDetails on Group {
  ...PermissionGroup
  permissions {
    ...Permission
  }
  users {
    ...PermissionGroupMember
  }
}
    ${PermissionGroupFragmentDoc}
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
    ${ChannelListingProductWithoutPricingFragmentDoc}
${PriceRangeFragmentDoc}`;
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
export const VariantAttributeFragmentDoc = gql`
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
    ${AttributeValueListFragmentDoc}`;
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
    ${MetadataFragmentDoc}
${SelectedVariantAttributeFragmentDoc}
${ProductMediaFragmentDoc}
${ChannelListingProductVariantFragmentDoc}
${StockFragmentDoc}
${PreorderFragmentDoc}
${WeightFragmentDoc}`;
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
export const ShippingZoneFragmentDoc = gql`
    fragment ShippingZone on ShippingZone {
  ...Metadata
  id
  countries {
    code
    country
  }
  name
  description
}
    ${MetadataFragmentDoc}`;
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
}
    ${StaffMemberFragmentDoc}`;
export const StaffMemberAvatarFragmentDoc = gql`
    fragment StaffMemberAvatar on User {
  ...StaffMember
  avatar(size: 512) {
    url
  }
}
    ${StaffMemberFragmentDoc}`;
export const CountryFragmentDoc = gql`
    fragment Country on CountryDisplay {
  country
  code
}
    `;
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
export const NewPermissionGroupCreateDocument = gql`
    mutation NewPermissionGroupCreate($input: PermissionGroupCreateInput!) {
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
export type NewPermissionGroupCreateMutationFn = Apollo.MutationFunction<Types.NewPermissionGroupCreateMutation, Types.NewPermissionGroupCreateMutationVariables>;

/**
 * __useNewPermissionGroupCreateMutation__
 *
 * To run a mutation, you first call `useNewPermissionGroupCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewPermissionGroupCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newPermissionGroupCreateMutation, { data, loading, error }] = useNewPermissionGroupCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNewPermissionGroupCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.NewPermissionGroupCreateMutation, Types.NewPermissionGroupCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.NewPermissionGroupCreateMutation, Types.NewPermissionGroupCreateMutationVariables>(NewPermissionGroupCreateDocument, options);
      }
export type NewPermissionGroupCreateMutationHookResult = ReturnType<typeof useNewPermissionGroupCreateMutation>;
export type NewPermissionGroupCreateMutationResult = Apollo.MutationResult<Types.NewPermissionGroupCreateMutation>;
export type NewPermissionGroupCreateMutationOptions = Apollo.BaseMutationOptions<Types.NewPermissionGroupCreateMutation, Types.NewPermissionGroupCreateMutationVariables>;
export const NewPermissionGroupUpdateDocument = gql`
    mutation NewPermissionGroupUpdate($id: ID!, $input: PermissionGroupUpdateInput!) {
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
export type NewPermissionGroupUpdateMutationFn = Apollo.MutationFunction<Types.NewPermissionGroupUpdateMutation, Types.NewPermissionGroupUpdateMutationVariables>;

/**
 * __useNewPermissionGroupUpdateMutation__
 *
 * To run a mutation, you first call `useNewPermissionGroupUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewPermissionGroupUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newPermissionGroupUpdateMutation, { data, loading, error }] = useNewPermissionGroupUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNewPermissionGroupUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Types.NewPermissionGroupUpdateMutation, Types.NewPermissionGroupUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Types.NewPermissionGroupUpdateMutation, Types.NewPermissionGroupUpdateMutationVariables>(NewPermissionGroupUpdateDocument, options);
      }
export type NewPermissionGroupUpdateMutationHookResult = ReturnType<typeof useNewPermissionGroupUpdateMutation>;
export type NewPermissionGroupUpdateMutationResult = Apollo.MutationResult<Types.NewPermissionGroupUpdateMutation>;
export type NewPermissionGroupUpdateMutationOptions = Apollo.BaseMutationOptions<Types.NewPermissionGroupUpdateMutation, Types.NewPermissionGroupUpdateMutationVariables>;
export const NewPermissionGroupDetailsDocument = gql`
    query NewPermissionGroupDetails($id: ID!, $userId: ID!) {
  permissionGroup(id: $id) {
    ...NewPermissionGroupDetails
  }
  user(id: $userId) {
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
    ${NewPermissionGroupDetailsFragmentDoc}`;

/**
 * __useNewPermissionGroupDetailsQuery__
 *
 * To run a query within a React component, call `useNewPermissionGroupDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewPermissionGroupDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewPermissionGroupDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewPermissionGroupDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Types.NewPermissionGroupDetailsQuery, Types.NewPermissionGroupDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Types.NewPermissionGroupDetailsQuery, Types.NewPermissionGroupDetailsQueryVariables>(NewPermissionGroupDetailsDocument, options);
      }
export function useNewPermissionGroupDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Types.NewPermissionGroupDetailsQuery, Types.NewPermissionGroupDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Types.NewPermissionGroupDetailsQuery, Types.NewPermissionGroupDetailsQueryVariables>(NewPermissionGroupDetailsDocument, options);
        }
export type NewPermissionGroupDetailsQueryHookResult = ReturnType<typeof useNewPermissionGroupDetailsQuery>;
export type NewPermissionGroupDetailsLazyQueryHookResult = ReturnType<typeof useNewPermissionGroupDetailsLazyQuery>;
export type NewPermissionGroupDetailsQueryResult = Apollo.QueryResult<Types.NewPermissionGroupDetailsQuery, Types.NewPermissionGroupDetailsQueryVariables>;