// @ts-strict-ignore
import { attributeListUrlWithAttributeTypePreset } from "@dashboard/attributes/urls";
import { channelsListUrl } from "@dashboard/channels/urls";
import { AttributeTypeEnum, PermissionEnum } from "@dashboard/graphql";
import Attributes from "@dashboard/icons/Attributes";
import Channels from "@dashboard/icons/Channels";
import { ConfigurationModelingIcon } from "@dashboard/icons/Modeling";
import PermissionGroups from "@dashboard/icons/PermissionGroups";
import { ConfigurationProductsIcon } from "@dashboard/icons/Products";
import ShippingMethods from "@dashboard/icons/ShippingMethods";
import SiteSettings from "@dashboard/icons/SiteSettings";
import StaffMembers from "@dashboard/icons/StaffMembers";
import Taxes from "@dashboard/icons/Taxes";
import Warehouses from "@dashboard/icons/Warehouses";
import { sectionNames } from "@dashboard/intl";
import { pageTypeListUrl } from "@dashboard/modelTypes/urls";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { productTypeListUrl } from "@dashboard/productTypes/urls";
import { refundsSettingsPath } from "@dashboard/refundsSettings/urls";
import { shippingZonesListUrl } from "@dashboard/shipping/urls";
import { siteSettingsUrl } from "@dashboard/siteSettings/urls";
import { staffListUrl } from "@dashboard/staff/urls";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { warehouseSection } from "@dashboard/warehouses/urls";
import { CreditCard } from "lucide-react";
import { type IntlShape } from "react-intl";

import { type MenuSection } from "./types";

export function createConfigurationMenu(intl: IntlShape): MenuSection[] {
  return [
    {
      label: intl.formatMessage({
        id: "ZCUS72",
        defaultMessage: "Product Settings",
        description: "configuration section label for product types and attributes",
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
          icon: <Attributes />,
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
        id: "Q/8Uby",
        defaultMessage: "Model Settings",
        description: "configuration section label for model types and attributes",
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
          icon: <Attributes />,
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
        id: "7GcWC8",
        defaultMessage: "Tax Settings",
        description: "configuration section label",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "EIULpW",
            defaultMessage: "Manage how your store charges tax",
          }),
          icon: <Taxes />,
          title: intl.formatMessage(sectionNames.taxes),
          url: taxConfigurationListUrl(),
          testId: "configuration-menu-taxes",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "UN+yTt",
        defaultMessage: "Staff Settings",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "RQUkVW",
            defaultMessage: "Manage your employees and their permissions",
          }),
          icon: <StaffMembers />,
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
          icon: <PermissionGroups />,
          permissions: [PermissionEnum.MANAGE_STAFF],
          title: intl.formatMessage(sectionNames.permissionGroups),
          url: permissionGroupListUrl(),
          testId: "configuration-menu-permission-groups",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "gTr0qE",
        defaultMessage: "Shipping Settings",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "zxs6G3",
            defaultMessage: "Manage how you ship out orders",
          }),
          icon: <ShippingMethods />,
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
          icon: <Warehouses />,
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          title: intl.formatMessage(sectionNames.warehouses),
          url: warehouseSection,
          testId: "configuration-menu-warehouses",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "MWSacl",
        defaultMessage: "Multichannel",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "8vJCJ4",
            defaultMessage: "Define and manage your sales channels",
          }),
          icon: <Channels />,
          permissions: [PermissionEnum.MANAGE_CHANNELS],
          title: intl.formatMessage(sectionNames.channels),
          url: channelsListUrl(),
          testId: "configuration-menu-channels",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "YZl6cv",
        defaultMessage: "Miscellaneous",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "5BajZK",
            defaultMessage: "View and update your site settings",
          }),
          icon: <SiteSettings />,
          permissions: [PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.siteSettings),
          url: siteSettingsUrl(),
          testId: "configuration-menu-site-settings",
        },
        {
          description: intl.formatMessage({
            id: "3fKAKV",
            defaultMessage: "Configure refunds and returns behavior",
          }),
          icon: <CreditCard />,
          permissions: [PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.refundsSettings),
          url: refundsSettingsPath,
          testId: "configuration-menu-refunds-settings",
        },
      ],
    },
  ];
}
