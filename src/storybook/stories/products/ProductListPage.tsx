import placeholderImage from "@assets/images/placeholder255x255.png";
import { defaultListSettings } from "@saleor/config";
import { products as productListFixture } from "@saleor/products/fixtures";
import { ProductListUrlSortField } from "@saleor/products/urls";
import { productListFilterOpts } from "@saleor/products/views/ProductList/fixtures";
import { attributes } from "@saleor/productTypes/fixtures";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { ListViews } from "@saleor/types";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  fetchMoreProps,
  filterPageProps,
  limits,
  limitsReached,
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "../../../fixtures";
import ProductListPage, {
  ProductListPageProps,
} from "../../../products/components/ProductListPage";
import Decorator from "../../Decorator";

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
  settings: {
    ...pageListProps.default.settings,
    columns: ["availability", "productType", "price"],
  },
};

storiesOf("Views / Products / Product list", module)
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
