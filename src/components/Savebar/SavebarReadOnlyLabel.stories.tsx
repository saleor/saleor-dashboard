import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormattedMessage } from "react-intl";

import { ReadOnlyLabel } from "./SavebarReadOnlyLabel";

const meta: Meta<typeof ReadOnlyLabel> = {
  title: "Components/Savebar/ReadOnlyLabel",
  component: ReadOnlyLabel,
};

export default meta;
type Story = StoryObj<typeof ReadOnlyLabel>;

export const Default: Story = {};

export const WithCustomMessage: Story = {
  render: () => (
    <ReadOnlyLabel>
      <FormattedMessage defaultMessage="Read-only — editing requires Manage users" id="xRMVTn" />
    </ReadOnlyLabel>
  ),
};
