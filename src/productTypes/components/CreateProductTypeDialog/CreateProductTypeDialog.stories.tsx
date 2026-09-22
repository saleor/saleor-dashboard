import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateProductTypeDialog } from "./CreateProductTypeDialog";

const meta: Meta<typeof CreateProductTypeDialog> = {
  title: "Product types / CreateProductTypeDialog",
  component: CreateProductTypeDialog,
};

export default meta;

type Story = StoryObj<typeof CreateProductTypeDialog>;

export const Default: Story = {
  args: {
    open: true,
    confirmButtonState: "default",
    errors: [],
    onClose: () => undefined,
    onSubmit: async () => [],
  },
};
