import { defineMessages } from "react-intl";

export const voucherScheduleMessages = defineMessages({
  title: {
    id: "L7ykCS",
    defaultMessage: "Schedule",
    description: "voucher schedule card title",
  },
  intro: {
    id: "C2FRIv",
    defaultMessage:
      "Applies to all assigned channels. Outside this range, the voucher cannot be redeemed at checkout.",
    description: "voucher schedule card intro",
  },
  statusActive: {
    id: "SFAoiO",
    defaultMessage: "Active",
    description: "voucher schedule header status when currently redeemable",
  },
  statusScheduled: {
    id: "S0QRww",
    defaultMessage: "Scheduled",
    description: "voucher schedule header status when not started yet",
  },
  statusEnded: {
    id: "uGkXA1",
    defaultMessage: "Ended",
    description: "voucher schedule header status when redeem window ended",
  },
});
