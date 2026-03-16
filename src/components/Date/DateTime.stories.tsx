import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";

import { TimezoneProvider } from "../Timezone";
import { DateTime } from "./DateTime";

const NOW = new Date("2026-03-16T12:00:00Z");

const meta: Meta<typeof DateTime> = {
  title: "Components/Date/DateTime",
  component: DateTime,
  decorators: [
    (Story: ComponentType) => (
      <TimezoneProvider value="UTC">
        <Story />
      </TimezoneProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DateTime>;

export const RelativeTime: Story = {
  args: {
    date: new Date(NOW.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
};

export const Plain: Story = {
  args: {
    date: "2026-01-15T14:30:00Z",
    plain: true,
  },
};

export const Yesterday: Story = {
  args: {
    date: new Date(NOW.getTime() - 24 * 60 * 60 * 1000).toISOString(),
  },
};

export const MonthsAgo: Story = {
  args: {
    date: "2025-11-10T10:00:00Z",
  },
};
