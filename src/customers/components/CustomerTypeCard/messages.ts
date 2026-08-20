import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "niIDyN",
    defaultMessage: "Customer type",
    description: "customer detail sidebar, customer type section header",
  },
  hint: {
    id: "se+RzK",
    defaultMessage: "This type decides which attributes appear on the customer.",
    description: "customer detail sidebar, helper under the customer type picker",
  },
  label: {
    id: "/PY0Pq",
    defaultMessage: "Type",
    description: "customer detail sidebar, customer type combobox label",
  },
  viewType: {
    id: "+0sSTK",
    defaultMessage: "View type",
    description: "customer detail sidebar, link to the selected customer type",
  },
  changeDialogTitle: {
    id: "wV0kNo",
    defaultMessage: "Change customer type",
    description: "confirm dialog title when changing a customer's type",
  },
  changeDialogDescription: {
    id: "9rvLbt",
    defaultMessage:
      "Only {typeName} attributes will show on this customer. Other values stay stored and will show again if you switch back.",
    description: "confirm dialog body when changing a customer's type",
  },
  changeDialogConfirm: {
    id: "sGdrxC",
    defaultMessage: "Change type",
    description: "confirm dialog submit when changing a customer's type",
  },
  pendingChangeTitle: {
    id: "sK8l2j",
    defaultMessage: "This type uses different attributes",
    description: "warning callout title after a pending customer type change",
  },
  pendingChangeDescription: {
    id: "FWwYDW",
    defaultMessage:
      "Values from the previous type stay stored. They'll show again if you switch back.",
    description: "warning callout body after a pending customer type change",
  },
  typeChanged: {
    id: "XUKj/N",
    defaultMessage: "Customer type changed",
    description: "success toast title after saving a customer type change",
  },
  typeChangedDescription: {
    id: "Kk84F1",
    defaultMessage: "Only this type's attributes are shown. Other values stay stored.",
    description: "success toast description after saving a customer type change",
  },
});
