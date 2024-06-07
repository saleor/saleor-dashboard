// @ts-strict-ignore
import { channelsList } from "@dashboard/channels/fixtures";
import { createChannelsData } from "@dashboard/channels/utils";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { fetchMoreProps } from "@dashboard/fixtures";
import {
  ProductChannelListingErrorFragment,
  ProductErrorCode,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
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

const props = {
  channelsErrors: [] as ProductChannelListingErrorFragment[],
  currentChannels: channels,
  allChannelsCount: 5,
  loading: false,
  errors: [] as ProductErrorWithAttributesFragment[],
  header: "Add product",
  collections: product.collections,
  fetchCategories: () => undefined,
  fetchCollections: () => undefined,
  fetchProductTypes: () => undefined,
  fetchAttributeValues: () => undefined,
  fetchMoreCategories: fetchMoreProps,
  fetchMoreCollections: fetchMoreProps,
  fetchMoreProductTypes: fetchMoreProps,
  fetchMoreAttributeValues: fetchMoreProps,
  productTypes,
  categories: [product.category],
  onChannelsChange: () => undefined,
  onSubmit: () => undefined,
  openChannelsModal: () => undefined,
  saveButtonBarState: "default" as ConfirmButtonTransitionState,
  warehouses: warehouseList,
  onWarehouseConfigure: () => undefined,
  taxClasses,
  fetchMoreTaxClasses: undefined,
  weightUnit: "kg",
  referencePages: [],
  referenceProducts: [],
  attributeValues: [],
  onAssignReferencesClick: () => undefined,
  onCloseDialog: () => undefined,
  onSelectProductType: () => undefined,
  onAttributeSelectBlur: () => undefined,
  fetchMoreWarehouses: () => undefined,
  searchWarehousesResult: undefined,
};

export const Default = () => <ProductCreatePage {...props} />;

export const WhenLoading = () => (
  <ProductCreatePage {...props} loading={true} />
);

export const FormErrors = () => (
  <ProductCreatePage
    {...props}
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
  />
);
