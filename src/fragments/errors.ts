import { gql } from "@apollo/client";

export const attributeErrorFragment = gql`
  fragment AttributeErrorFragment on AttributeError {
    code
    field
    message
  }
`;

export const productErrorFragment = gql`
  fragment ProductErrorFragment on ProductError {
    code
    field
    message
  }
`;

export const productErrorWithAttributesFragment = gql`
  ${productErrorFragment}
  fragment ProductErrorWithAttributesFragment on ProductError {
    ...ProductErrorFragment
    attributes
  }
`;

export const productChannelListingErrorFragment = gql`
  fragment ProductChannelListingErrorFragment on ProductChannelListingError {
    code
    field
    message
    channels
  }
`;

export const collectionChannelListingErrorFragment = gql`
  fragment CollectionChannelListingErrorFragment on CollectionChannelListingError {
    code
    field
    message
    channels
  }
`;

export const accountErrorFragment = gql`
  fragment AccountErrorFragment on AccountError {
    code
    field
    addressType
    message
  }
`;

export const discountErrorFragment = gql`
  fragment DiscountErrorFragment on DiscountError {
    code
    field
    channels
    message
  }
`;

export const menuErrorFragment = gql`
  fragment MenuErrorFragment on MenuError {
    code
    field
    message
  }
`;

export const orderErrorFragment = gql`
  fragment OrderErrorFragment on OrderError {
    code
    field
    addressType
    message
  }
`;

export const orderSettingsErrorFragment = gql`
  fragment OrderSettingsErrorFragment on OrderSettingsError {
    code
    field
    message
  }
`;

export const pageErrorFragment = gql`
  fragment PageErrorFragment on PageError {
    code
    field
    message
  }
`;

export const pageErrorWithAttributesFragment = gql`
  ${pageErrorFragment}
  fragment PageErrorWithAttributesFragment on PageError {
    ...PageErrorFragment
    attributes
  }
`;

export const permissionGroupErrorFragment = gql`
  fragment PermissionGroupErrorFragment on PermissionGroupError {
    code
    field
    message
  }
`;

export const bulkProductErrorFragment = gql`
  fragment BulkProductErrorFragment on BulkProductError {
    field
    code
    index
    channels
    message
  }
`;
export const bulkStockErrorFragment = gql`
  fragment BulkStockErrorFragment on BulkStockError {
    code
    field
    index
    message
  }
`;
export const stockErrorFragment = gql`
  fragment StockErrorFragment on StockError {
    code
    field
    message
  }
`;

export const shippingChannelsErrorFragment = gql`
  fragment ShippingChannelsErrorFragment on ShippingError {
    code
    field
    channels
    message
  }
`;

export const shippingErrorFragment = gql`
  fragment ShippingErrorFragment on ShippingError {
    code
    field
    message
  }
`;

export const shopErrorFragment = gql`
  fragment ShopErrorFragment on ShopError {
    code
    field
    message
  }
`;

export const staffErrorFragment = gql`
  fragment StaffErrorFragment on StaffError {
    code
    field
    message
  }
`;

export const warehouseErrorFragment = gql`
  fragment WarehouseErrorFragment on WarehouseError {
    code
    field
    message
  }
`;

export const webhookErrorFragment = gql`
  fragment WebhookErrorFragment on WebhookError {
    code
    field
    message
  }
`;

export const invoiceErrorFragment = gql`
  fragment InvoiceErrorFragment on InvoiceError {
    code
    field
    message
  }
`;

export const appErrorFragment = gql`
  fragment AppErrorFragment on AppError {
    field
    message
    code
    permissions
  }
`;

export const exportErrorFragment = gql`
  fragment ExportErrorFragment on ExportError {
    code
    field
    message
  }
`;

export const pluginErrorFragment = gql`
  fragment PluginErrorFragment on PluginError {
    code
    field
    message
  }
`;

export const metadataErrorFragment = gql`
  fragment MetadataErrorFragment on MetadataError {
    code
    field
    message
  }
`;

export const collectionsErrorFragment = gql`
  fragment CollectionErrorFragment on CollectionError {
    code
    field
    message
  }
`;

export const uploadErrorFragment = gql`
  fragment UploadErrorFragment on UploadError {
    code
    field
    message
  }
`;

