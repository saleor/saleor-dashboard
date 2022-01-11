import { attributeListUrl } from "@saleor/attributes/urls";
import { useUser } from "@saleor/auth";
import { channelsListUrl } from "@saleor/channels/urls";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { APP_VERSION as dashboardVersion } from "@saleor/config";
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
import { PermissionEnum } from "@saleor/types/globalTypes";
import { warehouseSection } from "@saleor/warehouses/urls";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import ConfigurationPage, { MenuSection } from "./ConfigurationPage";

export function createConfigurationMenu(intl: IntlShape): MenuSection[] {
  return [
    {
      label: intl.formatMessage({
        defaultMessage: "Attributes and Product Types"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            defaultMessage: "Determine attributes used to create product types",
            id: "configurationMenuAttributes"
          }),
          icon: <Attributes />,
          permissions: [
            PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
          ],
          title: intl.formatMessage(sectionNames.attributes),
          url: attributeListUrl(),
          testId: "configurationMenuAttributes"
        },
        {
          description: intl.formatMessage({
            defaultMessage: "Define types of products you sell",
            id: "configurationMenuProductTypes"
          }),
          icon: <ProductTypes />,
          permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
          title: intl.formatMessage(sectionNames.productTypes),
          url: productTypeListUrl(),
          testId: "configurationMenuProductTypes"
        }
      ]
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Product Settings"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            defaultMessage: "Manage how your store charges tax",
            id: "configurationMenuTaxes"
          }),
          icon: <Taxes />,
          permissions: [PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.taxes),
          url: taxSection,
          testId: "configurationMenuTaxes"
        }
      ]
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Staff Settings"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            defaultMessage: "Manage your employees and their permissions",
            id: "configurationMenuStaff"
          }),
          icon: <StaffMembers />,
          permissions: [PermissionEnum.MANAGE_STAFF],
          title: intl.formatMessage(sectionNames.staff),
          url: staffListUrl(),
          testId: "configurationMenuStaff"
        },
        {
          description: intl.formatMessage({
            defaultMessage:
              "Manage your permission groups and their permissions",
            id: "configurationMenuPermissionGroups"
          }),
          icon: <PermissionGroups />,
          permissions: [PermissionEnum.MANAGE_STAFF],
          title: intl.formatMessage(sectionNames.permissionGroups),
          url: permissionGroupListUrl(),
          testId: "configurationMenuPermissionGroups"
        }
      ]
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Shipping Settings"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            defaultMessage: "Manage how you ship out orders",
            id: "configurationMenuShipping"
          }),
          icon: <ShippingMethods />,
          permissions: [PermissionEnum.MANAGE_SHIPPING],
          title: intl.formatMessage(sectionNames.shipping),
          url: shippingZonesListUrl(),
          testId: "configurationMenuShipping"
        },
        {
          description: intl.formatMessage({
            defaultMessage: "Manage and update your warehouse information",
            id: "configurationMenuWarehouses"
          }),
          icon: <Warehouses />,
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          title: intl.formatMessage(sectionNames.warehouses),
          url: warehouseSection,
          testId: "configurationMenuWarehouses"
        }
      ]
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Multichannel"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            defaultMessage: "Define and manage your sales channels",
            id: "configurationMenuChannels"
          }),
          icon: <Channels />,
          permissions: [PermissionEnum.MANAGE_CHANNELS],
          title: intl.formatMessage(sectionNames.channels),
          url: channelsListUrl(),
          testId: "configurationMenuChannels"
        }
      ]
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Content Management"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            defaultMessage: "Define types of content pages used in your store",
            id: "configurationMenuPageTypes"
          }),
          icon: <PageTypes />,
          permissions: [
            PermissionEnum.MANAGE_PAGES,
            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
          ],
          title: intl.formatMessage(sectionNames.pageTypes),
          url: pageTypeListUrl(),
          testId: "configurationMenuPageTypes"
        }
      ]
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Miscellaneous"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            defaultMessage: "Define how users can navigate through your store",
            id: "configurationMenuNavigation"
          }),
          icon: <Navigation />,
          permissions: [PermissionEnum.MANAGE_MENUS],
          title: intl.formatMessage(sectionNames.navigation),
          url: menuListUrl(),
          testId: "configurationMenuNavigation"
        },
        {
          description: intl.formatMessage({
            defaultMessage: "View and update your site settings",
            id: "configurationMenuSiteSettings"
          }),
          icon: <SiteSettings />,
          permissions: [PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.siteSettings),
          url: siteSettingsUrl(),
          testId: "configurationMenuSiteSettings"
        },
        {
          description: intl.formatMessage({
            defaultMessage: "View and update your plugins and their settings.",
            id: "configurationPluginsPages"
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
          testId: "configurationPluginsPages"
        }
      ]
    }
  ];
}

export const configurationMenuUrl = "/configuration/";

export const ConfigurationSection: React.FC = () => {
  const { version: coreVersion } = useShop();
  const versions = {
    dashboardVersion,
    coreVersion
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
