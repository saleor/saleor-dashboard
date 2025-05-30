import { defineMessages } from "react-intl";

export const appPermissionsRequestViewMessages = defineMessages({
  headerAuthorize: {
    defaultMessage: "Authorize",
    description: "Authorize {app name}",
    id: "udJUSa",
  },
  by: {
    defaultMessage: "by",
    description: "Extension by Author",
    id: "3R7BmI",
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
      "The extension will have access to new permissions. From now on it will be able to use them to perform operations these permissions allow. You should ensure you trust the extension before you approve.",
    id: "WMNtD2",
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
      "Nothing will change in terms of permissions. The Dashboard will redirect to the extension and inform it that you denied the request.",
    id: "E+n6Pt",
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
