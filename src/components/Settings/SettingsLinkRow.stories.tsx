import { DeprecatedExtensionBadge } from "@dashboard/extensions/views/InstalledExtensions/components/DeprecatedExtensionBadge/DeprecatedExtensionBadge";
import { OfficialAppAvatar } from "@dashboard/notificationsSettings/components/OfficialAppAvatar/OfficialAppAvatar";
import {
  CUSTOMER_EMAILS_APP_IDENTIFIER,
  SMTP_APP_IDENTIFIER,
} from "@dashboard/notificationsSettings/constants";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { SettingsLinkRow } from "./SettingsLinkRow";
import { SettingsSection } from "./SettingsSection";

const meta: Meta<typeof SettingsLinkRow> = {
  title: "Settings/SettingsLinkRow",
  component: SettingsLinkRow,
  decorators: [
    (Story: StoryFn): ReactNode => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SettingsLinkRow>;

export const Default: Story = {
  args: {
    title: "Customer Emails",
    description: "Emails in the shopper's language, with your branding and SMTP.",
    to: "/extensions/app/saleor.app.customer-emails",
    icon: <OfficialAppAvatar identifier={CUSTOMER_EMAILS_APP_IDENTIFIER} />,
  },
};

export const Deprecated: Story = {
  args: {
    title: "SMTP",
    description: "Installed on this shop. Switch to the new Customer Emails app.",
    to: "/extensions/app/smtp",
    icon: <OfficialAppAvatar identifier={SMTP_APP_IDENTIFIER} />,
    badge: <DeprecatedExtensionBadge />,
  },
};

export const CustomerEmailsWithDeprecatedSmtp: Story = {
  render: (): ReactNode => (
    <SettingsSection
      title="Customer emails"
      description="Order, account, and fulfillment emails for shoppers are managed in the Customer Emails app."
      ownership="channel"
    >
      <SettingsLinkRow
        title="Customer Emails"
        description="Emails in the shopper's language, with your branding and SMTP."
        to="/extensions/app/saleor.app.customer-emails"
        icon={<OfficialAppAvatar identifier={CUSTOMER_EMAILS_APP_IDENTIFIER} />}
      />
      <SettingsLinkRow
        title="SMTP"
        description="Installed on this shop. Switch to the new Customer Emails app."
        to="/extensions/app/smtp"
        icon={<OfficialAppAvatar identifier={SMTP_APP_IDENTIFIER} />}
        badge={<DeprecatedExtensionBadge />}
      />
    </SettingsSection>
  ),
};
