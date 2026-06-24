import { defineMessages } from "react-intl";

export const channelAvailabilityMessages = defineMessages({
  availabilityTitle: {
    id: "XQfBeC",
    defaultMessage: "Availability",
    description: "Availability card title",
  },
  availabilitySubtitle: {
    id: "h0mEWF",
    defaultMessage: "In {listed} of {total} channels",
    description: "Availability card subtitle showing channel count",
  },
  manageButton: {
    id: "E3SyRJ",
    defaultMessage: "Manage",
    description: "Button to manage channel availability",
  },
  noChannelsListed: {
    id: "PQlz1k",
    defaultMessage: "Not listed in any channel",
    description: "Message when entity is not in any channel",
  },
  searchChannelsPlaceholder: {
    id: "Nsbu46",
    defaultMessage: "Search channels...",
    description: "Placeholder for channel search input",
  },
  noChannelsMatchSearch: {
    id: "OrEUr6",
    defaultMessage: "No channels match your search",
    description: "Message when search returns no results",
  },
  paginationShowing: {
    id: "iPg/Z+",
    defaultMessage: "Showing {start}-{end} of {total}",
    description: "Pagination info showing current range",
  },
  errorBadge: {
    id: "jBl05c",
    defaultMessage: "Error",
    description: "Badge shown when channel has validation errors",
  },
  draftBadge: {
    id: "/0Z5l/",
    defaultMessage: "Draft",
    description: "Badge shown when channel is newly added and not yet configured",
  },
});
