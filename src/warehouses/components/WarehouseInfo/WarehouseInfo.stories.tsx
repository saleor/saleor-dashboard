import { WarehouseErrorCode } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import WarehouseInfo from "./WarehouseInfo";

const meta: Meta<typeof WarehouseInfo> = {
  title: "Warehouses/WarehouseInfo",
  component: WarehouseInfo,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    data: { name: "Europe warehouse", email: "eu@example.com" },
    disabled: false,
    errors: [],
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseInfo>;

const Interactive = ({ initial }: { initial: { name: string; email: string } }) => {
  const [data, setData] = useState(initial);

  return (
    <WarehouseInfo
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
  render: () => <Interactive initial={{ name: "Europe warehouse", email: "eu@example.com" }} />,
};

export const Empty: Story = {
  args: { data: { name: "", email: "" } },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithErrors: Story = {
  args: {
    data: { name: "", email: "not-an-email" },
    errors: [
      {
        __typename: "WarehouseError",
        code: WarehouseErrorCode.REQUIRED,
        field: "name",
        message: "Warehouse name is required",
      },
      {
        __typename: "WarehouseError",
        code: WarehouseErrorCode.INVALID,
        field: "email",
        message: "Invalid email format",
      },
    ],
  },
};
