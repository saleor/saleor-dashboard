import { MenuListUrlSortField } from "@saleor/navigation/urls";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "../../../fixtures";
import MenuListPage, {
  MenuListPageProps,
} from "../../../navigation/components/MenuListPage";
import { menuList } from "../../../navigation/fixtures";
import Decorator from "../../Decorator";

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

storiesOf("Views / Navigation / Menu list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <MenuListPage {...props} />)
  .add("loading", () => (
    <MenuListPage {...props} disabled={true} menus={undefined} />
  ))
  .add("no data", () => <MenuListPage {...props} menus={[]} />);
