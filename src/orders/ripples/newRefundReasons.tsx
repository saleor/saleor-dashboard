import Link from "@dashboard/components/Link";
import { Ripple } from "@dashboard/ripples/types";
import { Paragraph } from "@saleor/macaw-ui-next";
import { defineMessage } from "react-intl";

export const rippleNewRefundReasons: Ripple = {
  ID: "new-refund-reasons",
  TTL_seconds: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: "Structured refund reasons",
    contextual: "Refund reasons are now more powerful with pre-defined choices",
    global: (
      <>
        <Paragraph>
          Refund reasons are now more powerful. You can add reason to the &#34;manual refund&#34;.
          Additionally, you can configure refunds to use structured data to enforce specific reasons
          to be provided when refunds are issued.
        </Paragraph>
        <Paragraph>
          Read more in{" "}
          <Link href="https://saleor.io/blog/refund-reasons" target="_blank">
            the article
          </Link>
        </Paragraph>
      </>
    ),
  },
  // Added in 3.22
  dateAdded: new Date(2025, 8, 1),
  actions: [
    {
      label: defineMessage({
        defaultMessage: "Read the blog post",
        id: "cti4iA",
      }),
      onClick() {
        window.open("https://saleor.io/blog/refund-reasons", "_blank");
      },
    },
  ],
};
