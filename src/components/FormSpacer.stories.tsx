import { Box, Input } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import FormSpacer from "./FormSpacer";

const meta: Meta<typeof FormSpacer> = {
  title: "Components/FormSpacer",
  component: FormSpacer,
  render: (args: ComponentProps<typeof FormSpacer>) => (
    <Box padding={4} __width="320px">
      <Input label="First field" />
      <FormSpacer {...args} />
      <Input label="Second field" />
    </Box>
  ),
};

export default meta;
type Story = StoryObj<typeof FormSpacer>;

export const Default: Story = {};
