import {
  bulkProductErrorFragment,
  bulkStockErrorFragment,
  exportErrorFragment,
  productErrorFragment,
  stockErrorFragment
} from "@saleor/fragments/errors";
import {
  exportFileFragment,
  fragmentVariant,
  productFragmentDetails
} from "@saleor/fragments/products";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  productBulkDelete,
  productBulkDeleteVariables
} from "./types/productBulkDelete";
import {
  productBulkPublish,
  productBulkPublishVariables
} from "./types/productBulkPublish";
import { ProductCreate, ProductCreateVariables } from "./types/ProductCreate";
import { ProductDelete, ProductDeleteVariables } from "./types/ProductDelete";
import { ProductExport, ProductExportVariables } from "./types/ProductExport";
import {
  ProductImageCreate,
  ProductImageCreateVariables
} from "./types/ProductImageCreate";
import {
  ProductImageDelete,
  ProductImageDeleteVariables
} from "./types/ProductImageDelete";
import {
  ProductImageReorder,
  ProductImageReorderVariables
} from "./types/ProductImageReorder";
import {
  ProductImageUpdate,
  ProductImageUpdateVariables
} from "./types/ProductImageUpdate";
import {
  ProductSetAvailabilityForPurchase,
  ProductSetAvailabilityForPurchaseVariables
} from "./types/ProductSetAvailabilityForPurchase";
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
  SimpleProductUpdate,
  SimpleProductUpdateVariables
} from "./types/SimpleProductUpdate";
import { VariantCreate, VariantCreateVariables } from "./types/VariantCreate";
import { VariantDelete, VariantDeleteVariables } from "./types/VariantDelete";
import {
  VariantImageAssign,
  VariantImageAssignVariables
} from "./types/VariantImageAssign";
import {
  VariantImageUnassign,
  VariantImageUnassignVariables
} from "./types/VariantImageUnassign";
import { VariantUpdate, VariantUpdateVariables } from "./types/VariantUpdate";

export const productImageCreateMutation = gql`
  ${productErrorFragment}
  ${productFragmentDetails}
  mutation ProductImageCreate($product: ID!, $image: Upload!, $alt: String) {
    productImageCreate(input: { alt: $alt, image: $image, product: $product }) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        ...Product
      }
    }
  }
`;
export const useProductImageCreateMutation = makeMutation<
  ProductImageCreate,
  ProductImageCreateVariables
>(productImageCreateMutation);

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

export const productImagesReorder = gql`
  ${productErrorFragment}
  mutation ProductImageReorder($productId: ID!, $imagesIds: [ID]!) {
    productImageReorder(productId: $productId, imagesIds: $imagesIds) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        id
        images {
          id
          alt
          sortOrder
          url
        }
      }
    }
  }
`;
export const useProductImagesReorder = makeMutation<
  ProductImageReorder,
  ProductImageReorderVariables
>(productImagesReorder);

