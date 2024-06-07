// @ts-strict-ignore
import placeholderImage from "@assets/images/placeholder255x255.png";
import { ProductErrorCode } from "@dashboard/graphql";
import React from "react";

import { product as productFixture } from "../../fixtures";
import ProductVariantCreatePage from "./ProductVariantCreatePage";

const product = productFixture(placeholderImage);

export default {
  title: "Products / Create product variant",
};

export const Default = () => (
  <ProductVariantCreatePage
    productId=""
    weightUnit="kg"
    disabled={false}
    errors={[]}
    header="Add variant"
    product={product}
    onSubmit={() => undefined}
    onVariantClick={undefined}
    onVariantReorder={() => undefined}
    saveButtonBarState="default"
    onWarehouseConfigure={() => undefined}
    referencePages={[]}
    referenceProducts={[]}
    attributeValues={[]}
    fetchAttributeValues={() => undefined}
    onAssignReferencesClick={() => undefined}
    onCloseDialog={() => undefined}
    onAttributeSelectBlur={() => undefined}
    fetchMoreWarehouses={() => undefined}
    searchWarehousesResult={undefined}
  />
);

export const WithErrors = () => (
  <ProductVariantCreatePage
    productId=""
    weightUnit="kg"
    disabled={false}
    errors={[
      {
        attributes: [product.productType.variantAttributes[0].id],
        code: ProductErrorCode.REQUIRED,
        field: "attributes",
        message: "Attributes required",
      },
      {
        attributes: null,
        code: ProductErrorCode.UNIQUE,
        field: "attributes",
        message: "Attributes has unique",
      },
      {
        attributes: null,
        code: ProductErrorCode.ALREADY_EXISTS,
        field: "sku",
        message: "Sku already exists",
      },
    ].map(error => ({
      __typename: "ProductError",
      ...error,
    }))}
    header="Add variant"
    product={product}
    onSubmit={() => undefined}
    onVariantClick={undefined}
    onVariantReorder={() => undefined}
    saveButtonBarState="default"
    onWarehouseConfigure={() => undefined}
    referencePages={[]}
    referenceProducts={[]}
    attributeValues={[]}
    fetchAttributeValues={() => undefined}
    onAssignReferencesClick={() => undefined}
    onCloseDialog={() => undefined}
    onAttributeSelectBlur={() => undefined}
    fetchMoreWarehouses={() => undefined}
    searchWarehousesResult={undefined}
  />
);

export const WhenLoadingData = () => (
  <ProductVariantCreatePage
    productId=""
    weightUnit="kg"
    disabled={true}
    errors={[]}
    header="Add variant"
    product={undefined}
    onSubmit={() => undefined}
    onVariantClick={undefined}
    onVariantReorder={() => undefined}
    saveButtonBarState="default"
    onWarehouseConfigure={() => undefined}
    referencePages={[]}
    referenceProducts={[]}
    attributeValues={[]}
    fetchAttributeValues={() => undefined}
    onAssignReferencesClick={() => undefined}
    onCloseDialog={() => undefined}
    onAttributeSelectBlur={() => undefined}
    fetchMoreWarehouses={() => undefined}
    searchWarehousesResult={undefined}
  />
);

export const AddFirstVariant = () => (
  <ProductVariantCreatePage
    productId=""
    weightUnit="kg"
    disabled={false}
    errors={[]}
    header="Add variant"
    product={{
      ...product,
      variants: [],
    }}
    onSubmit={() => undefined}
    onVariantClick={undefined}
    onVariantReorder={() => undefined}
    saveButtonBarState="default"
    onWarehouseConfigure={() => undefined}
    referencePages={[]}
    referenceProducts={[]}
    attributeValues={[]}
    fetchAttributeValues={() => undefined}
    onAssignReferencesClick={() => undefined}
    onCloseDialog={() => undefined}
    onAttributeSelectBlur={() => undefined}
    fetchMoreWarehouses={() => undefined}
    searchWarehousesResult={undefined}
  />
);

export const NoWarehouses = () => (
  <ProductVariantCreatePage
    productId=""
    weightUnit="kg"
    disabled={false}
    errors={[]}
    header="Add variant"
    product={product}
    onSubmit={() => undefined}
    onVariantClick={undefined}
    onVariantReorder={() => undefined}
    saveButtonBarState="default"
    onWarehouseConfigure={() => undefined}
    referencePages={[]}
    referenceProducts={[]}
    attributeValues={[]}
    fetchAttributeValues={() => undefined}
    onAssignReferencesClick={() => undefined}
    onCloseDialog={() => undefined}
    onAttributeSelectBlur={() => undefined}
    fetchMoreWarehouses={() => undefined}
    searchWarehousesResult={undefined}
  />
);
