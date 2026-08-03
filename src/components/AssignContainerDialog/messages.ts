import { defineMessages } from "react-intl";

export const messages = defineMessages({
  assignCountedButton: {
    defaultMessage: "{label} ({count, plural, one {# item} other {# items}})",
    id: "vFljxe",
    description: "assign button label with number of selected items",
  },
  allLoadedItemsFilteredOut: {
    defaultMessage:
      "Everything loaded so far is already assigned. Search by name, or keep loading the list.",
    id: "VhAHLQ",
    description: "assign picker, client-side filter emptied the loaded pages",
  },
  loadMore: {
    defaultMessage: "Load more",
    id: "UQg+AQ",
    description: "button, assign picker loads the next pages",
  },
});
