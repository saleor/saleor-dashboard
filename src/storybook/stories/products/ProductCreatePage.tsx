import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsData } from "@saleor/channels/utils";
import { fetchMoreProps } from "@saleor/fixtures";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductCreatePage, {
  ProductCreateFormData
} from "../../../products/components/ProductCreatePage";
import { product as productFixture } from "../../../products/fixtures";
import { productTypes } from "../../../productTypes/fixtures";
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
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      productTypes={productTypes}
      categories={[product.category]}
      onBack={() => undefined}
      onChannelsChange={() => undefined}
      onSubmit={() => undefined}
      openChannelsModal={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      taxTypes={taxTypes}
      weightUnit="kg"
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
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      productTypes={productTypes}
      categories={[product.category]}
      onBack={() => undefined}
      onChannelsChange={() => undefined}
      onSubmit={() => undefined}
      openChannelsModal={() => undefined}
      saveButtonBarState="default"
      warehouses={undefined}
      onWarehouseConfigure={() => undefined}
      taxTypes={taxTypes}
      weightUnit="kg"
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
        "sku"
      ] as Array<keyof ProductCreateFormData | "attributes">).map(field => ({
        __typename: "ProductError",
        attributes:
          field === "attributes"
            ? [productTypes[0].productAttributes[0].id]
            : null,
        code: ProductErrorCode.INVALID,
        field
      }))}
      header="Add product"
      collections={product.collections}
      fetchCategories={() => undefined}
      fetchCollections={() => undefined}
      fetchProductTypes={() => undefined}
      fetchMoreCategories={fetchMoreProps}
      fetchMoreCollections={fetchMoreProps}
      fetchMoreProductTypes={fetchMoreProps}
      initial={{
        productType: productTypes[0]
      }}
      productTypes={productTypes}
      categories={[product.category]}
      onBack={() => undefined}
      onChannelsChange={() => undefined}
      onSubmit={() => undefined}
      openChannelsModal={() => undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
      onWarehouseConfigure={() => undefined}
      taxTypes={taxTypes}
      weightUnit="kg"
    />
  ));
