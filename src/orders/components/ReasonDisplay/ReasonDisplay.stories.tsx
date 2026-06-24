import type { Meta, StoryObj } from "@storybook/react-vite";

import { ReasonDisplay } from "./ReasonDisplay";

const meta: Meta<typeof ReasonDisplay> = {
  title: "Orders/ReasonDisplay",
  component: ReasonDisplay,
  args: {
    reasonReference: "Sent twice",
    reason: "test root",
  },
};

export default meta;
type Story = StoryObj<typeof ReasonDisplay>;

export const ReferenceAndReason: Story = {};

export const ReferenceOnly: Story = {
  args: {
    reason: null,
  },
};

export const ReasonOnly: Story = {
  args: {
    reasonReference: null,
  },
};
