import { staffMembers } from "@dashboard/staff/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { StaffListDatagrid } from "./StaffListDatagrid";

const meta: Meta<typeof StaffListDatagrid> = {
  title: "Staff/StaffListDatagrid",
  component: StaffListDatagrid,
  args: {
    staffMembers,
    disabled: false,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["name", "status", "email"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof StaffListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { staffMembers: [] },
};
