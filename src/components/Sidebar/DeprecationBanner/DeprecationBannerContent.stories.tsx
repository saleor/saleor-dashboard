import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, ComponentType } from "react";
import { within } from "storybook/test";

import { DeprecationBannerContent, DeprecationBannerIcon } from "./DeprecationBannerContent";

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

export const RailIcon: Story = {
  args: {
    upgradeDate: new Date("2026-09-01"),
  },
  render: (args: ComponentProps<typeof DeprecationBannerIcon>) => (
    <DeprecationBannerIcon {...args} />
  ),
  decorators: [
    (Story: ComponentType) => (
      <Box __width="60px" paddingTop={3} backgroundColor="default2">
        <Story />
      </Box>
    ),
  ],
  // Focus opens the tooltip at once, so the full message is visible without hovering.
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    within(canvasElement).getByTestId("deprecation-banner").focus();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The collapsed rail has no room for the sentence, so it shows a warning icon with the full message in its tooltip.",
      },
    },
  },
};
