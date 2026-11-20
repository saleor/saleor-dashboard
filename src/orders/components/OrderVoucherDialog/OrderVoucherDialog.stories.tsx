import { OrderErrorCode } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderVoucherDialog, type VoucherInputMode } from "./OrderVoucherDialog";

const pickerMode: VoucherInputMode = {
  kind: "picker",
  options: [
    { value: "SUMMER10", label: "SUMMER10" },
    { value: "SUMMER20", label: "SUMMER20" },
    { value: "WELCOME", label: "WELCOME", disabled: true },
  ],
  onSearch: fn(),
  fetchMore: { loading: false, hasMore: false, onFetchMore: fn() },
};

const meta: Meta<typeof OrderVoucherDialog> = {
  title: "Orders/OrderVoucherDialog",
  component: OrderVoucherDialog,
  args: {
    open: true,
    mode: pickerMode,
    currentCode: null,
    confirmButtonState: "default",
    errors: [],
    onClose: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderVoucherDialog>;

/** Staff with MANAGE_DISCOUNTS search active voucher codes in the draft's channel. */
export const Picker: Story = {};

export const PickerLoading: Story = {
  args: {
    mode: { ...pickerMode, options: [], fetchMore: { ...pickerMode.fetchMore, loading: true } },
  },
};

export const PickerEmpty: Story = {
  args: { mode: { ...pickerMode, options: [] } },
};

/** Staff without MANAGE_DISCOUNTS cannot list vouchers, so they type the code. */
export const Manual: Story = {
  args: { mode: { kind: "manual" } },
};

export const ChangeExisting: Story = {
  args: { mode: { kind: "manual" }, currentCode: "SUMMER10" },
};

export const WithError: Story = {
  args: {
    mode: { kind: "manual" },
    currentCode: "EXPIRED",
    errors: [
      {
        __typename: "OrderError",
        code: OrderErrorCode.INVALID_VOUCHER_CODE,
        field: "voucherCode",
        addressType: null,
        message: "Voucher code is invalid.",
        orderLines: null,
      },
    ],
  },
};
