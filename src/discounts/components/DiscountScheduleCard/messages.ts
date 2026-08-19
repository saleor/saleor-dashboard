import { defineMessages } from "react-intl";

/** Shared Schedule card chrome — title + Active/Scheduled/Ended status. */
export const discountScheduleMessages = defineMessages({
  title: {
    id: "L7ykCS",
    defaultMessage: "Schedule",
    description: "voucher schedule card title",
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
  promotionIntro: {
    id: "pq4QXb",
    defaultMessage:
      "Outside this range, the promotion is not active and its rules do not apply at checkout or in the catalog.",
    description: "promotion schedule card intro",
  },
});
