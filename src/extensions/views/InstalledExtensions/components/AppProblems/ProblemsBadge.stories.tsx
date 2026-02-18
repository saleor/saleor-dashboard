import { LocaleContext } from "@dashboard/components/Locale/Locale";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProblemsBadge } from "./ProblemsBadge";

const meta: Meta<typeof ProblemsBadge> = {
  title: "Extensions/AppProblems/ProblemsBadge",
  component: ProblemsBadge,
  decorators: [
    Story => (
      <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
        <Story />
      </LocaleContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProblemsBadge>;

export const WarningsOnly: Story = {
  args: {
    totalCount: 3,
    criticalCount: 0,
    expanded: false,
    onToggle: () => {},
  },
};

export const WithCritical: Story = {
  args: {
    totalCount: 5,
    criticalCount: 2,
    expanded: false,
    onToggle: () => {},
  },
};

export const Expanded: Story = {
  args: {
    totalCount: 3,
    criticalCount: 1,
    expanded: true,
    onToggle: () => {},
  },
};
