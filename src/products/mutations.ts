import {
  bulkProductErrorFragment,
  bulkStockErrorFragment,
  exportErrorFragment,
  productChannelListingErrorFragment,
  productErrorFragment,
  productErrorWithAttributesFragment,
  stockErrorFragment
} from "@saleor/fragments/errors";
import {
  exportFileFragment,
  fragmentVariant,
  productFragmentDetails
} from "@saleor/fragments/products";
import makeMutation from "@saleor/hooks/makeMutation";
import {
  ProductMediaDelete,
  ProductMediaDeleteVariables
} from "@saleor/products/types/ProductMediaDelete";
import {
  ProductMediaReorder,
  ProductMediaReorderVariables
} from "@saleor/products/types/ProductMediaReorder";
import {
  ProductMediaUpdate,
  ProductMediaUpdateVariables
} from "@saleor/products/types/ProductMediaUpdate";
import {
  VariantMediaAssign,
  VariantMediaAssignVariables
} from "@saleor/products/types/VariantMediaAssign";
import {
  VariantMediaUnassign,
  VariantMediaUnassignVariables
} from "@saleor/products/types/VariantMediaUnassign";
import gql from "graphql-tag";

import {
  productBulkDelete,
  productBulkDeleteVariables
} from "./types/productBulkDelete";
import {
  ProductChannelListingUpdate,
  ProductChannelListingUpdateVariables
} from "./types/ProductChannelListingUpdate";
import { ProductCreate, ProductCreateVariables } from "./types/ProductCreate";
import { ProductDelete, ProductDeleteVariables } from "./types/ProductDelete";
import { ProductExport, ProductExportVariables } from "./types/ProductExport";
import {
  ProductMediaCreate,
  ProductMediaCreateVariables
} from "./types/ProductMediaCreate";
import { ProductUpdate, ProductUpdateVariables } from "./types/ProductUpdate";
import {
  ProductVariantBulkCreate,
  ProductVariantBulkCreateVariables
} from "./types/ProductVariantBulkCreate";
import {
  ProductVariantBulkDelete,
  ProductVariantBulkDeleteVariables
} from "./types/ProductVariantBulkDelete";
import {
  ProductVariantChannelListingUpdate,
  ProductVariantChannelListingUpdateVariables
} from "./types/ProductVariantChannelListingUpdate";
import {
  ProductVariantReorder,
  ProductVariantReorderVariables
} from "./types/ProductVariantReorder";
import {
  ProductVariantSetDefault,
  ProductVariantSetDefaultVariables
} from "./types/ProductVariantSetDefault";
import {
  SimpleProductUpdate,
  SimpleProductUpdateVariables
} from "./types/SimpleProductUpdate";
import { VariantCreate, VariantCreateVariables } from "./types/VariantCreate";
import { VariantDelete, VariantDeleteVariables } from "./types/VariantDelete";
import { VariantUpdate, VariantUpdateVariables } from "./types/VariantUpdate";

export const productMediaCreateMutation = gql`
  ${productErrorFragment}
  ${productFragmentDetails}
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
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        ...Product
      }
    }
  }
`;
export const useProductMediaCreateMutation = makeMutation<
  ProductMediaCreate,
  ProductMediaCreateVariables
>(productMediaCreateMutation);

export const productDeleteMutation = gql`
  ${productErrorFragment}
  mutation ProductDelete($id: ID!) {
    productDelete(id: $id) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        id
      }
    }
  }
`;
export const useProductDeleteMutation = makeMutation<
  ProductDelete,
  ProductDeleteVariables
>(productDeleteMutation);

export const productMediaReorder = gql`
  ${productErrorFragment}
  mutation ProductMediaReorder($productId: ID!, $mediaIds: [ID]!) {
    productMediaReorder(productId: $productId, mediaIds: $mediaIds) {
      errors: productErrors {
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
export const useProductMediaReorder = makeMutation<
  ProductMediaReorder,
  ProductMediaReorderVariables
>(productMediaReorder);

const productVariantSetDefault = gql`
  ${productErrorFragment}
  ${productFragmentDetails}
  mutation ProductVariantSetDefault($productId: ID!, $variantId: ID!) {
    productVariantSetDefault(productId: $productId, variantId: $variantId) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        ...Product
      }
    }
  }
`;

export const useProductVariantSetDefaultMutation = makeMutation<
  ProductVariantSetDefault,
  ProductVariantSetDefaultVariables
>(productVariantSetDefault);

export const productUpdateMutation = gql`
  ${productErrorWithAttributesFragment}
  ${productFragmentDetails}
  mutation ProductUpdate($id: ID!, $input: ProductInput!) {
    productUpdate(id: $id, input: $input) {
      errors: productErrors {
        ...ProductErrorWithAttributesFragment
      }
      product {
        ...Product
      }
    }
  }
