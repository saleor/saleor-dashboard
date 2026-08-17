import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "Kb8Mdm",
    defaultMessage: "Payment gateways",
    description: "channel payment gateways section title",
  },
  subtitle: {
    id: "C9+sei",
    defaultMessage:
      "Payment apps handle provider credentials and checkout processing. Channel payment settings above control charge and authorization behavior.",
    description: "channel payment gateways section subtitle",
  },
  emptyDescription: {
    id: "ntFB+V",
    defaultMessage:
      "Install a payment app to accept card and other payments at checkout for this channel.",
    description: "channel payment gateways empty state",
  },
  exploreExtensions: {
    id: "U87Yeh",
    defaultMessage: "Explore extensions",
    description: "link to explore payment apps",
  },
  configure: {
    id: "csKusi",
    defaultMessage: "Configure",
    description: "open payment app settings",
  },
  truncatedList: {
    id: "diq8M5",
    defaultMessage:
      "Showing the first 100 extensions. Open installed extensions to see payment apps beyond this limit.",
    description: "payment apps list truncated warning",
  },
});
