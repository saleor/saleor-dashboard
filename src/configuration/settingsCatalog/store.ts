import { PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { messages as storeMessages } from "@dashboard/siteSettings/components/SiteSettingsPage/messages";
import { siteSettingsPath } from "@dashboard/siteSettings/urls";
import { defineMessages } from "react-intl";

import { settingsHashes, settingsHref } from "./hashes";
import { type SettingsCatalogEntry } from "./types";

const labels = defineMessages({
  hubDescription: {
    id: "WmVIJi",
    defaultMessage: "Manage your store name, address, and customer accounts",
    description: "configuration menu item description for store settings",
  },
});

const keywords = defineMessages({
  storeName: {
    id: "XNQPEn",
    defaultMessage: "store name",
    description: "settings search alias",
  },
  companyAddress: {
    id: "43USpF",
    defaultMessage: "company address",
    description: "settings search alias",
  },
  invoiceAddress: {
    id: "jSGYms",
    defaultMessage: "invoice address",
    description: "settings search alias",
  },
  emailConfirm: {
    id: "Q2GiTL",
    defaultMessage: "email confirmation",
    description: "settings search alias",
  },
  registration: {
    id: "J71slC",
    defaultMessage: "customer registration",
    description: "settings search alias",
  },
  passwordAuth: {
    id: "ltbVdP",
    defaultMessage: "password authentication",
    description: "settings search alias",
  },
  login: {
    id: "b/z/5G",
    defaultMessage: "customer login",
    description: "settings search alias",
  },
  stockAvailability: {
    id: "s+u2mc",
    defaultMessage: "stock availability mode",
    description: "settings search alias",
  },
  shippingZoneStock: {
    id: "0BXL1v",
    defaultMessage: "shipping zone stock",
    description: "settings search alias",
  },
  metadataWebhooks: {
    id: "nTkUAI",
    defaultMessage: "metadata webhooks",
    description: "settings search alias",
  },
  addressFields: {
    id: "EjrHaT",
    defaultMessage: "address validation",
    description: "settings search alias",
  },
});

const hubBreadcrumb = [sectionNames.siteSettings];

export const storeCatalogEntries: SettingsCatalogEntry[] = [
  {
    id: "store.hub",
    kind: "hub",
    title: sectionNames.siteSettings,
    description: labels.hubDescription,
    breadcrumbs: hubBreadcrumb,
    href: siteSettingsPath,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
  },
  {
    id: "store.details",
    kind: "section",
    title: storeMessages.sectionStoreDetailsTitle,
    description: storeMessages.sectionStoreDetailsDescription,
    keywords: [keywords.storeName],
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(siteSettingsPath, settingsHashes.storeDetails),
    hash: settingsHashes.storeDetails,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "store.company",
    kind: "section",
    title: storeMessages.sectionCompanyTitle,
    description: storeMessages.sectionCompanyDescription,
    keywords: [keywords.companyAddress, keywords.invoiceAddress],
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(siteSettingsPath, settingsHashes.storeCompany),
    hash: settingsHashes.storeCompany,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "store.customer-accounts",
    kind: "section",
    title: storeMessages.sectionCustomerAccountsTitle,
    description: storeMessages.sectionCustomerAccountsDescription,
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(siteSettingsPath, settingsHashes.storeCustomerAccounts),
    hash: settingsHashes.storeCustomerAccounts,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "store.email-confirmation",
    kind: "setting",
    title: storeMessages.sectionEmailConfirmationHeader,
    description: storeMessages.sectionEmailConfirmationDescription,
    keywords: [keywords.emailConfirm, keywords.registration],
    breadcrumbs: [...hubBreadcrumb, storeMessages.sectionCustomerAccountsTitle],
    href: settingsHref(siteSettingsPath, settingsHashes.storeEmailConfirmation),
    hash: settingsHashes.storeEmailConfirmation,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "store.password-login",
    kind: "setting",
    title: storeMessages.sectionPasswordLoginTitle,
    description: storeMessages.sectionPasswordLoginDescription,
    keywords: [keywords.passwordAuth, keywords.login],
    breadcrumbs: [...hubBreadcrumb, storeMessages.sectionCustomerAccountsTitle],
    href: settingsHref(siteSettingsPath, settingsHashes.storePasswordLogin),
    hash: settingsHashes.storePasswordLogin,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "store.advanced",
    kind: "section",
    title: storeMessages.sectionAdvancedTitle,
    description: storeMessages.sectionAdvancedDescription,
    breadcrumbs: hubBreadcrumb,
    href: settingsHref(siteSettingsPath, settingsHashes.storeAdvanced),
    hash: settingsHashes.storeAdvanced,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "store.webhook-emission",
    kind: "setting",
    title: storeMessages.sectionWebhookEmissionHeader,
    description: storeMessages.sectionWebhookEmissionDescription,
    keywords: [keywords.metadataWebhooks],
    breadcrumbs: [...hubBreadcrumb, storeMessages.sectionAdvancedTitle],
    href: settingsHref(siteSettingsPath, settingsHashes.storeWebhookEmission),
    hash: settingsHashes.storeWebhookEmission,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "store.stock-availability",
    kind: "setting",
    title: storeMessages.sectionStockAvailabilityHeader,
    keywords: [keywords.stockAvailability, keywords.shippingZoneStock],
    breadcrumbs: [...hubBreadcrumb, storeMessages.sectionAdvancedTitle],
    href: settingsHref(siteSettingsPath, settingsHashes.storeStockAvailability),
    hash: settingsHashes.storeStockAvailability,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
  {
    id: "store.address-validation",
    kind: "setting",
    title: storeMessages.sectionAddressValidationHeader,
    description: storeMessages.sectionAddressValidationDescription,
    keywords: [keywords.addressFields],
    breadcrumbs: [...hubBreadcrumb, storeMessages.sectionAdvancedTitle],
    href: settingsHref(siteSettingsPath, settingsHashes.storeAddressValidation),
    hash: settingsHashes.storeAddressValidation,
    permissions: [PermissionEnum.MANAGE_SETTINGS],
    ownership: "shop",
  },
];
