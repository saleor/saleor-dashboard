// @ts-strict-ignore
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
import Decorator from "@dashboard/storybook/Decorator";
import { PaginatorContextDecorator } from "@dashboard/storybook/PaginatorContextDecorator";
import { ListViews } from "@dashboard/types";
import { storiesOf } from "@storybook/react";
import React from "react";

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
  },
  activeAttributeSortId: undefined,
  availableInGridAttributes: attributes,
  columnQuery: "",
  onColumnQueryChange: () => undefined,
  currencySymbol: "USD",
  defaultSettings: defaultListSettings[ListViews.PRODUCT_LIST],
  filterOpts: productListFilterOpts,
  gridAttributes: attributes,
  limits,
  onExport: () => undefined,
  products,
  selectedChannelId: "123",
  selectedProductIds: ["123"],
  settings: {
    ...pageListProps.default.settings,
    columns: ["availability", "productType", "price"],
  },
};

storiesOf("Products / Product list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <ProductListPage {...props} />)
  .add("loading", () => (
    <ProductListPage
      {...props}
      products={undefined}
      currentTab={undefined}
      disabled={true}
    />
  ))
  .add("with data", () => <ProductListPage {...props} products={products} />)
  .add("no data", () => <ProductListPage {...props} products={[]} />)
  .add("no channels", () => (
    <ProductListPage
      {...props}
      selectedChannelId={""}
      products={products.map(product => ({ ...product, channelListings: [] }))}
    />
  ))
  .add("no limits", () => <ProductListPage {...props} limits={undefined} />)
  .add("limits reached", () => (
    <ProductListPage {...props} limits={limitsReached} />
  ));
