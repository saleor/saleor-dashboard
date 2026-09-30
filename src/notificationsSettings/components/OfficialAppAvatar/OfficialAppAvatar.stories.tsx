import {
  CUSTOMER_EMAILS_APP_IDENTIFIER,
  SMTP_APP_IDENTIFIER,
} from "@dashboard/notificationsSettings/constants";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OfficialAppAvatar } from "./OfficialAppAvatar";

const meta: Meta<typeof OfficialAppAvatar> = {
  title: "Settings/OfficialAppAvatar",
  component: OfficialAppAvatar,
};

export default meta;

type Story = StoryObj<typeof OfficialAppAvatar>;

export const CustomerEmails: Story = {
  args: {
    identifier: CUSTOMER_EMAILS_APP_IDENTIFIER,
  },
};

export const Smtp: Story = {
  args: {
    identifier: SMTP_APP_IDENTIFIER,
  },
};
