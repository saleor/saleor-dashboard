import { categories } from "@saleor/categories/fixtures";
import { CategoryListUrlSortField } from "@saleor/categories/urls";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import CategoryListPage, { CategoryTableProps } from "./CategoryListPage";

const categoryTableProps: CategoryTableProps = {
  categories,
  onAdd: undefined,
  ...listActionsProps,
  ...tabPageProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  sort: {
    ...sortPageProps.sort,
    sort: CategoryListUrlSortField.name,
  },
};

storiesOf("Categories / Category list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <CategoryListPage {...categoryTableProps} />)
  .add("loading", () => (
    <CategoryListPage {...categoryTableProps} categories={undefined} />
  ))
  .add("empty", () => (
    <CategoryListPage {...categoryTableProps} categories={[]} />
  ));
