import placeholderImage from "@assets/images/placeholder60x60.png";
import { createVariantChannels } from "@saleor/channels/utils";
import { ProductErrorCode } from "@saleor/graphql";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductVariantPage from "../../../products/components/ProductVariantPage";
import { variant as variantFixture } from "../../../products/fixtures";
import Decorator from "../../Decorator";

const variant = variantFixture(placeholderImage);
const channels = createVariantChannels(variant);

storiesOf("Views / Products / Product variant details", module)
  .addDecorator(Decorator)
  .add("when loaded data", () => (
    <ProductVariantPage
      productId=""
      defaultWeightUnit="kg"
      header={variant.name || variant.sku}
      errors={[]}
      channels={channels}
      channelErrors={[]}
      variant={variant}
      onDelete={undefined}
      onSetDefaultVariant={() => undefined}
      onMediaSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      variantDeactivatePreoderButtonState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
      onVariantPreorderDeactivate={() => undefined}
    />
  ))
  .add("when loading data", () => (
    <ProductVariantPage
      productId=""
      defaultWeightUnit="kg"
      header={undefined}
      errors={[]}
      channels={channels}
      channelErrors={[]}
      loading={true}
      placeholderImage={placeholderImage}
      onDelete={undefined}
      onSetDefaultVariant={() => undefined}
      onMediaSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      variantDeactivatePreoderButtonState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
      onVariantPreorderDeactivate={() => undefined}
    />
  ))
  .add("no warehouses", () => (
    <ProductVariantPage
      productId=""
      defaultWeightUnit="kg"
      header={variant.name || variant.sku}
      errors={[]}
      channels={channels}
      channelErrors={[]}
      variant={variant}
      onDelete={undefined}
      onSetDefaultVariant={() => undefined}
      onMediaSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      variantDeactivatePreoderButtonState="default"
      warehouses={[]}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
      onVariantPreorderDeactivate={() => undefined}
    />
  ))
  .add("attribute errors", () => (
    <ProductVariantPage
      productId=""
      defaultWeightUnit="kg"
      header={variant.name || variant.sku}
      channels={channels}
      variant={variant}
      onDelete={undefined}
      onSetDefaultVariant={() => undefined}
      onMediaSelect={() => undefined}
      onSubmit={() => undefined}
      onVariantReorder={() => undefined}
      saveButtonBarState="default"
      variantDeactivatePreoderButtonState="default"
      errors={[
        {
          attributes: [variant.selectionAttributes[0].attribute.id],
          code: ProductErrorCode.REQUIRED,
          field: "attributes",
        },
        {
          attributes: null,
          code: ProductErrorCode.UNIQUE,
          field: "attributes",
        },
        {
          attributes: null,
          code: ProductErrorCode.ALREADY_EXISTS,
          field: "sku",
        },
      ].map(error => ({
        __typename: "ProductError",
        message: "Generic form error",
        ...error,
      }))}
      channelErrors={[
        {
          __typename: "ProductChannelListingError",
          channels: ["Q2hhbm5lbDox"],
          code: ProductErrorCode.INVALID,
          field: "price",
          message: "Product price cannot be lower than 0.",
        },
      ]}
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      fetchAttributeValues={() => undefined}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onAttributeSelectBlur={() => undefined}
      onVariantPreorderDeactivate={() => undefined}
    />
  ));
