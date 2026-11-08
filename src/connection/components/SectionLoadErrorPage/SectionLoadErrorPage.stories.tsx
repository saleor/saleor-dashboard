import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { SectionLoadErrorPage } from "./SectionLoadErrorPage";

type Props = ComponentProps<typeof SectionLoadErrorPage>;

const meta: Meta<typeof SectionLoadErrorPage> = {
  title: "Connection / SectionLoadErrorPage",
  component: SectionLoadErrorPage,
  args: {
    connectionLost: true,
    onReload: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SectionLoadErrorPage>;

export const WaitingForConnection: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("It will open once the connection is back.")).toBeVisible();
    await expect(canvas.queryByRole("button")).toBeNull();
  },
};

export const ReloadNeeded: Story = {
  args: {
    connectionLost: false,
  },
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Reload page" }));
    await expect(args.onReload).toHaveBeenCalled();
  },
};
