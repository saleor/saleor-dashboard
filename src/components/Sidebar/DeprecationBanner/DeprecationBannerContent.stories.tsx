import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";

import { DeprecationBannerContent } from "./DeprecationBannerContent";

const meta: Meta<typeof DeprecationBannerContent> = {
  title: "Sidebar/DeprecationBannerContent",
  component: DeprecationBannerContent,
  decorators: [
    (Story: ComponentType) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DeprecationBannerContent>;

export const Default: Story = {
  args: {
    upgradeDate: new Date("2026-09-01"),
  },
};
