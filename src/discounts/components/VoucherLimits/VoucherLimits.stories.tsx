import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { DiscountErrorCode, VoucherTypeEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { type VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import { VoucherLimits } from "./VoucherLimits";

const baseFormData: VoucherDetailsPageFormData = {
  applyOncePerCustomer: true,
  applyOncePerOrder: false,
  onlyForStaff: true,
  channelListings: [],
  name: "Demo voucher",
  discountType: DiscountTypeEnum.VALUE_PERCENTAGE,
  percentageDiscountValue: "25",
  endDate: "",
  endTime: "",
  hasEndDate: false,
  hasUsageLimit: true,
  minCheckoutItemsQuantity: "0",
  requirementsPicker: RequirementsPicker.NONE,
  startDate: "2026-03-18",
  startTime: "09:31",
  type: VoucherTypeEnum.ENTIRE_ORDER,
  codes: [],
  usageLimit: 100,
  used: 0,
  singleUse: true,
  metadata: [],
  privateMetadata: [],
};

const meta: Meta<typeof VoucherLimits> = {
  title: "Discounts/VoucherLimits",
  component: VoucherLimits,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    disabled: false,
    errors: [],
    initialUsageLimit: 100,
    isNewVoucher: false,
    onChange: fn(),
    setData: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof VoucherLimits>;

const InteractiveLimits = ({
  initialData,
}: {
  initialData: VoucherDetailsPageFormData;
}): JSX.Element => {
  const [data, setData] = useState(initialData);

  return (
    <VoucherLimits
      data={data}
      disabled={false}
      errors={[]}
      initialUsageLimit={initialData.usageLimit}
      isNewVoucher={false}
      onChange={event => {
        const { name, value } = event.target;

        setData(current => ({
          ...current,
          [name]: value,
        }));
      }}
      setData={patch => setData(current => ({ ...current, ...patch }))}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveLimits initialData={baseFormData} />,
};

export const UsageLocked: Story = {
  name: "Usage locked (used > 0)",
  render: () => (
    <InteractiveLimits
      initialData={{
        ...baseFormData,
        used: 12,
        hasUsageLimit: true,
        usageLimit: 100,
        singleUse: true,
      }}
    />
  ),
};

export const LockedAfterSaveError: Story = {
  name: "Notice after VOUCHER_ALREADY_USED (still editable)",
  args: {
    data: baseFormData,
    errors: [
      {
        __typename: "DiscountError",
        field: "singleUse",
        message: "Cannot change single use setting when any voucher code has already been used.",
        code: DiscountErrorCode.VOUCHER_ALREADY_USED,
        channels: null,
      },
    ],
  },
};
