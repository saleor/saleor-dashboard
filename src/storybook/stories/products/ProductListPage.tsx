import { storiesOf } from "@storybook/react";
import React from "react";

import placeholderImage from "@assets/images/placeholder255x255.png";
import { defaultListSettings } from "@saleor/config";
import { products as productListFixture } from "@saleor/products/fixtures";
import { ProductListUrlSortField } from "@saleor/products/urls";
import { attributes } from "@saleor/productTypes/fixtures";
import { ListViews } from "@saleor/types";
import { productListFilterOpts } from "@saleor/products/views/ProductList/fixtures";
import {
  fetchMoreProps,
  filterPageProps,
  listActionsProps,
  pageListProps,
  sortPageProps
} from "../../../fixtures";
import ProductListPage, {
  ProductListPageProps
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
      sort: ProductListUrlSortField.name
    }
  },
  activeAttributeSortId: undefined,
  availableInGridAttributes: attributes,
  defaultSettings: defaultListSettings[ListViews.PRODUCT_LIST],
  filterOpts: productListFilterOpts,
  gridAttributes: attributes,
  products,
  settings: {
    ...pageListProps.default.settings,
    columns: ["isPublished", "productType", "price"]
  },
  totalGridAttributes: attributes.length
};

storiesOf("Views / Products / Product list", module)
  .addDecorator(Decorator)
  .add("default", () => <ProductListPage {...props} />)
  .add("loading", () => (
    <ProductListPage
      {...props}
      products={undefined}
      currentTab={undefined}
      disabled={true}
    />
  ))
  .add("no data", () => <ProductListPage {...props} products={[]} />);
