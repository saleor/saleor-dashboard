import { voucherList } from "@dashboard/discounts/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { VoucherListDatagrid } from "./VoucherListDatagrid";

const meta: Meta<typeof VoucherListDatagrid> = {
  title: "Discounts/VoucherListDatagrid",
  component: VoucherListDatagrid,
  args: {
    vouchers: voucherList,
    disabled: false,
    selectedChannelId: "channel-1",
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: {
      columns: ["code", "min-spent", "start-date", "end-date", "value", "limit"],
      rowsPerPage: 20,
    },
    onUpdateListSettings: fn(),
    onSelectVouchersIds: fn(),
    filterDependency: { label: "Channel", value: "channel-1" },
  },
};

export default meta;
type Story = StoryObj<typeof VoucherListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { vouchers: [] },
};

export const WithoutChannel: Story = {
  args: { selectedChannelId: "" },
};
