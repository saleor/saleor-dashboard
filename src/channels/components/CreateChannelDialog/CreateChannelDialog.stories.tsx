import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateChannelDialog } from "./CreateChannelDialog";

const meta: Meta<typeof CreateChannelDialog> = {
  title: "Channels / CreateChannelDialog",
  component: CreateChannelDialog,
};

export default meta;

type Story = StoryObj<typeof CreateChannelDialog>;

const countries = [
  { code: "US", country: "United States", vat: null, __typename: "CountryDisplay" as const },
  { code: "DE", country: "Germany", vat: null, __typename: "CountryDisplay" as const },
];

export const Default: Story = {
  args: {
    open: true,
    confirmButtonState: "default",
    countries,
    errors: [],
    onClose: () => undefined,
    onSubmit: async () => [],
  },
};
