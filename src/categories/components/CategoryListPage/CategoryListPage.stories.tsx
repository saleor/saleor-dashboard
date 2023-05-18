import { categories } from "@dashboard/categories/fixtures";
import { CategoryListUrlSortField } from "@dashboard/categories/urls";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
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

export default {
  title: "Categories / Category list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <CategoryListPage {...categoryTableProps} />;

export const Loading = () => (
  <CategoryListPage {...categoryTableProps} categories={undefined} />
);

export const Empty = () => (
  <CategoryListPage {...categoryTableProps} categories={[]} />
);
