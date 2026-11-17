import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FeedbackSurveyDialogView } from "./FeedbackSurveyDialog";

const meta: Meta<typeof FeedbackSurveyDialogView> = {
  title: "Sidebar/FeedbackSurveyDialog",
  component: FeedbackSurveyDialogView,
  args: {
    open: true,
    question: "What could we improve in Saleor Dashboard?",
    description: "Tell us about something confusing, difficult, or missing.",
    response: "",
    onResponseChange: fn(),
    onSend: fn(),
    onDismiss: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FeedbackSurveyDialogView>;

export const Empty: Story = {};

export const WithResponse: Story = {
  args: { response: "Searching for orders by customer email is slow." },
};

export const WithoutDescription: Story = {
  args: { description: undefined },
};
