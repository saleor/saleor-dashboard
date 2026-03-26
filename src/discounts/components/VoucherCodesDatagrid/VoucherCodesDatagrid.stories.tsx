import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { type VoucherCode } from "./types";
import { VoucherCodesDatagrid } from "./VoucherCodesDatagrid";

const mockCodes: VoucherCode[] = [
  { code: "SUMMER2024", used: 15, status: "Active", isActive: true },
  { code: "WINTER2024", used: 3, status: "Active", isActive: true },
  { code: "EXPIRED01", used: 100, status: "Expired", isActive: false },
  { code: "NEWCODE01", used: 0, status: "Active", isActive: true },
];

const meta: Meta<typeof VoucherCodesDatagrid> = {
  title: "Discounts/VoucherCodesDatagrid",
  component: VoucherCodesDatagrid,

  args: {
    codes: mockCodes,
    loading: false,
    disabled: false,
    settings: { columns: ["code", "usage", "status"], rowsPerPage: 20 },
    onSettingsChange: fn(),
    onSelectVoucherCodesIds: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof VoucherCodesDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Empty: Story = {
  args: { codes: [] },
};

export const Disabled: Story = {
  args: { disabled: true },
};
