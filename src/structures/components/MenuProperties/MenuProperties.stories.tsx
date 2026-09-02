import { MenuErrorCode } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { type MenuDetailsFormData } from "../MenuDetailsPage/MenuDetailsPage";
import MenuProperties from "./MenuProperties";

const baseData: MenuDetailsFormData = { name: "Main navigation" };

const meta: Meta<typeof MenuProperties> = {
  title: "Structures/MenuProperties",
  component: MenuProperties,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
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

type Story = StoryObj<typeof MenuProperties>;

const Interactive = () => {
  const [data, setData] = useState(baseData);

  return (
    <MenuProperties
      data={data}
      disabled={false}
      errors={[]}
      onChange={event => setData({ name: event.target.value })}
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
        __typename: "MenuError",
        code: MenuErrorCode.REQUIRED,
        field: "name",
        message: "Structure title is required",
      },
    ],
  },
};
