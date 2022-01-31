import { defineMessages } from "react-intl";

const messages = defineMessages({
  header: {
    defaultMessage: "We’ve encountered an unexpected error"
  },
  content: {
    defaultMessage:
      "Don’t worry we will fix it soon. Try to refresh the page or go back to dashboard."
  },
  btnDashboard: {
    defaultMessage: "Dashboard",
    description: "button linking to dashboard"
  },
  btnRefresh: {
    defaultMessage: "Refresh page",
    description: "button refreshing page"
  },
  or: {
    defaultMessage: "or",
    description:
      "conjunction, choice between going to dashboard or refreshing page"
  }
});

export default messages;
