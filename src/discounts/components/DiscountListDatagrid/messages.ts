import { defineMessages } from "react-intl";

export const columnsMessages = defineMessages({
  name: {
    id: "F56hOz",
    defaultMessage: "Name",
    description: "sale name",
  },
  status: {
    id: "uT3VS+",
    defaultMessage: "Status",
    description: "promotion status",
  },
  starts: {
    id: "iBSq6l",
    defaultMessage: "Starts",
    description: "sale start date",
  },
  ends: {
    id: "giF5UV",
    defaultMessage: "Ends",
    description: "sale end date",
  },
  type: {
    id: "z/2AZY",
    defaultMessage: "Discount type",
  },
});

export const messages = defineMessages({
  empty: {
    id: "k+H6kK",
    defaultMessage: "No promotions found",
    description: "promotions list empty state",
  },
  statusActive: {
    id: "EDFd9F",
    defaultMessage: "Active",
    description: "voucher list status when redeemable now",
  },
  statusScheduled: {
    id: "y/e6hl",
    defaultMessage: "Scheduled",
    description: "voucher list status before start date",
  },
  statusEnded: {
    id: "DBuWYc",
    defaultMessage: "Ended",
    description: "voucher list status after end date",
  },
});
