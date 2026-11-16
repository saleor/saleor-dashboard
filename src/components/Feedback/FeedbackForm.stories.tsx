import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { FeedbackForm } from "./FeedbackForm";

const meta: Meta<typeof FeedbackForm> = {
  title: "Feedback / FeedbackForm",
  component: FeedbackForm,
  args: {
    survey: undefined,
    context: { source: "sidebar" },
    onSent: fn(),
  },
  decorators: [
    (Story: StoryFn): JSX.Element => (
      <Box padding={4} __width="320px" backgroundColor="default1">
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FeedbackForm>;

export const Empty: Story = {};

export const ContactAllowed: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "Faster product lists");
    await userEvent.click(canvas.getByRole("checkbox"));
    await expect(canvas.getByRole("button", { name: "Send" })).toBeEnabled();
  },
};
