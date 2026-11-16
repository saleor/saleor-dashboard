import { Box, Button } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { MessageSquareText } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { FeedbackPopover } from "./FeedbackPopover";

const meta: Meta<typeof FeedbackPopover> = {
  title: "Sidebar / FeedbackPopover",
  component: FeedbackPopover,
  args: {
    survey: undefined,
    side: "top",
    children: <Button variant="tertiary" icon={<MessageSquareText />} aria-label="Send feedback" />,
  },
  decorators: [
    (Story: StoryFn): JSX.Element => (
      <Box padding={8} paddingTop={20} __height="420px" display="flex" alignItems="flex-end">
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FeedbackPopover>;

export const Closed: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Send feedback" }));
    await expect(within(document.body).getByRole("checkbox")).not.toBeChecked();
  },
};
