import { messages as allocationMessages } from "@dashboard/channels/components/ChannelAllocationStrategy/messages";
import { messages as channelFormMessages } from "@dashboard/channels/components/ChannelForm/messages";
import { channelsListUrl } from "@dashboard/channels/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { defineMessages } from "react-intl";

import { type SettingsCatalogEntry } from "./types";

/**
 * Channel-only setting concepts (not dual-edited on the Orders hub).
 * href points at the channels list until the channel config view is redesigned
 * with stable section hashes — keep entry ids stable when retargeting hrefs.
 */
const keywords = defineMessages({
  authorize: {
    id: "367xKd",
    defaultMessage: "authorize",
    description: "settings search alias",
  },
  charge: {
    id: "jwDaI+",
    defaultMessage: "charge",
    description: "settings search alias",
  },
  transactionFlow: {
    id: "ranzuN",
    defaultMessage: "transaction flow",
    description: "settings search alias",
  },
  paymentCapture: {
    id: "jpY7Ne",
    defaultMessage: "payment capture",
    description: "settings search alias",
  },
  checkoutComplete: {
    id: "MTbQXl",
    defaultMessage: "checkout complete",
    description: "settings search alias",
  },
  autoCompleteCheckout: {
    id: "DY3rsj",
    defaultMessage: "automatic checkout completion",
    description: "settings search alias",
  },
  markPaid: {
    id: "VMJa9n",
    defaultMessage: "mark as paid",
    description: "settings search alias",
  },
  warehouseStock: {
    id: "d7EsgY",
    defaultMessage: "warehouse stock allocation",
    description: "settings search alias",
  },
  stockPriority: {
    id: "D6LyvQ",
    defaultMessage: "prioritize warehouses",
    description: "settings search alias",
  },
  openChannel: {
    id: "1LCFJM",
    defaultMessage: "Configured per channel — open a channel to edit.",
    description: "settings search hint when deep links are not yet available",
  },
});

const hubBreadcrumb = [sectionNames.channels];

export const channelsCatalogEntries: SettingsCatalogEntry[] = [
  {
    id: "channels.transaction-flow",
    kind: "setting",
    title: channelFormMessages.defaultTransactionFlowStrategyLabel,
    description: keywords.openChannel,
    keywords: [
      keywords.authorize,
      keywords.charge,
      keywords.transactionFlow,
      keywords.paymentCapture,
    ],
    breadcrumbs: hubBreadcrumb,
    href: channelsListUrl(),
    permissions: [PermissionEnum.MANAGE_CHANNELS],
    ownership: "channel",
  },
  {
    id: "channels.auto-complete-checkouts",
    kind: "setting",
    title: channelFormMessages.automaticallyCompleteCheckoutsLabel,
    description: keywords.openChannel,
    keywords: [keywords.checkoutComplete, keywords.autoCompleteCheckout],
    breadcrumbs: hubBreadcrumb,
    href: channelsListUrl(),
    permissions: [PermissionEnum.MANAGE_CHANNELS],
    ownership: "channel",
  },
  {
    id: "channels.mark-as-paid",
    kind: "setting",
    title: channelFormMessages.markAsPaid,
    description: keywords.openChannel,
    keywords: [keywords.markPaid, keywords.transactionFlow],
    breadcrumbs: hubBreadcrumb,
    href: channelsListUrl(),
    permissions: [PermissionEnum.MANAGE_CHANNELS],
    ownership: "channel",
  },
  {
    id: "channels.allocation-strategy",
    kind: "setting",
    title: allocationMessages.allocationStrategy,
    description: allocationMessages.allocationStrategyDescription,
    keywords: [keywords.warehouseStock, keywords.stockPriority],
    breadcrumbs: hubBreadcrumb,
    href: channelsListUrl(),
    permissions: [PermissionEnum.MANAGE_CHANNELS],
    ownership: "channel",
  },
];
