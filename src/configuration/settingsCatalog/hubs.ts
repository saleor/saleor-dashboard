import { attributeListUrlWithAttributeTypePreset } from "@dashboard/attributes/urls";
import { channelsListUrl } from "@dashboard/channels/urls";
import { AttributeTypeEnum, PermissionEnum } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { pageTypeListUrl } from "@dashboard/modelTypes/urls";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { productTypeListUrl } from "@dashboard/productTypes/urls";
import { shippingZonesListUrl } from "@dashboard/shipping/urls";
import { staffListUrl } from "@dashboard/staff/urls";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { warehouseSection } from "@dashboard/warehouses/urls";
import { defineMessages } from "react-intl";

import { type SettingsCatalogEntry } from "./types";

/**
 * Hub-level entries mirroring createConfigurationMenu so Configuration search
 * finds list destinations even before field-level indexing exists there.
 * Orders / Store hubs are defined in their field-level modules instead.
 */
const hubMessages = defineMessages({
  channelsDescription: {
    id: "8vJCJ4",
    defaultMessage: "Define and manage your sales channels",
  },
  taxesDescription: {
    id: "EIULpW",
    defaultMessage: "Manage how your store charges tax",
  },
  productTypesDescription: {
    id: "n0RwMK",
    defaultMessage: "Define types of products you sell",
  },
  productAttributesTitle: {
    id: "GTg7rP",
    defaultMessage: "Product attributes",
    description: "configuration menu item title",
  },
  productAttributesDescription: {
    id: "usPgB+",
    defaultMessage: "Manage attributes used for product types",
    description: "configuration menu item description",
  },
  modelTypesDescription: {
    id: "j4dRq/",
    defaultMessage: "Define types of models you use",
    description: "configuration menu item description",
  },
  modelAttributesTitle: {
    id: "I0975K",
    defaultMessage: "Model attributes",
    description: "configuration menu item title",
  },
  modelAttributesDescription: {
    id: "fFwHC3",
    defaultMessage: "Manage attributes used for model types",
    description: "configuration menu item description",
  },
  shippingDescription: {
    id: "zxs6G3",
    defaultMessage: "Manage how you ship out orders",
  },
  warehousesDescription: {
    id: "5RmuD+",
    defaultMessage: "Manage and update your warehouse information",
  },
  staffDescription: {
    id: "RQUkVW",
    defaultMessage: "Manage your employees and their permissions",
  },
  permissionGroupsDescription: {
    id: "ivJ1qt",
    defaultMessage: "Manage your permission groups and their permissions",
  },
  marketsSection: {
    id: "Gw+vb5",
    defaultMessage: "Markets & channels",
    description: "configuration section for sales channels and tax markets",
  },
  catalogSection: {
    id: "D77hf0",
    defaultMessage: "Products & catalog",
    description: "configuration section for product types and attributes",
  },
  contentSection: {
    id: "LKgNzC",
    defaultMessage: "Content",
    description: "configuration section for model types and attributes",
  },
  shippingSection: {
    id: "k6uom3",
    defaultMessage: "Shipping & delivery",
    description: "configuration section for shipping zones and warehouses",
  },
  usersSection: {
    id: "U353oB",
    defaultMessage: "Users & permissions",
    description: "configuration section for staff and permission groups",
  },
});

export const configurationHubsCatalogEntries: SettingsCatalogEntry[] = [
  {
    id: "hubs.channels",
    kind: "hub",
    title: sectionNames.channels,
    description: hubMessages.channelsDescription,
    breadcrumbs: [hubMessages.marketsSection],
    href: channelsListUrl(),
    permissions: [PermissionEnum.MANAGE_CHANNELS],
  },
  {
    id: "hubs.taxes",
    kind: "hub",
    title: sectionNames.taxes,
    description: hubMessages.taxesDescription,
    breadcrumbs: [hubMessages.marketsSection],
    href: taxConfigurationListUrl(),
  },
  {
    id: "hubs.product-types",
    kind: "hub",
    title: sectionNames.productTypes,
    description: hubMessages.productTypesDescription,
    breadcrumbs: [hubMessages.catalogSection],
    href: productTypeListUrl(),
    permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
  },
  {
    id: "hubs.product-attributes",
    kind: "hub",
    title: hubMessages.productAttributesTitle,
    description: hubMessages.productAttributesDescription,
    breadcrumbs: [hubMessages.catalogSection],
    href: attributeListUrlWithAttributeTypePreset(AttributeTypeEnum.PRODUCT_TYPE),
    permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
  },
  {
    id: "hubs.model-types",
    kind: "hub",
    title: sectionNames.modelTypes,
    description: hubMessages.modelTypesDescription,
    breadcrumbs: [hubMessages.contentSection],
    href: pageTypeListUrl(),
    permissions: [PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES],
  },
  {
    id: "hubs.model-attributes",
    kind: "hub",
    title: hubMessages.modelAttributesTitle,
    description: hubMessages.modelAttributesDescription,
    breadcrumbs: [hubMessages.contentSection],
    href: attributeListUrlWithAttributeTypePreset(AttributeTypeEnum.PAGE_TYPE),
    permissions: [PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES],
  },
  {
    id: "hubs.shipping",
    kind: "hub",
    title: sectionNames.shipping,
    description: hubMessages.shippingDescription,
    breadcrumbs: [hubMessages.shippingSection],
    href: shippingZonesListUrl(),
    permissions: [PermissionEnum.MANAGE_SHIPPING],
  },
  {
    id: "hubs.warehouses",
    kind: "hub",
    title: sectionNames.warehouses,
    description: hubMessages.warehousesDescription,
    breadcrumbs: [hubMessages.shippingSection],
    href: warehouseSection,
    permissions: [PermissionEnum.MANAGE_PRODUCTS],
  },
  {
    id: "hubs.staff",
    kind: "hub",
    title: sectionNames.staff,
    description: hubMessages.staffDescription,
    breadcrumbs: [hubMessages.usersSection],
    href: staffListUrl(),
    permissions: [PermissionEnum.MANAGE_STAFF],
  },
  {
    id: "hubs.permission-groups",
    kind: "hub",
    title: sectionNames.permissionGroups,
    description: hubMessages.permissionGroupsDescription,
    breadcrumbs: [hubMessages.usersSection],
    href: permissionGroupListUrl(),
    permissions: [PermissionEnum.MANAGE_STAFF],
  },
];
