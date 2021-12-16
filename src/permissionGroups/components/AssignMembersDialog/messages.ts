import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    defaultMessage: "Assign Staff Members",
    description: "dialog header"
  },
  searchInputLabel: {
    defaultMessage: "Search Staff Members",
    description: "input label"
  },
  searchInputPlaceholder: {
    defaultMessage: "Search by name, email, etc...",
    description: "input placeholder"
  },
  staffActive: {
    defaultMessage: "Active",
    description: "staff member status"
  },
  staffInactive: {
    defaultMessage: "Inactive",
    description: "staff member status"
  },
  noMembersFound: {
    defaultMessage: "No members found",
    description: "description"
  }
});
