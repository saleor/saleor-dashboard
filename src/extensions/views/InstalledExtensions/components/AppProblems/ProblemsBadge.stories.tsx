import { LocaleContext } from "@dashboard/components/Locale/Locale";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { ProblemsBadge } from "./ProblemsBadge";

const withLocale: Decorator = (Story: React.FC) => (
  <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
    <Story />
  </LocaleContext.Provider>
);

const meta: Meta<typeof ProblemsBadge> = {
  title: "Extensions/AppProblems/ProblemsBadge",
  component: ProblemsBadge,
  decorators: [withLocale],
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
