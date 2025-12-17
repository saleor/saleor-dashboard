import { Ripple } from "@dashboard/ripples/types";
import { Paragraph } from "@saleor/macaw-ui-next";

export const rippleRefreshedOrderSections: Ripple = {
  ID: "refreshed-order-sections",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: "Refreshed Order Sections",
    contextual: "We have refreshed Order Summary, Transactions and History sections.",
    global: (
      <>
        <Paragraph>
          We redesigned Order page look - welcome refreshed Order Summary, Transactions and History
        </Paragraph>
      </>
    ),
  },
  dateAdded: new Date(2025, 11, 17),
};
