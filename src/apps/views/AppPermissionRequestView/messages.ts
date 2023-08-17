import { defineMessages } from "react-intl";

export const appPermissionsRequestViewMessages = defineMessages({
  headerAuthorize: {
    defaultMessage: "Authorize",
    description: "Authorize {app name}",
    id: "udJUSa",
  },
  by: {
    defaultMessage: "by",
    description: "App by Author",
    id: "jVjsVq",
  },
  requestsNewPermissions: {
    defaultMessage: "requests access to new permissions.",
    id: "ja+tNj",
  },
  currentPermissionsHeader: {
    defaultMessage: "Current Permissions",
    id: "VkYZQ8",
  },
  requestedPermissionsHeader: {
    defaultMessage: "Requested Permissions",
    id: "B+Ba0R",
  },
  approveScenarioHelperHeader: {
    defaultMessage: "What happens if I approve?",
    id: "w6kcxY",
  },
  approveScenarioHelperBody: {
    defaultMessage:
      "The app will have access to new permissions. From now on it will be able to use them to perform operations these permissions allow. You should ensure you trust the app before you approve.",
    id: "S1p0Ja",
  },
  permissionsDocsLink: {
    defaultMessage: "Learn more about permissions",
    id: "Yo4h/D",
  },
  denyScenarioHelperHeader: {
    defaultMessage: "What happens if I deny?",
    id: "cOki0G",
  },
  denyScenarioHelperBody: {
    defaultMessage:
      "Nothing will change in terms of permissions. The Dashboard will redirect to the app and inform it that you denied the request.",
    id: "SI3/nl",
  },
  denyButton: {
    defaultMessage: "Deny",
    id: "htvX+Z",
  },
  approveButton: {
    defaultMessage: "Approve",
    id: "WCaf5C",
  },
});
