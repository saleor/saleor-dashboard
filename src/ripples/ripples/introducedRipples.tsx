import { allRipplesModalOpen } from "@dashboard/ripples/state";
import { Ripple } from "@dashboard/ripples/types";
import { Paragraph } from "@saleor/macaw-ui-next";
import { getDefaultStore } from "jotai";
import { defineMessage } from "react-intl";

const defaultStore = getDefaultStore();

export const rippleIntroducedRipples: Ripple = {
  TTL_seconds: 60 * 60 * 24 * 2,
  ID: "introducing-ripples",
  content: {
    oneLiner: "Introducing hints about latest changes",
    contextual: (
      <>
        <Paragraph>We are now notifying about new changes in Saleor.</Paragraph>
        <Paragraph>You can find all of them here</Paragraph>
      </>
    ),
    global: (
      <>
        <Paragraph>We are now showing latest features directly in the Dashboard.</Paragraph>
        <Paragraph>
          You can find them contextually and in the &#34;Recent changes&#34; modal
        </Paragraph>
      </>
    ),
  },
  dateAdded: new Date(2025, 8),
  actions: [
    {
      label: defineMessage({
        defaultMessage: "Show me",
        id: "1ACBFw",
        description: "Ripple tooltip confirmation button",
      }),
      onClick() {
        defaultStore.set(allRipplesModalOpen, true);
      },
    },
  ],
};
