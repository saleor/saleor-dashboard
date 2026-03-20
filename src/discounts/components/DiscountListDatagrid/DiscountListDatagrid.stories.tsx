import { discountList } from "@dashboard/discounts/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { DiscountListDatagrid } from "./DiscountListDatagrid";

const meta: Meta<typeof DiscountListDatagrid> = {
  title: "Discounts/DiscountListDatagrid",
  component: DiscountListDatagrid,
  parameters: {
    chromatic: { diffThreshold: 0.3, delay: 500 },
  },
  args: {
    promotions: discountList,
    disabled: false,
    hasRowHover: true,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["name", "type", "startDate", "endDate"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onRowClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DiscountListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { promotions: [] },
};
