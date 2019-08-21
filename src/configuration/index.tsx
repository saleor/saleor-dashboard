import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { attributeListUrl } from "@saleor/attributes/urls";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import Navigation from "@saleor/icons/Navigation";
import Pages from "@saleor/icons/Pages";
import Plugins from "@saleor/icons/Plugins";
import ProductTypes from "@saleor/icons/ProductTypes";
import ShippingMethods from "@saleor/icons/ShippingMethods";
import SiteSettings from "@saleor/icons/SiteSettings";
import StaffMembers from "@saleor/icons/StaffMembers";
import Taxes from "@saleor/icons/Taxes";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { menuListUrl } from "@saleor/navigation/urls";
import { pageListUrl } from "@saleor/pages/urls";
import { pluginsListUrl } from "@saleor/plugins/urls";
import { productTypeListUrl } from "@saleor/productTypes/urls";
import { shippingZonesListUrl } from "@saleor/shipping/urls";
import { siteSettingsUrl } from "@saleor/siteSettings/urls";
import { staffListUrl } from "@saleor/staff/urls";
import { taxSection } from "@saleor/taxes/urls";
import { PermissionEnum } from "@saleor/types/globalTypes";
import ConfigurationPage, { MenuItem } from "./ConfigurationPage";

<<<<<<< HEAD
export function createConfigurationMenu(intl: IntlShape): MenuItem[] {
  return [
    {
      description: intl.formatMessage({
        defaultMessage: "Determine attributes used to create product types",
        id: "configurationMenuAttributes"
      }),
      icon: <ProductTypes fontSize="inherit" viewBox="0 0 44 44" />,
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
    },
    {
      description: intl.formatMessage({
        defaultMessage: "Manage your employees and their permissions",
        id: "configurationMenuStaff"
      }),
      icon: <StaffMembers fontSize="inherit" viewBox="0 0 44 44" />,
      permission: PermissionEnum.MANAGE_STAFF,
      title: intl.formatMessage(sectionNames.staff),
      url: staffListUrl()
    },
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
      permission: PermissionEnum.MANAGE_PRODUCTS,
      title: intl.formatMessage(sectionNames.taxes),
      url: taxSection
    },
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
    }
  ];
}
=======
export const configurationMenu: MenuItem[] = [
  {
    description: i18n.t("Determine attributes used to create product types"),
    icon: <ProductTypes fontSize="inherit" viewBox="0 0 44 44" />,
    permission: PermissionEnum.MANAGE_PRODUCTS,
    title: i18n.t("Attributes"),
    url: attributeListUrl()
  },
  {
    description: i18n.t("Define types of products you sell"),
    icon: <ProductTypes fontSize="inherit" viewBox="0 0 44 44" />,
    permission: PermissionEnum.MANAGE_PRODUCTS,
    title: i18n.t("Product Types"),
    url: productTypeListUrl()
  },
  {
    description: i18n.t("Manage your employees and their permissions"),
    icon: <StaffMembers fontSize="inherit" viewBox="0 0 44 44" />,
    permission: PermissionEnum.MANAGE_STAFF,
    title: i18n.t("Staff Members"),
    url: staffListUrl()
  },
  {
    description: i18n.t("Manage how you ship out orders."),
    icon: <ShippingMethods fontSize="inherit" viewBox="0 0 44 44" />,
    permission: PermissionEnum.MANAGE_SHIPPING,
    title: i18n.t("Shipping Methods"),
    url: shippingZonesListUrl()
  },
  {
    description: i18n.t("Manage how your store charges tax"),
    icon: <Taxes fontSize="inherit" viewBox="0 0 44 44" />,
    permission: PermissionEnum.MANAGE_PRODUCTS,
    title: i18n.t("Taxes"),
    url: taxSection
  },
  {
    description: i18n.t("Define how users can navigate through your store"),
    icon: <Navigation fontSize="inherit" viewBox="0 0 44 44" />,
    permission: PermissionEnum.MANAGE_MENUS,
    title: i18n.t("Navigation"),
    url: menuListUrl()
  },
  {
    description: i18n.t("View and update your site settings"),
    icon: <SiteSettings fontSize="inherit" viewBox="0 0 44 44" />,
    permission: PermissionEnum.MANAGE_SETTINGS,
    title: i18n.t("Site Settings"),
    url: siteSettingsUrl()
  },
  {
    description: i18n.t("Manage and add additional pages"),
    icon: <Pages fontSize="inherit" viewBox="0 0 44 44" />,
    permission: PermissionEnum.MANAGE_PAGES,
    title: i18n.t("Pages"),
    url: pageListUrl()
  },
  {
    description: i18n.t("View and update your plugins and their settings."),
    icon: (
      <Plugins
        fontSize="inherit"
        viewBox="-8 -5 44 44"
        preserveAspectRatio="xMinYMin meet"
      />
    ),
    permission: PermissionEnum.MANAGE_SETTINGS,
    title: i18n.t("Plugins"),
    url: pluginsListUrl()
  }
];
>>>>>>> Add plugin page, plugin list view

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
