import placeholderImage from "@assets/images/placeholder60x60.png";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductVariantPage from "../../../products/components/ProductVariantPage";
import { variant as variantFixture } from "../../../products/fixtures";
import Decorator from "../../Decorator";

const variant = variantFixture(placeholderImage);

storiesOf("Views / Products / Product variant details", module)
  .addDecorator(Decorator)
  .add("when loaded data", () => (
    <ProductVariantPage
      defaultWeightUnit="kg"
      header={variant.name || variant.sku}
      errors={[]}
      variant={variant}
      onAdd={() => undefined}
      onBack={() => undefined}
      onDelete={undefined}
      onSetDefaultVariant={() => undefined}
      onImageSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={() => undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
    />
  ))
  .add("when loading data", () => (
    <ProductVariantPage
      defaultWeightUnit="kg"
      header={undefined}
      errors={[]}
      loading={true}
      onBack={() => undefined}
      placeholderImage={placeholderImage}
      onAdd={() => undefined}
      onDelete={undefined}
      onSetDefaultVariant={() => undefined}
      onImageSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={() => undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
    />
  ))
  .add("no warehouses", () => (
    <ProductVariantPage
      defaultWeightUnit="kg"
      header={variant.name || variant.sku}
      errors={[]}
      variant={variant}
      onAdd={() => undefined}
      onBack={() => undefined}
      onDelete={undefined}
      onSetDefaultVariant={() => undefined}
      onImageSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={() => undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      warehouses={[]}
      onWarehouseConfigure={() => undefined}
    />
  ))
  .add("attribute errors", () => (
    <ProductVariantPage
      defaultWeightUnit="kg"
      header={variant.name || variant.sku}
      variant={variant}
      onAdd={() => undefined}
      onBack={() => undefined}
      onDelete={undefined}
      onSetDefaultVariant={() => undefined}
      onImageSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={() => undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      errors={[
        {
          attributes: [variant.attributes[0].attribute.id],
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
        message: "Generic form error",
        ...error
      }))}
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
    />
  ));
