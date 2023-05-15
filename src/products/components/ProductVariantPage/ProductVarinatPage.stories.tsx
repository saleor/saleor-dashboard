import placeholderImage from "@assets/images/placeholder60x60.png";
import { createVariantChannels } from "@dashboard/channels/utils";
import { ProductErrorCode } from "@dashboard/graphql";
import { warehouseList } from "@dashboard/warehouses/fixtures";
import React from "react";

import { variant as variantFixture } from "../../fixtures";
import ProductVariantPage from "./ProductVariantPage";

const variant = variantFixture(placeholderImage);
const channels = createVariantChannels(variant);

export default {
  title: "Products / Product variant details",
};

export const WhenLoadedData = () => (
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
);

export const WhenLoadingData = () => (
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
);

export const NoWarehouses = () => (
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
);

export const AttributeErrors = () => (
  <ProductVariantPage
    productId=""
    defaultWeightUnit="kg"
    header={variant.name || variant.sku}
    channels={channels}
    variant={variant}
    onDelete={undefined}
    onSetDefaultVariant={() => undefined}
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
);
