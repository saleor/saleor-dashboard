import gql from "graphql-tag";

export const attributeErrorFragment = gql`
  fragment AttributeErrorFragment on AttributeError {
    code
    field
  }
`;

export const productErrorFragment = gql`
  fragment ProductErrorFragment on ProductError {
    code
    field
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
  }
`;

export const discountErrorFragment = gql`
  fragment DiscountErrorFragment on DiscountError {
    code
    field
    channels
  }
`;

export const menuErrorFragment = gql`
  fragment MenuErrorFragment on MenuError {
    code
    field
  }
`;

export const orderErrorFragment = gql`
  fragment OrderErrorFragment on OrderError {
    code
    field
  }
`;

export const orderSettingsErrorFragment = gql`
  fragment OrderSettingsErrorFragment on OrderSettingsError {
    code
    field
  }
`;

export const pageErrorFragment = gql`
  fragment PageErrorFragment on PageError {
    code
    field
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
  }
`;

export const bulkProductErrorFragment = gql`
  fragment BulkProductErrorFragment on BulkProductError {
    field
    code
    index
    channels
  }
`;
export const bulkStockErrorFragment = gql`
  fragment BulkStockErrorFragment on BulkStockError {
    code
    field
    index
  }
`;
export const stockErrorFragment = gql`
  fragment StockErrorFragment on StockError {
    code
    field
  }
`;

export const shippingChannelsErrorFragment = gql`
  fragment ShippingChannelsErrorFragment on ShippingError {
    code
    field
    channels
  }
`;

export const shippingErrorFragment = gql`
  fragment ShippingErrorFragment on ShippingError {
    code
    field
  }
`;

export const shopErrorFragment = gql`
  fragment ShopErrorFragment on ShopError {
    code
    field
  }
`;

export const staffErrorFragment = gql`
  fragment StaffErrorFragment on StaffError {
    code
    field
  }
`;

export const warehouseErrorFragment = gql`
  fragment WarehouseErrorFragment on WarehouseError {
    code
    field
  }
`;

export const webhookErrorFragment = gql`
  fragment WebhookErrorFragment on WebhookError {
    code
    field
  }
`;

export const invoiceErrorFragment = gql`
  fragment InvoiceErrorFragment on InvoiceError {
    code
    field
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
  }
`;

export const pluginErrorFragment = gql`
  fragment PluginErrorFragment on PluginError {
    code
    field
  }
`;

export const metadataErrorFragment = gql`
  fragment MetadataErrorFragment on MetadataError {
    code
    field
  }
`;

export const collectionsErrorFragment = gql`
  fragment CollectionErrorFragment on CollectionError {
    code
    field
  }
`;

export const uploadErrorFragment = gql`
  fragment UploadErrorFragment on UploadError {
    code
    field
  }
`;
