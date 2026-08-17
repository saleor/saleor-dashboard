import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateCollectionDialog } from "./CreateCollectionDialog";

const meta: Meta<typeof CreateCollectionDialog> = {
  title: "Collections / CreateCollectionDialog",
  component: CreateCollectionDialog,
};

export default meta;

type Story = StoryObj<typeof CreateCollectionDialog>;

export const Default: Story = {
  args: {
    open: true,
    confirmButtonState: "default",
    errors: [],
    onClose: () => undefined,
    onSubmit: async () => [],
  },
};
