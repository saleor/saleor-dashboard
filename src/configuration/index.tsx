import { attributeListUrl } from "@saleor/attributes/urls";
import { channelsListUrl } from "@saleor/channels/urls";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { APP_VERSION as dashboardVersion } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useShop from "@saleor/hooks/useShop";
import useUser from "@saleor/hooks/useUser";
import Attributes from "@saleor/icons/Attributes";
import Channels from "@saleor/icons/Channels";
import Navigation from "@saleor/icons/Navigation";
import Pages from "@saleor/icons/Pages";
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
import { pageListUrl } from "@saleor/pages/urls";
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
        id: "HP6m+q",
        defaultMessage: "Attributes and Product Types"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "19/lwV",
            defaultMessage: "Determine attributes used to create product types"
          }),
          icon: <Attributes fontSize="inherit" viewBox="0 0 44 44" />,
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
            id: "n0RwMK",
            defaultMessage: "Define types of products you sell"
          }),
          icon: <ProductTypes fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
          title: intl.formatMessage(sectionNames.productTypes),
          url: productTypeListUrl(),
          testId: "configurationMenuProductTypes"
        }
      ]
    },
    {
      label: intl.formatMessage({
        id: "jFrdB5",
        defaultMessage: "Product Settings"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "EIULpW",
            defaultMessage: "Manage how your store charges tax"
          }),
          icon: <Taxes fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.taxes),
          url: taxSection,
          testId: "configurationMenuTaxes"
        }
      ]
    },
    {
      label: intl.formatMessage({
        id: "UN+yTt",
        defaultMessage: "Staff Settings"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "RQUkVW",
            defaultMessage: "Manage your employees and their permissions"
          }),
          icon: <StaffMembers fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_STAFF],
          title: intl.formatMessage(sectionNames.staff),
          url: staffListUrl(),
          testId: "configurationMenuStaff"
        },
        {
          description: intl.formatMessage({
            id: "ivJ1qt",
            defaultMessage:
              "Manage your permission groups and their permissions"
          }),
          icon: <PermissionGroups fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_STAFF],
          title: intl.formatMessage(sectionNames.permissionGroups),
          url: permissionGroupListUrl(),
          testId: "configurationMenuPermissionGroups"
        }
      ]
    },
    {
      label: intl.formatMessage({
        id: "gTr0qE",
        defaultMessage: "Shipping Settings"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "zxs6G3",
            defaultMessage: "Manage how you ship out orders"
          }),
          icon: <ShippingMethods fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_SHIPPING],
          title: intl.formatMessage(sectionNames.shipping),
          url: shippingZonesListUrl(),
          testId: "configurationMenuShipping"
        },
        {
          description: intl.formatMessage({
            id: "5RmuD+",
            defaultMessage: "Manage and update your warehouse information"
          }),
          icon: <Warehouses fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          title: intl.formatMessage(sectionNames.warehouses),
          url: warehouseSection,
          testId: "configurationMenuWarehouses"
        }
      ]
    },
    {
      label: intl.formatMessage({
        id: "MWSacl",
        defaultMessage: "Multichannel"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "8vJCJ4",
            defaultMessage: "Define and manage your sales channels"
          }),
          icon: <Channels fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_CHANNELS],
          title: intl.formatMessage(sectionNames.channels),
          url: channelsListUrl(),
          testId: "configurationMenuChannels"
        }
      ]
    },
    {
      label: intl.formatMessage({
        id: "HjXnIf",
        defaultMessage: "Content Management"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "JPH/uP",
            defaultMessage: "Define types of content pages used in your store"
          }),
          icon: <PageTypes fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [
            PermissionEnum.MANAGE_PAGES,
            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES
          ],
          title: intl.formatMessage(sectionNames.pageTypes),
          url: pageTypeListUrl(),
          testId: "configurationMenuPageTypes"
        },
        {
          description: intl.formatMessage({
            id: "4CgHai",
            defaultMessage: "Manage and add additional pages"
          }),
          icon: <Pages fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_PAGES],
          title: intl.formatMessage(sectionNames.pages),
          url: pageListUrl(),
          testId: "configurationMenuPages"
        }
      ]
    },
    {
      label: intl.formatMessage({
        id: "YZl6cv",
        defaultMessage: "Miscellaneous"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            id: "hpMcW8",
            defaultMessage: "Define how users can navigate through your store"
          }),
          icon: <Navigation fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_MENUS],
          title: intl.formatMessage(sectionNames.navigation),
          url: menuListUrl(),
          testId: "configurationMenuNavigation"
        },
        {
          description: intl.formatMessage({
            id: "5BajZK",
            defaultMessage: "View and update your site settings"
          }),
          icon: <SiteSettings fontSize="inherit" viewBox="0 0 44 44" />,
          permissions: [PermissionEnum.MANAGE_SETTINGS],
          title: intl.formatMessage(sectionNames.siteSettings),
          url: siteSettingsUrl(),
          testId: "configurationMenuSiteSettings"
        },
        {
          description: intl.formatMessage({
            id: "m19JfL",
            defaultMessage: "View and update your plugins and their settings."
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

  const navigate = useNavigator();
  const user = useUser();
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.configuration)} />
      <ConfigurationPage
        menu={createConfigurationMenu(intl)}
        user={maybe(() => user.user)}
        onSectionClick={navigate}
        versionInfo={versions}
      />
    </>
  );
};
export default ConfigurationSection;
