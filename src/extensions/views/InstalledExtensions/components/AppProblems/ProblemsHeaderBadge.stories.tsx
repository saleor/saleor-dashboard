import { LocaleContext } from "@dashboard/components/Locale/Locale";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProblemsHeaderBadge } from "./ProblemsHeaderBadge";

const meta: Meta<typeof ProblemsHeaderBadge> = {
  title: "Extensions/AppProblems/ProblemsHeaderBadge",
  component: ProblemsHeaderBadge,
  decorators: [
    Story => (
      <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
        <Story />
      </LocaleContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProblemsHeaderBadge>;

export const Warning: Story = {
  args: {
    totalCount: 2,
    criticalCount: 0,
  },
};

export const Critical: Story = {
  args: {
    totalCount: 4,
    criticalCount: 2,
  },
};
