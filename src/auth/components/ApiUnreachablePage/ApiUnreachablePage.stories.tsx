import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { ApiUnreachablePage } from "./ApiUnreachablePage";

type Props = ComponentProps<typeof ApiUnreachablePage>;

const meta: Meta<typeof ApiUnreachablePage> = {
  title: "Auth / ApiUnreachablePage",
  component: ApiUnreachablePage,
  args: {
    apiHost: "api.example.com",
    retrying: false,
    onRetry: fn(),
    onSignIn: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ApiUnreachablePage>;

export const Default: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    await expect(args.onRetry).toHaveBeenCalled();
  },
};

export const Retrying: Story = {
  args: {
    retrying: true,
  },
};

export const WithoutApiAddress: Story = {
  args: {
    apiHost: null,
  },
};
