import { ShippingErrorCode } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import OrderWeight from "./OrderWeight";

const meta: Meta<typeof OrderWeight> = {
  title: "Shipping/OrderWeight",
  component: OrderWeight,
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
    minValue: "0",
    maxValue: "10",
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof OrderWeight>;

const Interactive = () => {
  const [values, setValues] = useState({ minValue: "0", maxValue: "10" });

  return (
    <OrderWeight
      disabled={false}
      errors={[]}
      minValue={values.minValue}
      maxValue={values.maxValue}
      onChange={event =>
        setValues(current => ({ ...current, [event.target.name]: event.target.value }))
      }
    />
  );
};

export const Default: Story = { render: () => <Interactive /> };

export const Empty: Story = {
  name: "Empty (applies to any weight)",
  args: { minValue: "", maxValue: "" },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithErrors: Story = {
  args: {
    minValue: "10",
    maxValue: "1",
    errors: [
      {
        __typename: "ShippingError",
        code: ShippingErrorCode.INVALID,
        field: "maximumOrderWeight",
        message: "Maximum weight must be greater than minimum weight",
      },
    ],
  },
};
