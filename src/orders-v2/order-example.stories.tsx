import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const ExampleComponent = () => {
  return <Box>Order Example Component</Box>;
};

const meta = {
  title: "OrderExample",
  component: ExampleComponent,
} satisfies Meta<typeof ExampleComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
