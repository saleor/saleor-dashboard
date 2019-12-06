import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { attributeListUrl } from "@saleor/attributes/urls";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import Attributes from "@saleor/icons/Attributes";
import Bot from "@saleor/icons/Bot";
import Navigation from "@saleor/icons/Navigation";
import Pages from "@saleor/icons/Pages";
import Plugins from "@saleor/icons/Plugins";
import ProductTypes from "@saleor/icons/ProductTypes";
import ShippingMethods from "@saleor/icons/ShippingMethods";
import SiteSettings from "@saleor/icons/SiteSettings";
import StaffMembers from "@saleor/icons/StaffMembers";
import Taxes from "@saleor/icons/Taxes";
import Webhooks from "@saleor/icons/Webhooks";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { menuListUrl } from "@saleor/navigation/urls";
import { pageListUrl } from "@saleor/pages/urls";
import { pluginListUrl } from "@saleor/plugins/urls";
import { productTypeListUrl } from "@saleor/productTypes/urls";
import { serviceListUrl } from "@saleor/services/urls";
import { shippingZonesListUrl } from "@saleor/shipping/urls";
import { siteSettingsUrl } from "@saleor/siteSettings/urls";
import { staffListUrl } from "@saleor/staff/urls";
import { taxSection } from "@saleor/taxes/urls";
import { PermissionEnum } from "@saleor/types/globalTypes";
import { webhookListUrl } from "@saleor/webhooks/urls";
import ConfigurationPage, { MenuSection } from "./ConfigurationPage";

export function createConfigurationMenu(intl: IntlShape): MenuSection[] {
  return [
    {
      label: intl.formatMessage({
        defaultMessage: "Attributes and Product Typess"
      }),
      menuItems: [
        {
          description: intl.formatMessage({
            defaultMessage: "Determine attributes used to create product types",
            id: "configurationMenuAttributes"
          }),
          icon: <Attributes fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_PRODUCTS,
          title: intl.formatMessage(sectionNames.attributes),
          url: attributeListUrl()
        },
        {
          description: intl.formatMessage({
            defaultMessage: "Define types of products you sell",
            id: "configurationMenuProductTypes"
          }),
          icon: <ProductTypes fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_PRODUCTS,
          title: intl.formatMessage(sectionNames.productTypes),
          url: productTypeListUrl()
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
            defaultMessage: "Manage how you ship out orders",
            id: "configurationMenuShipping"
          }),
          icon: <ShippingMethods fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_SHIPPING,
          title: intl.formatMessage(sectionNames.shipping),
          url: shippingZonesListUrl()
        },
        {
          description: intl.formatMessage({
            defaultMessage: "Manage how your store charges tax",
            id: "configurationMenuTaxes"
          }),
          icon: <Taxes fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_SETTINGS,
          title: intl.formatMessage(sectionNames.taxes),
          url: taxSection
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
          icon: <StaffMembers fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_STAFF,
          title: intl.formatMessage(sectionNames.staff),
          url: staffListUrl()
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
          icon: <Navigation fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_MENUS,
          title: intl.formatMessage(sectionNames.navigation),
          url: menuListUrl()
        },
        {
          description: intl.formatMessage({
            defaultMessage: "View and update your site settings",
            id: "configurationMenuSiteSettings"
          }),
          icon: <SiteSettings fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_SETTINGS,
          title: intl.formatMessage(sectionNames.siteSettings),
          url: siteSettingsUrl()
        },
        {
          description: intl.formatMessage({
            defaultMessage: "Manage and add additional pages",
            id: "configurationMenuPages"
          }),
          icon: <Pages fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_PAGES,
          title: intl.formatMessage(sectionNames.pages),
          url: pageListUrl()
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
          permission: PermissionEnum.MANAGE_PLUGINS,
          title: intl.formatMessage(sectionNames.plugins),
          url: pluginListUrl()
        },
        {
          description: intl.formatMessage({
            defaultMessage: "Manage external integrations accounts"
          }),
          icon: <Bot fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_SERVICE_ACCOUNTS,
          title: intl.formatMessage(sectionNames.serviceAccounts),
          url: serviceListUrl()
        },
        {
          description: intl.formatMessage({
            defaultMessage: "View and update your webhook and their settings"
          }),
          icon: <Webhooks fontSize="inherit" viewBox="0 0 44 44" />,
          permission: PermissionEnum.MANAGE_WEBHOOKS,
          title: intl.formatMessage(sectionNames.webhooks),
          url: webhookListUrl()
        }
      ]
    }
  ];
}

export const configurationMenuUrl = "/configuration/";

export const ConfigurationSection: React.FC = () => {
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
      />
    </>
  );
};
export default ConfigurationSection;
