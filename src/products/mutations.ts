import { gql } from "@apollo/client";

export const productMediaCreateMutation = gql`
  mutation ProductMediaCreate(
    $product: ID!
    $image: Upload
    $alt: String
    $mediaUrl: String
  ) {
    productMediaCreate(
      input: {
        alt: $alt
        image: $image
        product: $product
        mediaUrl: $mediaUrl
      }
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
`;

export const productDeleteMutation = gql`
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
`;

export const productMediaReorder = gql`
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
`;

export const productVariantSetDefault = gql`
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
`;

export const productUpdateMutation = gql`
  mutation ProductUpdate(
    $id: ID!
    $input: ProductInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    productUpdate(id: $id, input: $input) {
      errors {
        ...ProductErrorWithAttributes
      }
      product {
        ...Product
      }
    }
  }
`;

export const simpleProductUpdateMutation = gql`
  mutation SimpleProductUpdate(
    $id: ID!
    $input: ProductInput!
    $productVariantId: ID!
    $productVariantInput: ProductVariantInput!
    $addStocks: [StockInput!]!
    $deleteStocks: [ID!]!
    $updateStocks: [StockInput!]!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    productUpdate(id: $id, input: $input) {
      errors {
        ...ProductErrorWithAttributes
      }
      product {
        ...Product
      }
    }
    productVariantUpdate(id: $productVariantId, input: $productVariantInput) {
      errors {
        ...ProductErrorWithAttributes
      }
      productVariant {
        ...ProductVariant
      }
    }
    productVariantStocksCreate(
      stocks: $addStocks
      variantId: $productVariantId
    ) {
      errors {
        ...BulkStockError
      }
      productVariant {
        ...ProductVariant
      }
    }
    productVariantStocksDelete(
      warehouseIds: $deleteStocks
      variantId: $productVariantId
    ) {
      errors {
        ...StockError
      }
      productVariant {
        ...ProductVariant
      }
    }
    productVariantStocksUpdate(
      stocks: $updateStocks
      variantId: $productVariantId
    ) {
      errors {
        ...BulkStockError
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;

export const productCreateMutation = gql`
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
`;

export const variantDeleteMutation = gql`
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
`;

export const variantUpdateMutation = gql`
  mutation VariantUpdate(
    $addStocks: [StockInput!]!
    $removeStocks: [ID!]!
    $id: ID!
    $attributes: [AttributeValueInput!]
    $sku: String
    $quantityLimitPerCustomer: Int
    $trackInventory: Boolean!
    $stocks: [StockInput!]!
    $preorder: PreorderSettingsInput
    $weight: WeightScalar
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
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
      input: {
        attributes: $attributes
        sku: $sku
        trackInventory: $trackInventory
        preorder: $preorder
        weight: $weight
        quantityLimitPerCustomer: $quantityLimitPerCustomer
      }
    ) {
      errors {
        ...ProductErrorWithAttributes
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;

export const variantCreateMutation = gql`
  mutation VariantCreate(
    $input: ProductVariantCreateInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    productVariantCreate(input: $input) {
      errors {
        ...ProductErrorWithAttributes
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;

export const productMediaDeleteMutation = gql`
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
`;

export const productMediaUpdateMutation = gql`
  mutation ProductMediaUpdate($id: ID!, $alt: String!) {
    productMediaUpdate(id: $id, input: { alt: $alt }) {
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
`;

export const variantMediaAssignMutation = gql`
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
`;

export const variantMediaUnassignMutation = gql`
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
`;

export const productBulkDeleteMutation = gql`
  mutation productBulkDelete($ids: [ID!]!) {
    productBulkDelete(ids: $ids) {
      errors {
        ...ProductError
      }
    }
  }
`;

export const ProductVariantBulkDeleteMutation = gql`
  mutation ProductVariantBulkDelete($ids: [ID!]!) {
    productVariantBulkDelete(ids: $ids) {
      errors {
        ...ProductError
      }
    }
  }
`;

export const productExportMutation = gql`
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
`;

export const ProductChannelListingUpdateMutation = gql`
  mutation ProductChannelListingUpdate(
    $id: ID!
    $input: ProductChannelListingUpdateInput!
  ) {
    productChannelListingUpdate(id: $id, input: $input) {
      product {
        id
        channelListings {
          ...ChannelListingProductWithoutPricing
        }
        variants {
          id
          channelListings {
            ...ChannelListingProductVariant
          }
        }
      }
      errors {
        ...ProductChannelListingError
      }
    }
  }
`;

export const productVariantReorder = gql`
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
`;

export const ProductVariantChannelListingUpdateMutation = gql`
  mutation ProductVariantChannelListingUpdate(
    $id: ID!
    $input: [ProductVariantChannelListingAddInput!]!
  ) {
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
`;

export const ProductVariantPreorderDeactivateMutation = gql`
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
`;
