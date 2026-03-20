import type { Meta, StoryObj } from "@storybook/react-vite";

import { Date as DateComponent } from "./Date";

const NOW = globalThis.Date.now();

const meta: Meta<typeof DateComponent> = {
  title: "Components/Date/Date",
  component: DateComponent,
};

export default meta;
type Story = StoryObj<typeof DateComponent>;

export const RelativeTime: Story = {
  args: {
    date: new globalThis.Date(NOW - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
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
    date: new globalThis.Date(NOW - 24 * 60 * 60 * 1000).toISOString(),
  },
};

export const MonthsAgo: Story = {
  args: {
    date: "2025-06-01T10:00:00Z",
  },
};
