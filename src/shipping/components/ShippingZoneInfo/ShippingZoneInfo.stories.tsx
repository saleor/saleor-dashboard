import { ShippingErrorCode } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import ShippingZoneInfo from "./ShippingZoneInfo";

const meta: Meta<typeof ShippingZoneInfo> = {
  title: "Shipping/ShippingZoneInfo",
  component: ShippingZoneInfo,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    data: { name: "Europe", description: "Covers all EU member states." },
    disabled: false,
    errors: [],
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ShippingZoneInfo>;

const Interactive = ({ initial }: { initial: Record<"name" | "description", string> }) => {
  const [data, setData] = useState(initial);

  return (
    <ShippingZoneInfo
      data={data}
      disabled={false}
      errors={[]}
      onChange={event =>
        setData(current => ({ ...current, [event.target.name]: event.target.value }))
      }
    />
  );
};

export const Default: Story = {
  render: () => <Interactive initial={{ name: "Europe", description: "" }} />,
};

export const WithCharacterCounter: Story = {
  name: "Description with character counter",
  args: {
    data: {
      name: "Europe",
      description: "Covers all EU member states, including overseas territories.",
    },
  },
};

export const DescriptionOverLimit: Story = {
  args: {
    data: { name: "Europe", description: "x".repeat(301) },
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithError: Story = {
  args: {
    data: { name: "", description: "" },
    errors: [
      {
        __typename: "ShippingError",
        code: ShippingErrorCode.REQUIRED,
        field: "name",
        message: "Shipping zone name is required",
      },
    ],
  },
};
