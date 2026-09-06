import { listActionsProps, pageListProps, sortPageProps } from "@dashboard/fixtures";
import { menuList } from "@dashboard/structures/fixtures";
import { MenuListUrlSortField } from "@dashboard/structures/urls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MenuList from "./MenuList";

const meta: Meta<typeof MenuList> = {
  title: "Structures/MenuList",
  component: MenuList,
  args: {
    ...listActionsProps,
    ...pageListProps.default,
    ...sortPageProps,
    sort: { ...sortPageProps.sort, sort: MenuListUrlSortField.name },
    menus: menuList,
    onDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MenuList>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { selected: 2, isChecked: () => true },
};

export const Loading: Story = {
  args: { ...pageListProps.loading, menus: undefined },
};

export const Empty: Story = {
  args: { menus: [] },
};
