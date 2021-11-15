import placeholderImage from "@assets/images/placeholder255x255.png";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductVariantCreatePage from "../../../products/components/ProductVariantCreatePage";
import { product as productFixture } from "../../../products/fixtures";
import Decorator from "../../Decorator";

const product = productFixture(placeholderImage);

storiesOf("Views / Products / Create product variant", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ProductVariantCreatePage
      weightUnit="kg"
      disabled={false}
      errors={[]}
      header="Add variant"
      product={product}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
    />
  ))
  .add("with errors", () => (
    <ProductVariantCreatePage
      weightUnit="kg"
      disabled={false}
      errors={[
        {
          attributes: [product.productType.variantAttributes[0].id],
          code: ProductErrorCode.REQUIRED,
          field: "attributes"
        },
        {
          attributes: null,
          code: ProductErrorCode.UNIQUE,
          field: "attributes"
        },
        {
          attributes: null,
          code: ProductErrorCode.ALREADY_EXISTS,
          field: "sku"
        }
      ].map(error => ({
        __typename: "ProductError",
        ...error
      }))}
      header="Add variant"
      product={product}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
    />
  ))
  .add("when loading data", () => (
    <ProductVariantCreatePage
      weightUnit="kg"
      disabled={true}
      errors={[]}
      header="Add variant"
      product={undefined}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
    />
  ))
  .add("add first variant", () => (
    <ProductVariantCreatePage
      weightUnit="kg"
      disabled={false}
      errors={[]}
      header="Add variant"
      product={{
        ...product,
        variants: []
      }}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
    />
  ))
  .add("no warehouses", () => (
    <ProductVariantCreatePage
      weightUnit="kg"
      disabled={false}
      errors={[]}
      header="Add variant"
      product={product}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      warehouses={[]}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
    />
  ));
