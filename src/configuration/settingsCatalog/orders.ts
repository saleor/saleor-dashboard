import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { orderChannelSettingsMatrixMessages } from "@dashboard/orders/components/OrderChannelSettingsMatrix/messages";
import { messages as checkoutStockMessages } from "@dashboard/orders/components/OrderCheckoutStockSettings/messages";
import { orderSettingsPath } from "@dashboard/orders/urls";
import { defineMessages } from "react-intl";

import { settingsHashes, settingsHref } from "./hashes";
import { type SettingsCatalogEntry } from "./types";

const labels = defineMessages({
  channelSection: {
    id: "BvUJzF",
    defaultMessage: "Per-channel order settings",
    description: "matrix section title on orders and fulfillment settings",
  },
  autoConfirm: {
    id: "XGY+yQ",
    defaultMessage: "Auto-confirm",
    description: "matrix column header",
  },
  autoFulfill: {
    id: "rKk1Fx",
    defaultMessage: "Auto-fulfill gift cards",
    description: "matrix column header",
  },
  allowUnpaid: {
    id: "ZMT099",
    defaultMessage: "Allow unpaid",
    description: "matrix column header",
  },
  deleteExpired: {
    id: "xipkZ1",
    defaultMessage: "Delete expired (days)",
    description: "matrix column header",
  },
  fulfillmentSection: {
    id: "G3ay2p",
    defaultMessage: "Fulfillment settings",
    description: "section header",
  },
  fulfillmentAutoApprove: {
    id: "05hqq6",
    defaultMessage: "Automatically approve all fulfillments",
    description: "checkbox label",
  },
  fulfillmentAllowUnpaid: {
    id: "2MKkgX",
    defaultMessage: "Allow fulfillment without payment",
    description: "checkbox label",
  },
  refundsLinkDescription: {
    id: "34QbG4",
    defaultMessage: "Choose model types used as refund and return reason references.",
    description: "hint under returns and refunds card on order settings",
  },
  hubDescription: {
    id: "8liGHT",
    defaultMessage: "Configure order processing, fulfillment, checkout stock, and returns",
    description: "configuration menu item description for order settings",
  },
});

const keywords = defineMessages({
  orderConfirmation: {
    id: "jPVqOL",
    defaultMessage: "order confirmation",
    description: "settings search alias",
  },
  confirmOrders: {
    id: "v6GMvG",
    defaultMessage: "confirm orders",
    description: "settings search alias",
  },
  unconfirmed: {
    id: "JSr+vB",
    defaultMessage: "unconfirmed",
    description: "settings search alias",
  },
  autoConfirmOrders: {
    id: "aIaNJa",
    defaultMessage: "automatically confirm",
    description: "settings search alias",
  },
  giftCards: {
    id: "LmmOfO",
    defaultMessage: "gift card fulfillment",
    description: "settings search alias",
  },
  unpaidOrders: {
    id: "NISCwn",
    defaultMessage: "unpaid orders",
    description: "settings search alias",
  },
  expireOrders: {
    id: "JfTnk+",
    defaultMessage: "expire orders",
    description: "settings search alias",
  },
  cleanupOrders: {
    id: "04Ljji",
    defaultMessage: "cleanup orders",
    description: "settings search alias",
  },
  deleteOrders: {
    id: "CvRYXC",
    defaultMessage: "delete expired orders",
    description: "settings search alias",
  },
  approveFulfillment: {
    id: "SNSHFa",
    defaultMessage: "approve fulfillments",
    description: "settings search alias",
  },
  stockReservation: {
    id: "d+XiBg",
    defaultMessage: "stock reservation",
    description: "settings search alias",
  },
  checkoutQuantity: {
    id: "OyxX4P",
    defaultMessage: "checkout quantity limit",
    description: "settings search alias",
  },
  returns: {
    id: "WcEwji",
    defaultMessage: "returns",
    description: "settings search alias",
  },
});

const hubBreadcrumb = [sectionNames.ordersAndFulfillment];

