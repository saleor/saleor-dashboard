import { defineMessages } from "react-intl";

export default defineMessages({
  reloadAppTitle: {
    id: "Ao/xqN",
    defaultMessage: "Reload Extension",
    description: "dialog header",
  },
  reloadAppDescription: {
    id: "gH3lNV",
    defaultMessage:
      "Review the changes between the current state of {name} and its manifest before applying them.",
    description: "reload extension description",
  },
  upToDate: {
    id: "aGWXHy",
    defaultMessage: "This extension is up to date with its manifest. There is nothing to apply.",
    description: "reload extension up to date",
  },
  fetchError: {
    id: "P27U3T",
    defaultMessage: "Could not load the manifest changes.",
    description: "reload extension fetch error",
  },
  reloadWarning: {
    id: "gBCpJ0",
    defaultMessage:
      "Applying these changes can grant the extension new permissions and delete webhooks that are not defined in the manifest.",
    description: "reload extension warning",
  },
});
