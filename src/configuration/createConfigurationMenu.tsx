// @ts-strict-ignore
import { attributeListUrlWithAttributeTypePreset } from "@dashboard/attributes/urls";
import { channelsListUrl } from "@dashboard/channels/urls";
import { AttributeTypeEnum, PermissionEnum } from "@dashboard/graphql";
import { createConfigurationLucideIcon } from "@dashboard/icons/createNavigationLucideIcon";
import { ConfigurationModelingIcon } from "@dashboard/icons/Modeling";
import { ConfigurationProductsIcon } from "@dashboard/icons/Products";
import { sectionNames } from "@dashboard/intl";
import { pageTypeListUrl } from "@dashboard/modelTypes/urls";
import { orderSettingsPath } from "@dashboard/orders/urls";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { productTypeListUrl } from "@dashboard/productTypes/urls";
import { shippingZonesListUrl } from "@dashboard/shipping/urls";
import { siteSettingsUrl } from "@dashboard/siteSettings/urls";
import { staffListUrl } from "@dashboard/staff/urls";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { warehouseSection } from "@dashboard/warehouses/urls";
import {
  Package,
  Radio,
  Receipt,
  Settings,
  Shield,
  Tags,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { type IntlShape } from "react-intl";

import { type MenuSection } from "./types";

const ConfigurationAttributesIcon = createConfigurationLucideIcon(Tags);
const ConfigurationTaxesIcon = createConfigurationLucideIcon(Receipt);
const ConfigurationStaffIcon = createConfigurationLucideIcon(Users);
const ConfigurationPermissionGroupsIcon = createConfigurationLucideIcon(Shield);
const ConfigurationShippingIcon = createConfigurationLucideIcon(Truck);
const ConfigurationWarehousesIcon = createConfigurationLucideIcon(Warehouse);
const ConfigurationOrderSettingsIcon = createConfigurationLucideIcon(Package);
const ConfigurationChannelsIcon = createConfigurationLucideIcon(Radio);
const ConfigurationStoreIcon = createConfigurationLucideIcon(Settings);

/**
 * Configuration IA: merchant jobs, not engineering modules.
 * Order: Store → Markets → Catalog → Content → Shipping → Orders → Users.
 */
export function createConfigurationMenu(intl: IntlShape): MenuSection[] {
  return [
    {
      label: intl.formatMessage({
        id: "bADvk1",
        defaultMessage: "Store",
        description: "configuration section label for store identity and accounts",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "WmVIJi",
            defaultMessage: "Manage your store name, address, and customer accounts",
            description: "configuration menu item description for store settings",
          }),
          icon: <ConfigurationStoreIcon />,
          permissions: [PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.siteSettings),
          url: siteSettingsUrl(),
          testId: "configuration-menu-site-settings",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "Gw+vb5",
        defaultMessage: "Markets & channels",
        description: "configuration section for sales channels and tax markets",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "8vJCJ4",
            defaultMessage: "Define and manage your sales channels",
          }),
          icon: <ConfigurationChannelsIcon />,
          permissions: [PermissionEnum.MANAGE_CHANNELS],
          title: intl.formatMessage(sectionNames.channels),
          url: channelsListUrl(),
          testId: "configuration-menu-channels",
        },
        {
          description: intl.formatMessage({
            id: "EIULpW",
            defaultMessage: "Manage how your store charges tax",
          }),
          icon: <ConfigurationTaxesIcon />,
          title: intl.formatMessage(sectionNames.taxes),
          url: taxConfigurationListUrl(),
          testId: "configuration-menu-taxes",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "D77hf0",
        defaultMessage: "Products & catalog",
        description: "configuration section for product types and attributes",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "n0RwMK",
            defaultMessage: "Define types of products you sell",
          }),
          icon: <ConfigurationProductsIcon />,
          permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
          title: intl.formatMessage(sectionNames.productTypes),
          url: productTypeListUrl(),
          testId: "configuration-menu-product-types",
        },
        {
          description: intl.formatMessage({
            id: "usPgB+",
            defaultMessage: "Manage attributes used for product types",
            description: "configuration menu item description",
          }),
          icon: <ConfigurationAttributesIcon />,
          permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
          title: intl.formatMessage({
            id: "GTg7rP",
            defaultMessage: "Product attributes",
            description: "configuration menu item title",
          }),
          url: attributeListUrlWithAttributeTypePreset(AttributeTypeEnum.PRODUCT_TYPE),
          testId: "configuration-menu-product-attributes",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "LKgNzC",
        defaultMessage: "Content",
        description: "configuration section for model types and attributes",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "j4dRq/",
            defaultMessage: "Define types of models you use",
            description: "configuration menu item description",
          }),
          icon: <ConfigurationModelingIcon />,
          permissions: [PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES],
          title: intl.formatMessage(sectionNames.modelTypes),
          url: pageTypeListUrl(),
          testId: "configuration-menu-model-types",
        },
        {
          description: intl.formatMessage({
            id: "fFwHC3",
            defaultMessage: "Manage attributes used for model types",
            description: "configuration menu item description",
          }),
          icon: <ConfigurationAttributesIcon />,
          permissions: [PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES],
          title: intl.formatMessage({
            id: "I0975K",
            defaultMessage: "Model attributes",
            description: "configuration menu item title",
          }),
          url: attributeListUrlWithAttributeTypePreset(AttributeTypeEnum.PAGE_TYPE),
          testId: "configuration-menu-model-attributes",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "k6uom3",
        defaultMessage: "Shipping & delivery",
        description: "configuration section for shipping zones and warehouses",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "zxs6G3",
            defaultMessage: "Manage how you ship out orders",
          }),
          icon: <ConfigurationShippingIcon />,
          permissions: [PermissionEnum.MANAGE_SHIPPING],
          title: intl.formatMessage(sectionNames.shipping),
          url: shippingZonesListUrl(),
          testId: "configurationMenuShipping",
        },
        {
          description: intl.formatMessage({
            id: "5RmuD+",
            defaultMessage: "Manage and update your warehouse information",
          }),
          icon: <ConfigurationWarehousesIcon />,
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          title: intl.formatMessage(sectionNames.warehouses),
          url: warehouseSection,
          testId: "configuration-menu-warehouses",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "1T8Vun",
        defaultMessage: "Orders",
        description: "configuration section for order lifecycle policies",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "8liGHT",
            defaultMessage: "Configure order processing, fulfillment, checkout stock, and returns",
            description: "configuration menu item description for order settings",
          }),
          icon: <ConfigurationOrderSettingsIcon />,
          permissions: [PermissionEnum.MANAGE_ORDERS, PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.ordersAndFulfillment),
          url: orderSettingsPath,
          testId: "configuration-menu-order-settings",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "U353oB",
        defaultMessage: "Users & permissions",
        description: "configuration section for staff and permission groups",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "RQUkVW",
            defaultMessage: "Manage your employees and their permissions",
          }),
          icon: <ConfigurationStaffIcon />,
          permissions: [PermissionEnum.MANAGE_STAFF],
          title: intl.formatMessage(sectionNames.staff),
          url: staffListUrl(),
          testId: "configuration-menu-staff",
        },
        {
          description: intl.formatMessage({
            id: "ivJ1qt",
            defaultMessage: "Manage your permission groups and their permissions",
          }),
          icon: <ConfigurationPermissionGroupsIcon />,
          permissions: [PermissionEnum.MANAGE_STAFF],
          title: intl.formatMessage(sectionNames.permissionGroups),
          url: permissionGroupListUrl(),
          testId: "configuration-menu-permission-groups",
        },
      ],
    },
  ];
}
