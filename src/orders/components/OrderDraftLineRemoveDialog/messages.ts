import { defineMessages } from "react-intl";

export const orderDraftLineRemoveDialogMessages = defineMessages({
  title: {
    id: "fdJjic",
    defaultMessage: "Remove product",
    description: "dialog title for removing product from draft order",
  },
  subtitle: {
    id: "th06kZ",
    defaultMessage: "Are you sure you want to remove {productName} from this draft order?",
    description: "dialog body asking to confirm product removal from draft order",
  },
  keepProductButton: {
    id: "uY8rPp",
    defaultMessage: "Keep product",
    description: "button label to cancel product removal",
  },
  removeProductButton: {
    id: "McotWC",
    defaultMessage: "Remove product",
    description: "button label to confirm product removal",
  },
});