export const giftCardErrorFragment = gql`
  fragment GiftCardError on GiftCardError {
    code
    field
    message
  }
`;

export const giftCardSettingsErrorFragment = gql`
  fragment GiftCardSettingsErrorFragment on GiftCardSettingsError {
    code
    field
    message
  }
`;

export const saleBulkDeleteError = gql`
  fragment SaleBulkDeleteError on DiscountError {
    code
    field
    message
  }
`;

export const voucherBulkDeleteError = gql`
  fragment VoucherBulkDeleteError on DiscountError {
    code
    field
    message
  }
`;

export const giftCardBulkCreateErrorFragment = gql`
  fragment GiftCardBulkCreateErrorFragment on GiftCardError {
    code
    field
    message
  }
`;

export const giftCardCreateErrorFragment = gql`
  fragment GiftCardCreateErrorFragment on GiftCardError {
    code
    field
    message
  }
`;

export const pageBulkPublishErrorFragment = gql`
  fragment PageBulkPublishErrorFragment on PageError {
    code
    field
    message
  }
`;

export const pageBulkRemoveErrorFragment = gql`
  fragment PageBulkRemoveErrorFragment on PageError {
    code
    field
    message
  }
`;

export const pageTypeDeleteErrorFragment = gql`
  fragment PageTypeDeleteErrorFragment on PageError {
    code
    field
    message
  }
`;

export const pageTypeBulkDeleteErrorFragment = gql`
  fragment PageTypeDeleteErrorFragment on PageError {
    code
    field
    message
  }
`;

export const productVariantStocksDeleteErrorFragment = gql`
  fragment ProductVariantStocksDeleteErrorFragment on StockError {
    code
    field
    message
  }
`;

export const productTypeDeleteErrorFragment = gql`
  fragment ProductTypeDeleteErrorFragment on ProductError {
    code
    field
    message
  }
`;

export const productTypeBulkDeleteErrorFragment = gql`
  fragment ProductTypeBulkDeleteErrorFragment on ProductError {
    code
    field
    message
  }
`;

export const productTypeBulkUpdateErrorFragment = gql`
  fragment ProductTypeBulkUpdateErrorFragment on ProductError {
    code
    field
    message
  }
`;

export const productAttributeAssignErrorFragment = gql`
  fragment ProductAttributeAssignErrorFragment on ProductError {
    code
    field
    message
  }
`;

export const productAttributeUnassignErrorFragment = gql`
  fragment ProductAttributeUnassignErrorFragment on ProductError {
    code
    field
    message
  }
`;

export const productTypeCreateErrorFragment = gql`
  fragment ProductTypeCreateErrorFragment on ProductError {
    code
    field
    message
  }
`;

export const productTypeReorderAttributesErrorFragment = gql`
  fragment ProductTypeReorderAttributesErrorFragment on ProductError {
    code
    field
    message
  }
`;

export const productAttributeAssignmentUpdateErrorFragment = gql`
  fragment ProductAttributeAssignmentUpdateErrorFragment on ProductError {
    code
    field
    message
    attributes
  }
`;

export const shopSettingsUpdateErrorFragment = gql`
  fragment ShopSettingsUpdateErrorFragment on ShopError {
    code
    field
    message
  }
`;

export const shopFetchTaxRatesErrorFragment = gql`
  fragment ShopFetchTaxRatesErrorFragment on ShopError {
    code
    field
    message
  }
`;

export const productTranslateErrorFragment = gql`
  fragment ProductTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const productVariantTranslateErrorFragment = gql`
  fragment ProductVariantTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const categoryTranslateErrorFragment = gql`
  fragment CategoryTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const collectionTranslateErrorFragment = gql`
  fragment CollectionTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const pageTranslateErrorFragment = gql`
  fragment PageTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const voucherTranslateErrorFragment = gql`
  fragment VoucherTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const saleTranslateErrorFragment = gql`
  fragment SaleTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const attributeTranslateErrorFragment = gql`
  fragment AttributeTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const attributeValueTranslateErrorFragment = gql`
  fragment AttributeValueTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;

export const shippingPriceTranslateErrorFragment = gql`
  fragment ShippingPriceTranslateErrorFragment on TranslationError {
    code
    field
    message
  }
`;
