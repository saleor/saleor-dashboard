import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChangeCustomerTypeDialog } from "./ChangeCustomerTypeDialog";

const meta: Meta<typeof ChangeCustomerTypeDialog> = {
  title: "Customers / ChangeCustomerTypeDialog",
  component: ChangeCustomerTypeDialog,
};

export default meta;

type Story = StoryObj<typeof ChangeCustomerTypeDialog>;

export const Default: Story = {
  args: {
    open: true,
    typeName: "Wholesale",
    onClose: () => undefined,
    onConfirm: () => undefined,
  },
};
