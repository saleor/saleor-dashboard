import placeholderImage from "@assets/images/placeholder255x255.png";
import { defaultListSettings } from "@dashboard/config";
import {
  fetchMoreProps,
  filterPageProps,
  limits,
  limitsReached,
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { products as productListFixture } from "@dashboard/products/fixtures";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { productListFilterOpts } from "@dashboard/products/views/ProductList/fixtures";
import { attributes } from "@dashboard/productTypes/fixtures";
import { ListViews } from "@dashboard/types";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import ProductListPage, { ProductListPageProps } from "./ProductListPage";

const products = productListFixture(placeholderImage);

const props: ProductListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...filterPageProps,
  ...fetchMoreProps,
  ...{
    ...sortPageProps,
    sort: {
      ...sortPageProps.sort,
      sort: ProductListUrlSortField.name,
    },
    onProductsDelete: () => undefined,
    onSelectProductIds: () => undefined,
    channels: [],
    columnQuery: "",
    currentTab: 0,
    hasPresetsChanged: false,
    onTabSave: () => undefined,
    onTabUpdate: () => undefined,
    availableInGridAttributes: [],
    onColumnQueryChange: () => undefined,
  },
  activeAttributeSortId: undefined,
  currencySymbol: "USD",
  defaultSettings: defaultListSettings[ListViews.PRODUCT_LIST],
  filterOpts: productListFilterOpts,
  gridAttributes: attributes,
  limits,
  onExport: () => undefined,
  products,
  selectedChannelId: "123",
  selectedProductIds: ["123"],
  setBulkDeleteButtonRef: () => undefined,
  clearRowSelection: () => undefined,
  settings: {
    ...pageListProps.default.settings,
    columns: ["availability", "productType", "price"],
  },
};

export default {
  title: "Products / Product list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <ProductListPage {...props} />;

export const Loading = () => (
  <ProductListPage
    {...props}
    products={undefined}
    currentTab={undefined}
    disabled={true}
  />
);

export const WithData = () => (
  <ProductListPage {...props} products={products} />
);

export const NoData = () => <ProductListPage {...props} products={[]} />;

export const NoChannels = () => (
  <ProductListPage
    {...props}
    selectedChannelId={""}
    products={products.map(product => ({ ...product, channelListings: [] }))}
  />
);

export const NoLimits = () => <ProductListPage {...props} limits={undefined} />;

export const LimitsReached = () => (
  <ProductListPage {...props} limits={limitsReached} />
);