export const productUpdateMutation = gql`
  ${productErrorFragment}
  ${productFragmentDetails}
  mutation ProductUpdate(
    $id: ID!
    $attributes: [AttributeValueInput]
    $publicationDate: Date
    $category: ID
    $chargeTaxes: Boolean!
    $collections: [ID]
    $descriptionJson: JSONString
    $isPublished: Boolean!
    $name: String
    $basePrice: PositiveDecimal
    $seo: SeoInput
    $visibleInListings: Boolean
  ) {
    productUpdate(
      id: $id
      input: {
        attributes: $attributes
        publicationDate: $publicationDate
        category: $category
        chargeTaxes: $chargeTaxes
        collections: $collections
        descriptionJson: $descriptionJson
        isPublished: $isPublished
        name: $name
        basePrice: $basePrice
        seo: $seo
        visibleInListings: $visibleInListings
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
export const useProductUpdateMutation = makeMutation<
  ProductUpdate,
  ProductUpdateVariables
>(productUpdateMutation);

export const simpleProductUpdateMutation = gql`
  ${bulkStockErrorFragment}
  ${productErrorFragment}
  ${productFragmentDetails}
  ${stockErrorFragment}
  ${fragmentVariant}
  mutation SimpleProductUpdate(
    $id: ID!
    $attributes: [AttributeValueInput]
    $publicationDate: Date
    $category: ID
    $chargeTaxes: Boolean!
    $collections: [ID]
    $descriptionJson: JSONString
    $isPublished: Boolean!
    $name: String
    $basePrice: PositiveDecimal
    $productVariantId: ID!
    $productVariantInput: ProductVariantInput!
    $seo: SeoInput
    $addStocks: [StockInput!]!
    $deleteStocks: [ID!]!
    $updateStocks: [StockInput!]!
    $weight: WeightScalar
    $visibleInListings: Boolean
  ) {
    productUpdate(
      id: $id
      input: {
        attributes: $attributes
        publicationDate: $publicationDate
        category: $category
        chargeTaxes: $chargeTaxes
        collections: $collections
        descriptionJson: $descriptionJson
        isPublished: $isPublished
        name: $name
        basePrice: $basePrice
        seo: $seo
        weight: $weight
        visibleInListings: $visibleInListings
      }
    ) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        ...Product
      }
    }
    productVariantUpdate(id: $productVariantId, input: $productVariantInput) {
      errors: productErrors {
        ...ProductErrorFragment
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
  ${productErrorFragment}
  ${productFragmentDetails}
  mutation ProductCreate(
    $attributes: [AttributeValueInput]
    $publicationDate: Date
    $category: ID!
    $chargeTaxes: Boolean!
    $collections: [ID]
    $descriptionJson: JSONString
    $isPublished: Boolean!
    $name: String!
    $basePrice: PositiveDecimal
    $productType: ID!
    $sku: String
    $seo: SeoInput
    $stocks: [StockInput!]!
    $trackInventory: Boolean!
    $weight: WeightScalar
    $visibleInListings: Boolean
  ) {
    productCreate(
      input: {
        attributes: $attributes
        publicationDate: $publicationDate
        category: $category
        chargeTaxes: $chargeTaxes
        collections: $collections
        descriptionJson: $descriptionJson
        isPublished: $isPublished
        name: $name
        basePrice: $basePrice
        productType: $productType
        sku: $sku
        seo: $seo
        stocks: $stocks
        trackInventory: $trackInventory
        weight: $weight
        visibleInListings: $visibleInListings
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
  ${productErrorFragment}
  mutation VariantUpdate(
    $addStocks: [StockInput!]!
    $removeStocks: [ID!]!
    $id: ID!
    $attributes: [AttributeValueInput]
    $costPrice: PositiveDecimal
    $price: PositiveDecimal
    $sku: String
    $trackInventory: Boolean!
    $stocks: [StockInput!]!
    $weight: WeightScalar
  ) {
    productVariantUpdate(
      id: $id
      input: {
        attributes: $attributes
        costPrice: $costPrice
        price: $price
        sku: $sku
        trackInventory: $trackInventory
        weight: $weight
      }
    ) {
      errors: productErrors {
        ...ProductErrorFragment
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
  ${productErrorFragment}
  mutation VariantCreate($input: ProductVariantCreateInput!) {
    productVariantCreate(input: $input) {
      errors: productErrors {
        ...ProductErrorFragment
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

export const productImageDeleteMutation = gql`
  ${productErrorFragment}
  mutation ProductImageDelete($id: ID!) {
    productImageDelete(id: $id) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        id
        images {
          id
        }
      }
    }
  }
`;
export const useProductImageDeleteMutation = makeMutation<
  ProductImageDelete,
  ProductImageDeleteVariables
>(productImageDeleteMutation);

export const productImageUpdateMutation = gql`
  ${productErrorFragment}
  ${productFragmentDetails}
  mutation ProductImageUpdate($id: ID!, $alt: String!) {
    productImageUpdate(id: $id, input: { alt: $alt }) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      product {
        ...Product
      }
    }
  }
`;
export const useProductImageUpdateMutation = makeMutation<
  ProductImageUpdate,
  ProductImageUpdateVariables
>(productImageUpdateMutation);

export const variantImageAssignMutation = gql`
  ${fragmentVariant}
  ${productErrorFragment}
  mutation VariantImageAssign($variantId: ID!, $imageId: ID!) {
    variantImageAssign(variantId: $variantId, imageId: $imageId) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;
export const useVariantImageAssignMutation = makeMutation<
  VariantImageAssign,
  VariantImageAssignVariables
>(variantImageAssignMutation);

export const variantImageUnassignMutation = gql`
  ${fragmentVariant}
  ${productErrorFragment}
  mutation VariantImageUnassign($variantId: ID!, $imageId: ID!) {
    variantImageUnassign(variantId: $variantId, imageId: $imageId) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productVariant {
        ...ProductVariant
      }
    }
  }
`;
export const useVariantImageUnassignMutation = makeMutation<
  VariantImageUnassign,
  VariantImageUnassignVariables
>(variantImageUnassignMutation);

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

export const productBulkPublishMutation = gql`
  ${productErrorFragment}
  mutation productBulkPublish($ids: [ID!]!, $isPublished: Boolean!) {
    productBulkPublish(ids: $ids, isPublished: $isPublished) {
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const useProductBulkPublishMutation = makeMutation<
  productBulkPublish,
  productBulkPublishVariables
>(productBulkPublishMutation);

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

const productSetAvailabilityForPurchase = gql`
  ${productErrorFragment}
  mutation ProductSetAvailabilityForPurchase(
    $isAvailable: Boolean!
    $productId: ID!
    $startDate: Date
  ) {
    productSetAvailabilityForPurchase(
      isAvailable: $isAvailable
      productId: $productId
      startDate: $startDate
    ) {
      errors: productErrors {
        ...ProductErrorFragment
        message
      }
    }
  }
`;

export const useProductSetAvailabilityForPurchase = makeMutation<
  ProductSetAvailabilityForPurchase,
  ProductSetAvailabilityForPurchaseVariables
>(productSetAvailabilityForPurchase);
