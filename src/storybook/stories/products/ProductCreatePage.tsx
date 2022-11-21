import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsData } from "@saleor/channels/utils";
import { fetchMoreProps } from "@saleor/fixtures";
import { ProductErrorCode } from "@saleor/graphql";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductCreatePage, {
  ProductCreateFormData,
} from "../../../products/components/ProductCreatePage";
import { product as productFixture } from "../../../products/fixtures";
import {
  productTypes,
  productTypeSearch,
} from "../../../productTypes/fixtures";
import Decorator from "../../Decorator";
import { taxTypes } from "../taxes/fixtures";

const product = productFixture("");
const channels = createChannelsData(channelsList);

storiesOf("Views / Products / Create product", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ProductCreatePage
      channelsErrors={[]}
      currentChannels={channels}
      allChannelsCount={5}
      loading={false}
      errors={[]}
      header="Add product"
      collections={product.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      fetchProductTypes={() => undefined}
      fetchAttributeValues={() => undefined}
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      fetchMoreAttributeValues={fetchMoreProps}
      productTypes={productTypes}
      categories={[product.category]}
      onChannelsChange={() => undefined}
      onSubmit={() => undefined}
      openChannelsModal={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      taxTypes={taxTypes}
      weightUnit="kg"
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onSelectProductType={() => undefined}
      onAttributeSelectBlur={() => undefined}
    />
  ))
  .add("When loading", () => (
    <ProductCreatePage
      channelsErrors={[]}
      currentChannels={channels}
      allChannelsCount={5}
      loading={true}
      errors={[]}
      header="Add product"
      collections={product.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      fetchProductTypes={() => undefined}
      fetchAttributeValues={() => undefined}
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      fetchMoreAttributeValues={fetchMoreProps}
      productTypes={productTypes}
      categories={[product.category]}
      onChannelsChange={() => undefined}
      onSubmit={() => undefined}
      openChannelsModal={() => undefined}
      saveButtonBarState="default"
      warehouses={undefined}
      onWarehouseConfigure={() => undefined}
      taxTypes={taxTypes}
      weightUnit="kg"
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onSelectProductType={() => undefined}
      onAttributeSelectBlur={() => undefined}
    />
  ))
  .add("form errors", () => (
    <ProductCreatePage
      channelsErrors={[]}
      currentChannels={channels}
      allChannelsCount={5}
      loading={false}
      errors={([
        "attributes",
        "name",
        "productType",
        "category",
        "sku",
      ] as Array<keyof ProductCreateFormData | "attributes">).map(field => ({
        __typename: "ProductError",
        attributes:
          field === "attributes"
            ? [productTypeSearch.productAttributes[0].id]
            : null,
        code: ProductErrorCode.INVALID,
        field,
        message: "Attributes invalid",
      }))}
      header="Add product"
      collections={product.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      fetchProductTypes={() => undefined}
      fetchAttributeValues={() => undefined}
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      selectedProductType={productTypeSearch}
      fetchMoreAttributeValues={fetchMoreProps}
      productTypes={productTypes}
      categories={[product.category]}
      onChannelsChange={() => undefined}
      onSubmit={() => undefined}
      openChannelsModal={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      taxTypes={taxTypes}
      weightUnit="kg"
      referencePages={[]}
      referenceProducts={[]}
      attributeValues={[]}
      onAssignReferencesClick={() => undefined}
      onCloseDialog={() => undefined}
      onSelectProductType={() => undefined}
      onAttributeSelectBlur={() => undefined}
    />
  ));
