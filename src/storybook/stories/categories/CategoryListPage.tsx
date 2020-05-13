import CategoryListPage, {
  CategoryTableProps
} from "@saleor/categories/components/CategoryListPage";
import { categories } from "@saleor/categories/fixtures";
import { CategoryListUrlSortField } from "@saleor/categories/urls";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "@saleor/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";

const categoryTableProps: CategoryTableProps = {
  categories,
  onAdd: undefined,
  onRowClick: () => undefined,
  ...listActionsProps,
  ...tabPageProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  sort: {
    ...sortPageProps.sort,
    sort: CategoryListUrlSortField.name
  }
};

storiesOf("Views / Categories / Category list", module)
  .addDecorator(Decorator)
  .add("default", () => <CategoryListPage {...categoryTableProps} />)
  .add("loading", () => (
    <CategoryListPage {...categoryTableProps} categories={undefined} />
  ))
  .add("empty", () => (
    <CategoryListPage {...categoryTableProps} categories={[]} />
  ));
