import Link from "@dashboard/components/Link";
import { Ripple } from "@dashboard/ripples/types";
import { Text } from "@saleor/macaw-ui-next";
import { defineMessage } from "react-intl";

export const ripplePagesAreModels: Ripple = {
  ID: "pages-are-models",
  TTL: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: "Pages are now called Models",
    contextual: "Pages are now called Models",
    global: (
      <>
        <Text>
          We have renamed Pages to Models. API still uses the old naming, but we it will change in
          the future.
        </Text>
        <Text>
          Read more in{" "}
          <Link href="https://saleor.io/blog/modeling" target="_blank">
            the article
          </Link>
        </Text>
      </>
    ),
  },
  // Approx June it was changed in the dashboard
  dateAdded: new Date(2025, 5, 1),
  actions: [
    {
      label: defineMessage({
        defaultMessage: "Read a blog post",
        id: "7DMWSy",
      }),
      onClick() {
        window.open("https://saleor.io/blog/modeling", "_blank");
      },
    },
  ],
};
