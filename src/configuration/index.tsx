// @ts-strict-ignore
import { attributeListUrl } from "@dashboard/attributes/urls";
import { useUser } from "@dashboard/auth";
import { channelsListUrl } from "@dashboard/channels/urls";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { APP_VERSION as dashboardVersion } from "@dashboard/config";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import { PermissionEnum } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";
import Attributes from "@dashboard/icons/Attributes";
import Channels from "@dashboard/icons/Channels";
import Miscellaneous from "@dashboard/icons/Miscellaneous";
import Navigation from "@dashboard/icons/Navigation";
import PageTypes from "@dashboard/icons/PageTypes";
import PermissionGroups from "@dashboard/icons/PermissionGroups";
import Plugins from "@dashboard/icons/Plugins";
import ProductTypes from "@dashboard/icons/ProductTypes";
import ShippingMethods from "@dashboard/icons/ShippingMethods";
import SiteSettings from "@dashboard/icons/SiteSettings";
import StaffMembers from "@dashboard/icons/StaffMembers";
import Taxes from "@dashboard/icons/Taxes";
import Warehouses from "@dashboard/icons/Warehouses";
import { sectionNames } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import { menuListUrl } from "@dashboard/navigation/urls";
import { pageTypeListUrl } from "@dashboard/pageTypes/urls";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { pluginListUrl } from "@dashboard/plugins/urls";
import { productTypeListUrl } from "@dashboard/productTypes/urls";
import { shippingZonesListUrl } from "@dashboard/shipping/urls";
import { siteSettingsUrl } from "@dashboard/siteSettings/urls";
import { staffListUrl } from "@dashboard/staff/urls";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { warehouseSection } from "@dashboard/warehouses/urls";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { ConfigurationPage } from "./ConfigurationPage";
import { MenuSection } from "./types";

export function createConfigurationMenu(intl: IntlShape): MenuSection[] {
  return [
    {
      label: intl.formatMessage({
        id: "HP6m+q",
        defaultMessage: "Attributes and Product Types",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "19/lwV",
            defaultMessage: "Determine attributes used to create product types",
          }),
          icon: <Attributes />,
          requireAllPermissions: true,
          permissions: [
            PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
          ],
          title: intl.formatMessage(sectionNames.attributes),
          url: attributeListUrl(),
          testId: "configuration-menu-attributes",
        },
        {
          description: intl.formatMessage({
            id: "n0RwMK",
            defaultMessage: "Define types of products you sell",
          }),
          icon: <ProductTypes />,
          permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
          title: intl.formatMessage(sectionNames.productTypes),
          url: productTypeListUrl(),
          testId: "configuration-menu-product-types",
        },
      ],
    },
    {
      label: intl.formatMessage({
        id: "jFrdB5",
        defaultMessage: "Product Settings",
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
        id: "HjXnIf",
        defaultMessage: "Content Management",
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "JPH/uP",
            defaultMessage: "Define types of content pages used in your store",
          }),
          icon: <PageTypes />,
          permissions: [
            PermissionEnum.MANAGE_PAGES,
            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
          ],
          title: intl.formatMessage(sectionNames.pageTypes),
          url: pageTypeListUrl(),
          testId: "configuration-menu-page-types",
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
            id: "hpMcW8",
            defaultMessage: "Define how users can navigate through your store",
          }),
          icon: <Navigation />,
          permissions: [PermissionEnum.MANAGE_MENUS],
          title: intl.formatMessage(sectionNames.navigation),
          url: menuListUrl(),
          testId: "configuration-menu-navigation",
        },
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
            id: "m19JfL",
            defaultMessage: "View and update your plugins and their settings.",
          }),
          icon: (
            <Plugins fontSize="inherit" viewBox="-8 -5 44 44" preserveAspectRatio="xMinYMin meet" />
          ),
          permissions: [PermissionEnum.MANAGE_PLUGINS],
          title: intl.formatMessage(sectionNames.plugins),
          url: pluginListUrl(),
          testId: "configuration-plugins-pages",
        },
        {
          description: intl.formatMessage({
            id: "Zz67wc",
            defaultMessage: "View and update your webhooks and events.",
          }),
          icon: <Miscellaneous />,
          title: intl.formatMessage(sectionNames.webhooksAndEvents),
          url: CustomAppUrls.resolveAppListUrl(),
          testId: "configuration-menu-webhooks-and-events",
        },
      ],
    },
  ];
}

export const configurationMenuUrl = "/configuration/";

export const ConfigurationSection = () => {
  const shop = useShop();
  const versions = {
    dashboardVersion,
    coreVersion: shop?.version ?? "",
  };
  const user = useUser();
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.configuration)} />
      <ConfigurationPage
        menu={createConfigurationMenu(intl)}
        user={maybe(() => user.user)}
        versionInfo={versions}
      />
    </>
  );
};
export default ConfigurationSection;
