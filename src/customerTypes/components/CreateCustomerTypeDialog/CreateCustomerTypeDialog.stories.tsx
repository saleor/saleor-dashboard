import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateCustomerTypeDialog } from "./CreateCustomerTypeDialog";

const meta: Meta<typeof CreateCustomerTypeDialog> = {
  title: "Customer types / CreateCustomerTypeDialog",
  component: CreateCustomerTypeDialog,
};

export default meta;

type Story = StoryObj<typeof CreateCustomerTypeDialog>;

export const Default: Story = {
  args: {
    open: true,
    confirmButtonState: "default",
    errors: [],
    onClose: () => undefined,
    onSubmit: async () => [],
  },
};