export const ordersCatalogEntries: SettingsCatalogEntry[] = [
  {
    id: "orders.hub",
    kind: "hub",
    title: sectionNames.ordersAndFulfillment,
    description: labels.hubDescription,
    breadcrumbs: hubBreadcrumb,
    href: orderSettingsPath,
    permissions: [PermissionEnum.MANAGE_ORDERS, PermissionEnum.MANAGE_SETTINGS],
  },
  {
    id: "orders.channel-settings",
    kind: "section",
    title: labels.channelSection,
    description: orderChannelSettingsMatrixMessages.matrixDescription,
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(orderSettingsPath, settingsHashes.ordersChannelSettings),
    hash: settingsHashes.ordersChannelSettings,
    permissions: [PermissionEnum.MANAGE_ORDERS],
    ownership: "channel",
  },
  {
    id: "orders.automatically-confirm",
    kind: "setting",
    title: labels.autoConfirm,
    description: orderChannelSettingsMatrixMessages.autoConfirmTooltipIntro,
    keywords: [
      keywords.orderConfirmation,
      keywords.confirmOrders,
      keywords.unconfirmed,
      keywords.autoConfirmOrders,
    ],
    breadcrumbs: [...hubBreadcrumb, labels.channelSection],
    href: settingsHref(orderSettingsPath, settingsHashes.ordersAutoConfirm),
    hash: settingsHashes.ordersAutoConfirm,
    permissions: [PermissionEnum.MANAGE_ORDERS],
    ownership: "channel",
  },
  {
    id: "orders.auto-fulfill-gift-cards",
    kind: "setting",
    title: labels.autoFulfill,
    description: orderChannelSettingsMatrixMessages.autoFulfillGiftCardsTooltip,
    keywords: [keywords.giftCards],
    breadcrumbs: [...hubBreadcrumb, labels.channelSection],
    href: settingsHref(orderSettingsPath, settingsHashes.ordersAutoFulfillGiftCards),
    hash: settingsHashes.ordersAutoFulfillGiftCards,
    permissions: [PermissionEnum.MANAGE_ORDERS],
    ownership: "channel",
  },
  {
    id: "orders.allow-unpaid",
    kind: "setting",
    title: labels.allowUnpaid,
    description: orderChannelSettingsMatrixMessages.allowUnpaidTooltip,
    keywords: [keywords.unpaidOrders],
    breadcrumbs: [...hubBreadcrumb, labels.channelSection],
    href: settingsHref(orderSettingsPath, settingsHashes.ordersAllowUnpaid),
    hash: settingsHashes.ordersAllowUnpaid,
    permissions: [PermissionEnum.MANAGE_ORDERS],
    ownership: "channel",
  },
  {
    id: "orders.delete-expired",
    kind: "setting",
    title: labels.deleteExpired,
    description: orderChannelSettingsMatrixMessages.deleteExpiredTooltip,
    keywords: [keywords.expireOrders, keywords.cleanupOrders, keywords.deleteOrders],
    breadcrumbs: [...hubBreadcrumb, labels.channelSection],
    href: settingsHref(orderSettingsPath, settingsHashes.ordersDeleteExpired),
    hash: settingsHashes.ordersDeleteExpired,
    permissions: [PermissionEnum.MANAGE_ORDERS],
    ownership: "channel",
  },
  {
    id: "orders.fulfillment",
    kind: "section",
    title: labels.fulfillmentSection,
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(orderSettingsPath, settingsHashes.ordersFulfillment),
    hash: settingsHashes.ordersFulfillment,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "orders.fulfillment-auto-approve",
    kind: "setting",
    title: labels.fulfillmentAutoApprove,
    keywords: [keywords.approveFulfillment],
    breadcrumbs: [...hubBreadcrumb, labels.fulfillmentSection],
    href: settingsHref(orderSettingsPath, settingsHashes.ordersFulfillmentAutoApprove),
    hash: settingsHashes.ordersFulfillmentAutoApprove,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "orders.fulfillment-allow-unpaid",
    kind: "setting",
    title: labels.fulfillmentAllowUnpaid,
    breadcrumbs: [...hubBreadcrumb, labels.fulfillmentSection],
    href: settingsHref(orderSettingsPath, settingsHashes.ordersFulfillmentAllowUnpaid),
    hash: settingsHashes.ordersFulfillmentAllowUnpaid,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "orders.reserved-stock",
    kind: "section",
    title: checkoutStockMessages.reservedStock,
    description: checkoutStockMessages.reservedStockDescription,
    keywords: [keywords.stockReservation],
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(orderSettingsPath, settingsHashes.ordersReservedStock),
    hash: settingsHashes.ordersReservedStock,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "orders.checkout-limits",
    kind: "section",
    title: checkoutStockMessages.checkoutLimits,
    description: checkoutStockMessages.checkoutLimitsDescription,
    keywords: [keywords.checkoutQuantity],
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(orderSettingsPath, settingsHashes.ordersCheckoutLimits),
    hash: settingsHashes.ordersCheckoutLimits,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "orders.refunds-link",
    kind: "setting",
    title: sectionNames.refundsSettings,
    description: labels.refundsLinkDescription,
    keywords: [keywords.returns],
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(orderSettingsPath, settingsHashes.ordersRefundsLink),
    hash: settingsHashes.ordersRefundsLink,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
];
