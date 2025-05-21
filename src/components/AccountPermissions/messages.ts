import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "Fbr4Vp",
    defaultMessage: "Permissions",
    description: "dialog header",
  },
  exceededPermission: {
    id: "MVU6ol",
    defaultMessage:
      "This groups permissions exceeds your own. You are able only to manage permissions that you have.",
    description: "exceeded permissions description",
  },
  availablePermissions: {
    id: "6cS4Rd",
    defaultMessage: "Available permissions",
    description: "card section description",
  },
  permissionListItemDescription: {
    id: "VmMDLN",
    defaultMessage: "This group is last source of that permission",
    description: "permission list item description",
  },
});
