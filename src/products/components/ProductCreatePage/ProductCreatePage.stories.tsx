import { channelsList } from "@dashboard/channels/fixtures";
import { createChannelsData } from "@dashboard/channels/utils";
import { fetchMoreProps } from "@dashboard/fixtures";
import { ProductErrorCode } from "@dashboard/graphql";
import {
  productTypes,
  productTypeSearch,
} from "@dashboard/productTypes/fixtures";
import { taxClasses } from "@dashboard/taxes/fixtures";
import { warehouseList } from "@dashboard/warehouses/fixtures";
import React from "react";

import { product as productFixture } from "../../fixtures";
import { ProductCreateFormData } from "./form";
import ProductCreatePage from "./ProductCreatePage";

const product = productFixture("");
const channels = createChannelsData(channelsList);

export default {
  title: "Products / Create product",
};

export const Default = () => (
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
    taxClasses={taxClasses}
    fetchMoreTaxClasses={undefined}
    weightUnit="kg"
    referencePages={[]}
    referenceProducts={[]}
    attributeValues={[]}
    onAssignReferencesClick={() => undefined}
    onCloseDialog={() => undefined}
    onSelectProductType={() => undefined}
    onAttributeSelectBlur={() => undefined}
  />
);

export const WhenLoading = () => (
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
    taxClasses={taxClasses}
    fetchMoreTaxClasses={undefined}
    weightUnit="kg"
    referencePages={[]}
    referenceProducts={[]}
    attributeValues={[]}
    onAssignReferencesClick={() => undefined}
    onCloseDialog={() => undefined}
    onSelectProductType={() => undefined}
    onAttributeSelectBlur={() => undefined}
  />
);

export const FormErrors = () => (
  <ProductCreatePage
    channelsErrors={[]}
    currentChannels={channels}
    allChannelsCount={5}
    loading={false}
    errors={(
      ["attributes", "name", "productType", "category", "sku"] as Array<
        keyof ProductCreateFormData | "attributes"
      >
    ).map(field => ({
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
    taxClasses={taxClasses}
    fetchMoreTaxClasses={undefined}
    weightUnit="kg"
    referencePages={[]}
    referenceProducts={[]}
    attributeValues={[]}
    onAssignReferencesClick={() => undefined}
    onCloseDialog={() => undefined}
    onSelectProductType={() => undefined}
    onAttributeSelectBlur={() => undefined}
  />
);
