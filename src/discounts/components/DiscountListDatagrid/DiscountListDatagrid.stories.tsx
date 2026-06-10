import { discountList } from "@dashboard/discounts/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { DiscountListDatagrid } from "./DiscountListDatagrid";

const meta: Meta<typeof DiscountListDatagrid> = {
  title: "Discounts/DiscountListDatagrid",
  component: DiscountListDatagrid,

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
  parameters: {
    chromatic: STORYBOOK_CHROMATIC_PARAMS.datagrid,
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
