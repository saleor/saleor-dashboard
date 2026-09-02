import { GiftCardErrorCode, TimePeriodTypeEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { withApolloMocks } from "@storybookUtils/apollo";
import { fn } from "storybook/test";

import { GiftCardBulkCreateDialogFields } from "./GiftCardBulkCreateDialogForm";
import { type GiftCardBulkCreateFormData } from "./types";

const data: GiftCardBulkCreateFormData = {
  tags: [],
  balanceAmount: 50,
  balanceCurrency: "USD",
  expirySelected: false,
  expiryType: "EXPIRY_PERIOD",
  expiryDate: "",
  expiryPeriodType: TimePeriodTypeEnum.MONTH,
  expiryPeriodAmount: 12,
  requiresActivation: true,
  cardsAmount: 100,
};

const meta: Meta<typeof GiftCardBulkCreateDialogFields> = {
  title: "GiftCards/GiftCardBulkCreateDialogFields",
  component: GiftCardBulkCreateDialogFields,
  decorators: [
    withApolloMocks([]),
    (Story: StoryFn) => (
      <Box __maxWidth="560px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    data,
    formErrors: {},
    change: fn(),
    set: fn(),
    toggleValue: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof GiftCardBulkCreateDialogFields>;

export const Default: Story = {};

export const WithExpiry: Story = {
  args: { data: { ...data, expirySelected: true } },
};

export const WithError: Story = {
  args: {
    data: { ...data, cardsAmount: 0 },
    formErrors: {
      count: { code: GiftCardErrorCode.INVALID, field: "count" },
    },
  },
};
