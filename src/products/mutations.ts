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
        ...ProductErrorFragment
      }
      product {
        id
        media {
          ...ProductMediaFragment
        }
      }
    }
  }
`;

export const productDeleteMutation = gql`
  mutation ProductDelete($id: ID!) {
    productDelete(id: $id) {
      errors {
        ...ProductErrorFragment
      }
      product {
        id
      }
    }
  }
`;

export const productMediaReorder = gql`
  mutation ProductMediaReorder($productId: ID!, $mediaIds: [ID]!) {
    productMediaReorder(productId: $productId, mediaIds: $mediaIds) {
      errors {
        ...ProductErrorFragment
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
        ...ProductErrorFragment
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
        ...ProductErrorWithAttributesFragment
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
        ...ProductErrorWithAttributesFragment
      }
      product {
        ...Product
      }
    }
    productVariantUpdate(id: $productVariantId, input: $productVariantInput) {
      errors {
        ...ProductErrorWithAttributesFragment
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
        ...BulkStockErrorFragment
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
        ...StockErrorFragment
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
        ...BulkStockErrorFragment
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
        ...ProductErrorWithAttributesFragment
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
        ...ProductErrorFragment
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
        ...ProductErrorWithAttributesFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
    productVariantStocksUpdate(stocks: $stocks, variantId: $id) {
      errors {
        ...BulkStockErrorFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
    productVariantStocksCreate(stocks: $addStocks, variantId: $id) {
      errors {
        ...BulkStockErrorFragment
      }
      productVariant {
        id
        stocks {
          ...StockFragment
        }
      }
    }
    productVariantStocksDelete(warehouseIds: $removeStocks, variantId: $id) {
      errors {
        ...ProductVariantStocksDeleteErrorFragment
      }
      productVariant {
        id
        stocks {
          ...StockFragment
        }
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
        ...ProductErrorWithAttributesFragment
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
        ...ProductErrorFragment
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
        ...ProductErrorFragment
      }
      product {
        id
        media {
          ...ProductMediaFragment
        }
      }
    }
  }
`;

export const variantMediaAssignMutation = gql`
  mutation VariantMediaAssign($variantId: ID!, $mediaId: ID!) {
    variantMediaAssign(variantId: $variantId, mediaId: $mediaId) {
      errors {
        ...ProductErrorFragment
      }
      productVariant {
        id
        media {
          ...ProductMediaFragment
        }
        product {
          id
          media {
            ...ProductMediaFragment
          }
          variants {
            id
            name
            sku
            media {
              ...ProductMediaFragment
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
        ...ProductErrorFragment
      }
      productVariant {
        id
        media {
          ...ProductMediaFragment
        }
        product {
          id
          media {
            ...ProductMediaFragment
          }
          variants {
            id
            name
            sku
            media {
              ...ProductMediaFragment
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
        ...ProductErrorFragment
      }
    }
  }
`;

export const ProductVariantBulkCreateMutation = gql`
  mutation ProductVariantBulkCreate(
    $id: ID!
    $inputs: [ProductVariantBulkCreateInput]!
  ) {
    productVariantBulkCreate(product: $id, variants: $inputs) {
      errors {
        ...BulkProductErrorFragment
      }
    }
  }
`;

export const ProductVariantBulkDeleteMutation = gql`
  mutation ProductVariantBulkDelete($ids: [ID!]!) {
    productVariantBulkDelete(ids: $ids) {
      errors {
        ...ProductErrorFragment
      }
    }
  }
`;

export const productExportMutation = gql`
  mutation ProductExport($input: ExportProductsInput!) {
    exportProducts(input: $input) {
      exportFile {
        ...ExportFileFragment
      }
      errors {
        ...ExportErrorFragment
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
          ...ChannelListingProductWithoutPricingFragment
        }
        variants {
          id
          channelListings {
            ...ChannelListingProductVariantFragment
          }
        }
      }
      errors {
        ...ProductChannelListingErrorFragment
      }
    }
  }
`;

export const productVariantReorder = gql`
  mutation ProductVariantReorder($move: ReorderInput!, $productId: ID!) {
    productVariantReorder(moves: [$move], productId: $productId) {
      errors {
        ...ProductErrorFragment
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
          ...ChannelListingProductVariantFragment
        }
        product {
          id
          channelListings {
            ...ChannelListingProductWithoutPricingFragment
          }
        }
      }
      errors {
        ...ProductChannelListingErrorFragment
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
          ...PreorderFragment
        }
      }
      errors {
        ...ProductErrorFragment
      }
    }
  }
`;
