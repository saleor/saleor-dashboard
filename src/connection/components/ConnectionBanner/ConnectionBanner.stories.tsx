import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { ConnectionBanner } from "./ConnectionBanner";

type Props = ComponentProps<typeof ConnectionBanner>;

const meta: Meta<typeof ConnectionBanner> = {
  title: "Connection / ConnectionBanner",
  component: ConnectionBanner,
  args: {
    status: "unreachable",
    checkingNow: false,
    onTryNow: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ConnectionBanner>;

export const CantReachSaleor: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Try now" }));
    await expect(args.onTryNow).toHaveBeenCalled();
  },
};

export const Checking: Story = {
  args: {
    checkingNow: true,
  },
};

export const Offline: Story = {
  args: {
    status: "offline",
  },
};

export const ConnectedAgain: Story = {
  args: {
    status: "restored",
  },
};

export const Narrow: Story = {
  decorators: [
    (Story: StoryFn) => (
      <div style={{ maxWidth: 390 }}>
        <Story />
      </div>
    ),
  ],
};
