import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "tx73BO",
    defaultMessage: "Delivery",
    description: "channel delivery card title",
  },
  assignedCount: {
    id: "HWM7Cf",
    defaultMessage: "{count} assigned",
    description: "channel delivery card header count",
  },
  requiredToSell: {
    id: "LCHIys",
    defaultMessage: "Required to sell",
    description: "channel delivery card header when no zones",
  },
  description: {
    id: "EZUwpG",
    defaultMessage:
      "Shipping zones supplied through this channel. A zone can be shared with other channels.",
    description: "channel delivery card description",
  },
  emptyTitle: {
    id: "j23Ryb",
    defaultMessage: "No shipping zones assigned",
    description: "channel delivery empty state title",
  },
  emptyDescription: {
    id: "JN8kTJ",
    defaultMessage:
      "Customers won't see any delivery method at checkout, so the order can't be completed.",
    description: "channel delivery empty state description",
  },
  assign: {
    id: "pM3s0H",
    defaultMessage: "Assign",
    description: "channel delivery assign CTA short label",
  },
  createShipping: {
    id: "62h68f",
    defaultMessage: "Create shipping",
    description: "channel delivery create dropdown item",
  },
});
