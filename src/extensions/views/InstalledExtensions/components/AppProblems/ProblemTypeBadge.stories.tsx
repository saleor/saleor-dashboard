import { LocaleContext } from "@dashboard/components/Locale/Locale";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProblemTypeBadge } from "./ProblemTypeBadge";

const meta: Meta<typeof ProblemTypeBadge> = {
  title: "Extensions/AppProblems/ProblemTypeBadge",
  component: ProblemTypeBadge,
  decorators: [
    Story => (
      <LocaleContext.Provider value={{ locale: "en" as any, setLocale: () => {} }}>
        <Story />
      </LocaleContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProblemTypeBadge>;

export const AppType: Story = {
  args: { typename: "AppProblem" },
};

export const WebhookDeliveryType: Story = {
  args: { typename: "WebhookDeliveryError" },
};
