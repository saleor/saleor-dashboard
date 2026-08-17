import { defineMessages } from "react-intl";

export const voucherChannelAvailabilityMessages = defineMessages({
  emptyDescription: {
    id: "SA8Gdr",
    defaultMessage:
      "Assign channels so this voucher can be redeemed at checkout. Set discount value and minimum order per channel in Discount and Requirements.",
    description: "voucher channel availability empty state description",
  },
  statusActive: {
    id: "/DtuG1",
    defaultMessage: "Active",
    description: "voucher channel status when schedule is currently redeemable",
  },
  statusActiveDescription: {
    id: "c48xJ+",
    defaultMessage: "Voucher can be redeemed in this channel now",
    description: "voucher channel status description when active",
  },
  statusScheduled: {
    id: "s699+F",
    defaultMessage: "Scheduled",
    description: "voucher channel status when schedule has not started",
  },
  statusScheduledDescription: {
    id: "zS26Pl",
    defaultMessage: "Voucher becomes redeemable on {date}",
    description: "voucher channel status description when scheduled",
  },
  statusEnded: {
    id: "qqS0hY",
    defaultMessage: "Ended",
    description: "voucher channel status when schedule has ended",
  },
  statusEndedDescription: {
    id: "c6fIOT",
    defaultMessage: "Voucher redeem window ended on {date}",
    description: "voucher channel status description when ended",
  },
});
