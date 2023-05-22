import { installedAppsList } from "@dashboard/apps/fixtures";
import { Meta, StoryObj } from "@storybook/react";

import AppListPage, { AppListPageProps } from "./AppListPage";

const props: AppListPageProps = {
  disabled: false,
  installedApps: installedAppsList,
};

const meta: Meta<typeof AppListPage> = {
  title: "Apps / New Apps / App List",
  component: AppListPage,
};
export default meta;
type Story = StoryObj<typeof AppListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.9, pauseAnimationAtEnd: true },
  },
};

export const Empty: Story = {
  args: {
    ...props,
    installedApps: [],
    installableMarketplaceApps: [],
    comingSoonMarketplaceApps: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
