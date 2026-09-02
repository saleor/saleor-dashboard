import { PermissionGroupErrorCode } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import PermissionGroupInfo from "./PermissionGroupInfo";

const meta: Meta<typeof PermissionGroupInfo> = {
  title: "PermissionGroups/PermissionGroupInfo",
  component: PermissionGroupInfo,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    data: { name: "Customer support" },
    disabled: false,
    errors: [],
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof PermissionGroupInfo>;

const Interactive = () => {
  const [name, setName] = useState("Customer support");

  return (
    <PermissionGroupInfo
      data={{ name }}
      disabled={false}
      errors={[]}
      onChange={event => setName(event.target.value)}
    />
  );
};

export const Default: Story = { render: () => <Interactive /> };

export const Empty: Story = { args: { data: { name: "" } } };

export const Disabled: Story = { args: { disabled: true } };

export const WithError: Story = {
  args: {
    data: { name: "" },
    errors: [
      {
        __typename: "PermissionGroupError",
        code: PermissionGroupErrorCode.REQUIRED,
        field: "name",
        message: "Group name is required",
      },
    ],
  },
};
