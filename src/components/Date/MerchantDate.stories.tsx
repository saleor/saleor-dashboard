import { TimezoneProvider } from "@dashboard/components/Timezone";
import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";

import { MerchantDate } from "./MerchantDate";

// Pin a "now" so each bucket renders deterministically in the docs.
const now = new Date("2026-05-25T15:00:00Z");

const meta: Meta<typeof MerchantDate> = {
  title: "Components/Date/MerchantDate",
  component: MerchantDate,
  args: {
    kind: "placed",
    now,
  },
  decorators: [
    (Story: ComponentType): JSX.Element => (
      <TimezoneProvider value="UTC">
        <Box padding={4}>
          <Story />
        </Box>
      </TimezoneProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MerchantDate>;

export const JustNow: Story = {
  args: {
    date: new Date(now.getTime() - 30 * 1000).toISOString(),
  },
};

export const MinutesAgo: Story = {
  args: {
    date: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
  },
};

export const Today: Story = {
  args: {
    date: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
  },
};

export const Yesterday: Story = {
  args: {
    date: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
  },
};

export const ThisYear: Story = {
  args: {
    date: "2026-01-15T10:30:00Z",
  },
};

export const PreviousYear: Story = {
  args: {
    date: "2024-11-03T10:30:00Z",
  },
};

// Demonstrates that the tooltip carries the timezone label/offset for any
// configured zone — the original motivation for switching the formatter
// to Intl.DateTimeFormat with `timeStyle: "long"`.
export const InNewYorkTimezone: Story = {
  args: {
    date: "2026-05-25T10:00:00Z",
  },
  decorators: [
    (Story: ComponentType): JSX.Element => (
      <TimezoneProvider value="America/New_York">
        <Box padding={4} display="flex" flexDirection="column" gap={2}>
          <Text size={2} color="default2">
            Hover the date to see the tooltip; timezone label / offset is included automatically.
          </Text>
          <Story />
        </Box>
      </TimezoneProvider>
    ),
  ],
};
