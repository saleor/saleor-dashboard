import { MockedProvider } from "@apollo/client/testing";
import { OrderErrorCode } from "@dashboard/graphql";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import {
  shippingVoucher,
  summerVoucher,
  voucherCode,
  voucherCodesMock,
  welcomeVoucher,
} from "./fixtures";
import { OrderVoucherDialog, type VoucherInputMode } from "./OrderVoucherDialog";

const pickerMode: VoucherInputMode = {
  kind: "picker",
  vouchers: [summerVoucher, welcomeVoucher, shippingVoucher],
  onSearch: fn(),
  fetchMore: { loading: false, hasMore: false, onFetchMore: fn() },
};

// Picking a voucher loads its codes: Summer sale has several, the single-use welcome gift
// is used up, and Free delivery has one code.
const codeMocks = [
  voucherCodesMock({
    voucherId: summerVoucher.id,
    codes: [
      voucherCode("SUMMER-OLD", { isActive: false }),
      voucherCode("SUMMER10"),
      voucherCode("SUMMER20"),
    ],
  }),
  voucherCodesMock({
    voucherId: welcomeVoucher.id,
    codes: [voucherCode("6f1c7a0e-6b1d-4f53-9a4e-0c1f3f0d2b11", { used: 1 })],
  }),
  voucherCodesMock({ voucherId: shippingVoucher.id, codes: [voucherCode("SHIPFREE")] }),
];

const meta: Meta<typeof OrderVoucherDialog> = {
  title: "Orders/OrderVoucherDialog",
  component: OrderVoucherDialog,
  decorators: [
    (Story: StoryFn): ReactElement => (
      <MockedProvider mocks={codeMocks}>
        <Story />
      </MockedProvider>
    ),
  ],
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

/** Staff with MANAGE_DISCOUNTS pick an active voucher in the draft's channel. */
export const Picker: Story = {};

export const PickerLoading: Story = {
  args: {
    mode: { ...pickerMode, vouchers: [], fetchMore: { ...pickerMode.fetchMore, loading: true } },
  },
};

export const PickerEmpty: Story = {
  args: { mode: { ...pickerMode, vouchers: [] } },
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
