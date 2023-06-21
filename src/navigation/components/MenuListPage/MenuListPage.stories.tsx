// @ts-strict-ignore
import {
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { menuList } from "@dashboard/navigation/fixtures";
import { MenuListUrlSortField } from "@dashboard/navigation/urls";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import MenuListPage, { MenuListPageProps } from "./MenuListPage";

const props: MenuListPageProps = {
  ...pageListProps.default,
  ...listActionsProps,
  ...sortPageProps,
  menus: menuList,
  onDelete: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: MenuListUrlSortField.name,
  },
};

export default {
  title: "Navigation / Menu list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <MenuListPage {...props} />;

export const Loading = () => (
  <MenuListPage {...props} disabled={true} menus={undefined} />
);

export const NoData = () => <MenuListPage {...props} menus={[]} />;
