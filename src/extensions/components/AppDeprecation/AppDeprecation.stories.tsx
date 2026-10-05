import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { AppDeprecationNotice, AppDeprecationReason } from "./AppDeprecation";

const shortReason = "Use Customer Emails instead.";
const longReason =
  "SMTP is replaced by Customer Emails, which supports templates per channel and delivery tracking.\nInstall Customer Emails from Extensions, copy your templates over, then uninstall this app.";

const narrow = (Story: StoryFn) => (
  <div style={{ maxWidth: 720 }}>
    <Story />
  </div>
);

const meta: Meta<typeof AppDeprecationNotice> = {
  title: "Extensions/AppDeprecation",
  component: AppDeprecationNotice,
  args: { reason: longReason },
  decorators: [narrow],
};

export default meta;

type Story = StoryObj<typeof AppDeprecationNotice>;

export const Full: Story = {};

export const ReasonClamped: StoryObj<typeof AppDeprecationReason> = {
  render: () => <AppDeprecationReason reason={longReason} lines={1} />,
};

export const ReasonFits: StoryObj<typeof AppDeprecationReason> = {
  render: () => <AppDeprecationReason reason={shortReason} lines={2} />,
};
