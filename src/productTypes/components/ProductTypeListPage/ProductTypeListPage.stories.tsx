import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@saleor/fixtures";
import { ProductTypeConfigurable, ProductTypeEnum } from "@saleor/graphql";
import { ProductTypeListUrlSortField } from "@saleor/productTypes/urls";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { productTypes } from "../../fixtures";
import ProductTypeListPage, {
  ProductTypeListPageProps,
} from "./ProductTypeListPage";

const props: ProductTypeListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPageProps,
  filterOpts: {
    configurable: {
      active: false,
      value: ProductTypeConfigurable.CONFIGURABLE,
    },
    type: {
      active: false,
      value: ProductTypeEnum.SHIPPABLE,
    },
  },
  sort: {
    ...sortPageProps.sort,
    sort: ProductTypeListUrlSortField.name,
  },
  ...tabPageProps,
  productTypes,
};

storiesOf("Product types / Product types list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <ProductTypeListPage {...props} />)
  .add("loading", () => (
    <ProductTypeListPage {...props} disabled={true} productTypes={undefined} />
  ))
  .add("no data", () => <ProductTypeListPage {...props} productTypes={[]} />);
