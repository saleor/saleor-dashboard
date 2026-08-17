import { giftCardExpirySettingsCard as expiryMessages } from "@dashboard/giftCards/GiftCardSettings/GiftCardExpirySettingsCard/messages";
import { giftCardSettingsPath } from "@dashboard/giftCards/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { defineMessages } from "react-intl";

import { settingsHashes, settingsHref } from "./hashes";
import { type SettingsCatalogEntry } from "./types";

const labels = defineMessages({
  hubDescription: {
    id: "hNwVmh",
    defaultMessage: "Set default expiration for issued and purchased gift cards",
    description: "configuration menu item description for gift card settings",
  },
  expiryPeriod: {
    id: "F6U+Fj",
    defaultMessage: "gift card expiration period",
    description: "settings search alias",
  },
  neverExpire: {
    id: "VX9XZ1",
    defaultMessage: "gift cards never expire",
    description: "settings search alias",
  },
});

const hubBreadcrumb = [sectionNames.giftCards];

export const giftCardsCatalogEntries: SettingsCatalogEntry[] = [
  {
    id: "gift-cards.hub",
    kind: "hub",
    title: sectionNames.giftCards,
    description: labels.hubDescription,
    breadcrumbs: hubBreadcrumb,
    href: giftCardSettingsPath,
    permissions: [PermissionEnum.MANAGE_GIFT_CARD],
  },
  {
    id: "gift-cards.expiry",
    kind: "section",
    title: expiryMessages.expiryDateTitle,
    description: expiryMessages.expiryDateSectionDescription,
    keywords: [labels.expiryPeriod, labels.neverExpire],
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(giftCardSettingsPath, settingsHashes.giftCardsExpiry),
    hash: settingsHashes.giftCardsExpiry,
    permissions: [PermissionEnum.MANAGE_GIFT_CARD],
    ownership: "shop",
  },
  {
    id: "gift-cards.expiry-period",
    kind: "setting",
    title: expiryMessages.setExpirationPeriodTitle,
    description: expiryMessages.setExpirationPeriodDescription,
    keywords: [labels.expiryPeriod],
    breadcrumbs: [...hubBreadcrumb, expiryMessages.expiryDateTitle],
    href: settingsHref(giftCardSettingsPath, settingsHashes.giftCardsExpiry),
    hash: settingsHashes.giftCardsExpiry,
    permissions: [PermissionEnum.MANAGE_GIFT_CARD],
    ownership: "shop",
  },
];
