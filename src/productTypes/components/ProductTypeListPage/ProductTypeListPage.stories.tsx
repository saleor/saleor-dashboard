import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { ProductTypeConfigurable, ProductTypeEnum } from "@dashboard/graphql";
import { ProductTypeListUrlSortField } from "@dashboard/productTypes/urls";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
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

export default {
  title: "Product types / Product types list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <ProductTypeListPage {...props} />;

export const Loading = () => (
  <ProductTypeListPage {...props} disabled={true} productTypes={undefined} />
);

export const NoData = () => (
  <ProductTypeListPage {...props} productTypes={[]} />
);
