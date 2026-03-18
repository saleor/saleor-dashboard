import { permissionGroups } from "@dashboard/permissionGroups/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { PermissionGroupListDatagrid } from "./PermissionGroupListDatagrid";

const meta: Meta<typeof PermissionGroupListDatagrid> = {
  title: "PermissionGroups/PermissionGroupListDatagrid",
  component: PermissionGroupListDatagrid,
  args: {
    permissionGroups,
    disabled: false,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["name", "members"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PermissionGroupListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { permissionGroups: [] },
};
