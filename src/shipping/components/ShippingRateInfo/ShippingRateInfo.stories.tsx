import { ShippingErrorCode } from "@dashboard/graphql";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ReactNode } from "react";
import { fn } from "storybook/test";

import ShippingRateInfo from "./ShippingRateInfo";

const baseData = {
  description: null,
  name: "Standard delivery",
  minDays: "2",
  maxDays: "5",
};

// ShippingRateInfo renders a RichTextEditor that reads from RichTextContext.
const WithRichText = ({ children }: { children: ReactNode }) => {
  const richText = useRichText({ initial: null, loading: false, triggerChange: fn() });

  return <RichTextContext.Provider value={richText}>{children}</RichTextContext.Provider>;
};

const meta: Meta<typeof ShippingRateInfo> = {
  title: "Shipping/ShippingRateInfo",
  component: ShippingRateInfo,
  decorators: [
    (Story: StoryFn) => (
      <WithRichText>
        <Box __maxWidth="720px" padding={4}>
          <Story />
        </Box>
      </WithRichText>
    ),
  ],
  args: {
    data: baseData,
    disabled: false,
    errors: [],
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ShippingRateInfo>;

export const Default: Story = {};

export const Empty: Story = {
  args: { data: { ...baseData, name: "", minDays: "", maxDays: "" } },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithErrors: Story = {
  args: {
    data: { ...baseData, name: "", minDays: "9", maxDays: "1" },
    errors: [
      {
        __typename: "ShippingError",
        code: ShippingErrorCode.REQUIRED,
        field: "name",
        message: "Shipping rate name is required",
      },
      {
        __typename: "ShippingError",
        code: ShippingErrorCode.INVALID,
        field: "maxDays",
        message: "Max delivery time must be greater than min delivery time",
      },
    ],
  },
};
