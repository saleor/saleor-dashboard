import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { refundsSettingsPageMessages } from "@dashboard/refundsSettings/components/RefundsSettingsPage/messages";
import { refundsSettingsPath } from "@dashboard/refundsSettings/urls";
import { defineMessages } from "react-intl";

import { settingsHashes, settingsHref } from "./hashes";
import { type SettingsCatalogEntry } from "./types";

const keywords = defineMessages({
  refundReason: {
    id: "zf1lqt",
    defaultMessage: "refund reason",
    description: "settings search alias",
  },
  returnReason: {
    id: "qRsNn3",
    defaultMessage: "return reason",
    description: "settings search alias",
  },
  returnReasons: {
    id: "oZrwSn",
    defaultMessage: "return reasons",
    description: "settings search alias",
  },
  modelTypeReasons: {
    id: "BxRnKL",
    defaultMessage: "reason model type",
    description: "settings search alias",
  },
});

const hubBreadcrumb = [sectionNames.refundsSettings];

export const refundsCatalogEntries: SettingsCatalogEntry[] = [
  {
    id: "refunds.hub",
    kind: "hub",
    title: sectionNames.refundsSettings,
    description: refundsSettingsPageMessages.pageDescription,
    breadcrumbs: hubBreadcrumb,
    href: refundsSettingsPath,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
  },
  {
    id: "refunds.refund-reasons",
    kind: "section",
    title: refundsSettingsPageMessages.refundExplainerTitle,
    description: refundsSettingsPageMessages.refundExplainerContent,
    keywords: [keywords.refundReason, keywords.modelTypeReasons],
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(refundsSettingsPath, settingsHashes.refundsRefundReasons),
    hash: settingsHashes.refundsRefundReasons,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "refunds.return-reasons",
    kind: "section",
    title: refundsSettingsPageMessages.returnExplainerTitle,
    description: refundsSettingsPageMessages.returnExplainerContent,
    keywords: [keywords.returnReason, keywords.returnReasons, keywords.modelTypeReasons],
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(refundsSettingsPath, settingsHashes.refundsReturnReasons),
    hash: settingsHashes.refundsReturnReasons,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
];
