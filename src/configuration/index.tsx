import { attributeListUrl } from "@saleor/attributes/urls";
import { useUser } from "@saleor/auth";
import { channelsListUrl } from "@saleor/channels/urls";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { APP_VERSION as dashboardVersion } from "@saleor/config";
import { PermissionEnum } from "@saleor/graphql";
import useShop from "@saleor/hooks/useShop";
import Attributes from "@saleor/icons/Attributes";
import Channels from "@saleor/icons/Channels";
import Navigation from "@saleor/icons/Navigation";
import PageTypes from "@saleor/icons/PageTypes";
import PermissionGroups from "@saleor/icons/PermissionGroups";
import Plugins from "@saleor/icons/Plugins";
import ProductTypes from "@saleor/icons/ProductTypes";
import ShippingMethods from "@saleor/icons/ShippingMethods";
import SiteSettings from "@saleor/icons/SiteSettings";
import StaffMembers from "@saleor/icons/StaffMembers";
import Taxes from "@saleor/icons/Taxes";
import Warehouses from "@saleor/icons/Warehouses";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { menuListUrl } from "@saleor/navigation/urls";
import { pageTypeListUrl } from "@saleor/pageTypes/urls";
import { permissionGroupListUrl } from "@saleor/permissionGroups/urls";
import { pluginListUrl } from "@saleor/plugins/urls";
import { productTypeListUrl } from "@saleor/productTypes/urls";
import { shippingZonesListUrl } from "@saleor/shipping/urls";
import { siteSettingsUrl } from "@saleor/siteSettings/urls";
import { staffListUrl } from "@saleor/staff/urls";
import { taxSection } from "@saleor/taxes/urls";
import { warehouseSection } from "@saleor/warehouses/urls";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import ConfigurationPage, { MenuSection } from "./ConfigurationPage";

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
          permissions: [PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.taxes),
          url: taxSection,
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
            defaultMessage:
              "Manage your permission groups and their permissions",
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
            <Plugins
              fontSize="inherit"
              viewBox="-8 -5 44 44"
              preserveAspectRatio="xMinYMin meet"
            />
          ),
          permissions: [PermissionEnum.MANAGE_PLUGINS],
          title: intl.formatMessage(sectionNames.plugins),
          url: pluginListUrl(),
          testId: "configuration-plugins-pages",
        },
      ],
    },
  ];
}

export const configurationMenuUrl = "/configuration/";

export const ConfigurationSection: React.FC = () => {
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
