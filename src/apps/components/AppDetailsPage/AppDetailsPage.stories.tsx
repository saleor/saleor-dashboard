import { Meta, StoryObj } from "@storybook/react";

import { appDetails } from "../../fixtures";
import { AppDetailsPage, AppDetailsPageProps } from "./AppDetailsPage";

const props: AppDetailsPageProps = {
  data: appDetails,
  loading: false,
  onAppActivateOpen: () => undefined,
  onAppDeactivateOpen: () => undefined,
  onAppDeleteOpen: () => undefined,
};

const meta: Meta<typeof AppDetailsPage> = {
  title: "Apps / App details",
  component: AppDetailsPage,
};
export default meta;
type Story = StoryObj<typeof AppDetailsPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Loading: Story = {
  args: {
    ...props,
    loading: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