`;
export const useProductUpdateMutation = makeMutation<
  ProductUpdate,
  ProductUpdateVariables
>(productUpdateMutation);

export const simpleProductUpdateMutation = gql`
  ${bulkStockErrorFragment}
  ${productErrorWithAttributesFragment}
  ${productFragmentDetails}
  ${stockErrorFragment}
  ${fragmentVariant}
  mutation SimpleProductUpdate(
    $id: ID!
    $input: ProductInput!
    $productVariantId: ID!
    $productVariantInput: ProductVariantInput!
    $addStocks: [StockInput!]!
    $deleteStocks: [ID!]!
    $updateStocks: [StockInput!]!
  ) {
    productUpdate(id: $id, input: $input) {
      errors: productErrors {
        ...ProductErrorWithAttributesFragment
      }
      product {
        ...Product
      }
    }
    productVariantUpdate(id: $productVariantId, input: $productVariantInput) {
      errors: productErrors {
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
      errors: bulkStockErrors {
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
      errors: stockErrors {
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
      errors: bulkStockErrors {
        ...BulkStockErrorFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;
export const useSimpleProductUpdateMutation = makeMutation<
  SimpleProductUpdate,
  SimpleProductUpdateVariables
>(simpleProductUpdateMutation);

export const productCreateMutation = gql`
  ${productErrorWithAttributesFragment}
  ${productFragmentDetails}
  mutation ProductCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      errors: productErrors {
        ...ProductErrorWithAttributesFragment
      }
      product {
        ...Product
      }
    }
  }
`;
export const useProductCreateMutation = makeMutation<
  ProductCreate,
  ProductCreateVariables
>(productCreateMutation);

export const variantDeleteMutation = gql`
  ${productErrorFragment}
  mutation VariantDelete($id: ID!) {
    productVariantDelete(id: $id) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productVariant {
        id
      }
    }
  }
`;
export const useVariantDeleteMutation = makeMutation<
  VariantDelete,
  VariantDeleteVariables
>(variantDeleteMutation);

export const variantUpdateMutation = gql`
  ${bulkStockErrorFragment}
  ${fragmentVariant}
  ${productErrorWithAttributesFragment}
  mutation VariantUpdate(
    $addStocks: [StockInput!]!
    $removeStocks: [ID!]!
    $id: ID!
    $attributes: [AttributeValueInput]
    $sku: String
    $trackInventory: Boolean!
    $stocks: [StockInput!]!
    $weight: WeightScalar
  ) {
    productVariantUpdate(
      id: $id
      input: {
        attributes: $attributes
        sku: $sku
        trackInventory: $trackInventory
        weight: $weight
      }
    ) {
      errors: productErrors {
        ...ProductErrorWithAttributesFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
    productVariantStocksUpdate(stocks: $stocks, variantId: $id) {
      errors: bulkStockErrors {
        ...BulkStockErrorFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
    productVariantStocksCreate(stocks: $addStocks, variantId: $id) {
      errors: bulkStockErrors {
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
      errors: stockErrors {
        code
        field
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
export const useVariantUpdateMutation = makeMutation<
  VariantUpdate,
  VariantUpdateVariables
>(variantUpdateMutation);

export const variantCreateMutation = gql`
  ${fragmentVariant}
  ${productErrorWithAttributesFragment}
  mutation VariantCreate($input: ProductVariantCreateInput!) {
    productVariantCreate(input: $input) {
      errors: productErrors {
        ...ProductErrorWithAttributesFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;
export const useVariantCreateMutation = makeMutation<
  VariantCreate,
  VariantCreateVariables
>(variantCreateMutation);

export const productMediaDeleteMutation = gql`
  ${productErrorFragment}
  mutation ProductMediaDelete($id: ID!) {
    productMediaDelete(id: $id) {
      errors: productErrors {
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
export const useProductMediaDeleteMutation = makeMutation<
  ProductMediaDelete,
  ProductMediaDeleteVariables
>(productMediaDeleteMutation);

export const productMediaUpdateMutation = gql`
  ${productErrorFragment}
  ${productFragmentDetails}
  mutation ProductMediaUpdate($id: ID!, $alt: String!) {
    productMediaUpdate(id: $id, input: { alt: $alt }) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        ...Product
      }
    }
  }
`;
export const useProductMediaUpdateMutation = makeMutation<
  ProductMediaUpdate,
  ProductMediaUpdateVariables
>(productMediaUpdateMutation);

export const variantMediaAssignMutation = gql`
  ${fragmentVariant}
  ${productErrorFragment}
  mutation VariantMediaAssign($variantId: ID!, $mediaId: ID!) {
    variantMediaAssign(variantId: $variantId, mediaId: $mediaId) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;
export const useVariantMediaAssignMutation = makeMutation<
  VariantMediaAssign,
  VariantMediaAssignVariables
>(variantMediaAssignMutation);

export const variantMediaUnassignMutation = gql`
  ${fragmentVariant}
  ${productErrorFragment}
  mutation VariantMediaUnassign($variantId: ID!, $mediaId: ID!) {
    variantMediaUnassign(variantId: $variantId, mediaId: $mediaId) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;
export const useVariantMediaUnassignMutation = makeMutation<
  VariantMediaUnassign,
  VariantMediaUnassignVariables
>(variantMediaUnassignMutation);

export const productBulkDeleteMutation = gql`
  ${productErrorFragment}
  mutation productBulkDelete($ids: [ID!]!) {
    productBulkDelete(ids: $ids) {
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const useProductBulkDeleteMutation = makeMutation<
  productBulkDelete,
  productBulkDeleteVariables
>(productBulkDeleteMutation);

export const ProductVariantBulkCreateMutation = gql`
  ${bulkProductErrorFragment}
  mutation ProductVariantBulkCreate(
    $id: ID!
    $inputs: [ProductVariantBulkCreateInput]!
  ) {
    productVariantBulkCreate(product: $id, variants: $inputs) {
      errors: bulkProductErrors {
        ...BulkProductErrorFragment
      }
    }
  }
`;
export const useProductVariantBulkCreateMutation = makeMutation<
  ProductVariantBulkCreate,
  ProductVariantBulkCreateVariables
>(ProductVariantBulkCreateMutation);

export const ProductVariantBulkDeleteMutation = gql`
  ${productErrorFragment}
  mutation ProductVariantBulkDelete($ids: [ID!]!) {
    productVariantBulkDelete(ids: $ids) {
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const useProductVariantBulkDeleteMutation = makeMutation<
  ProductVariantBulkDelete,
  ProductVariantBulkDeleteVariables
>(ProductVariantBulkDeleteMutation);

export const productExportMutation = gql`
  ${exportFileFragment}
  ${exportErrorFragment}
  mutation ProductExport($input: ExportProductsInput!) {
    exportProducts(input: $input) {
      exportFile {
        ...ExportFileFragment
      }
      errors: exportErrors {
        ...ExportErrorFragment
      }
    }
  }
`;
export const useProductExport = makeMutation<
  ProductExport,
  ProductExportVariables
>(productExportMutation);

export const ProductChannelListingUpdateMutation = gql`
  ${productFragmentDetails}
  ${productChannelListingErrorFragment}
  mutation ProductChannelListingUpdate(
    $id: ID!
    $input: ProductChannelListingUpdateInput!
  ) {
    productChannelListingUpdate(id: $id, input: $input) {
      product {
        ...Product
      }
      errors: productChannelListingErrors {
        ...ProductChannelListingErrorFragment
      }
    }
  }
`;

const productVariantReorder = gql`
  ${productErrorFragment}
  ${productFragmentDetails}
  mutation ProductVariantReorder($move: ReorderInput!, $productId: ID!) {
    productVariantReorder(moves: [$move], productId: $productId) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        ...Product
      }
    }
  }
`;
export const useProductVariantReorderMutation = makeMutation<
  ProductVariantReorder,
  ProductVariantReorderVariables
>(productVariantReorder);
export const useProductChannelListingUpdate = makeMutation<
  ProductChannelListingUpdate,
  ProductChannelListingUpdateVariables
>(ProductChannelListingUpdateMutation);

export const ProductVariantChannelListingUpdateMutation = gql`
  ${fragmentVariant}
  ${productChannelListingErrorFragment}
  mutation ProductVariantChannelListingUpdate(
    $id: ID!
    $input: [ProductVariantChannelListingAddInput!]!
  ) {
    productVariantChannelListingUpdate(id: $id, input: $input) {
      variant {
        ...ProductVariant
      }
      errors: productChannelListingErrors {
        ...ProductChannelListingErrorFragment
      }
    }
  }
`;

export const useProductVariantChannelListingUpdate = makeMutation<
  ProductVariantChannelListingUpdate,
  ProductVariantChannelListingUpdateVariables
>(ProductVariantChannelListingUpdateMutation);
