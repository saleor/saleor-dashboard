import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateModelTypeDialog } from "./CreateModelTypeDialog";

const meta: Meta<typeof CreateModelTypeDialog> = {
  title: "Model types / CreateModelTypeDialog",
  component: CreateModelTypeDialog,
};

export default meta;

type Story = StoryObj<typeof CreateModelTypeDialog>;

export const Default: Story = {
  args: {
    open: true,
    confirmButtonState: "default",
    errors: [],
    onClose: () => undefined,
    onSubmit: async () => [],
  },
};
