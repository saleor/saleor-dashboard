import { defineMessages } from "react-intl";

export const feedbackMessages = defineMessages({
  sendFeedback: {
    id: "41DrcD",
    defaultMessage: "Send feedback",
    description: "global Dashboard feedback button label",
  },
  question: {
    id: "PFCWLv",
    defaultMessage: "What could we improve?",
    description: "feedback form question when the survey has no question text",
  },
  contact: {
    id: "bpy0b2",
    defaultMessage: "Can we contact you about this by email?",
    description:
      "feedback form checkbox; when ticked, the staff member's email is sent with the feedback",
  },
  send: {
    id: "5FTSod",
    defaultMessage: "Send",
    description: "feedback form submit button",
  },
  sent: {
    id: "QQojCW",
    defaultMessage: "Thanks for your feedback",
    description: "notification after sending feedback",
  },
});
