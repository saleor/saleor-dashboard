import { useUser } from "@dashboard/auth";
import { categoryListUrl } from "@dashboard/categories/urls";
import { collectionListUrl } from "@dashboard/collections/urls";
import { configurationMenuUrl } from "@dashboard/configuration";
import { getConfigMenuItemsPermissions } from "@dashboard/configuration/utils";
import { customerListUrl } from "@dashboard/customers/urls";
import { saleListUrl, voucherListUrl } from "@dashboard/discounts/urls";
import { SidebarAppAlert } from "@dashboard/extensions/components/AppAlerts/SidebarAppAlert";
import { useAppsAlert } from "@dashboard/extensions/components/AppAlerts/useAppsAlert";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  extensionsAppSection,
  extensionsCustomSection,
  ExtensionsPaths,
  extensionsPluginSection,
} from "@dashboard/extensions/urls";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { ConfigurationIcon } from "@dashboard/icons/Configuration";
import { CustomersIcon } from "@dashboard/icons/Customers";
import { DiscountsIcon } from "@dashboard/icons/Discounts";
import { HomeIcon } from "@dashboard/icons/Home";
import { MarketplaceIcon } from "@dashboard/icons/Marketplace";
import ModelingIcon from "@dashboard/icons/Modeling";
import { OrdersIcon } from "@dashboard/icons/Orders";
import { ProductsIcon } from "@dashboard/icons/Products";
import { TranslationsIcon } from "@dashboard/icons/Translations";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { ripplePagesAreModels } from "@dashboard/modeling/ripples/pagesAreModels";
import { pageListPath } from "@dashboard/modeling/urls";
import { pageTypeListUrl } from "@dashboard/modelTypes/urls";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { productListUrl } from "@dashboard/products/urls";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { SearchShortcut } from "@dashboard/search/SearchShortcut";
import { menuListUrl } from "@dashboard/structures/urls";
import { languageListUrl } from "@dashboard/translations/urls";
import { Box, SearchIcon } from "@saleor/macaw-ui-next";
import isEmpty from "lodash/isEmpty";
import * as React from "react";
import { useIntl } from "react-intl";

import { SidebarMenuItem } from "../types";
import { mapToExtensionsItems } from "../utils";

export function useMenuStructure() {
  const { handleAppsListItemClick, hasNewFailedAttempts } = useAppsAlert();

  const extensions = useExtensions(extensionMountPoints.NAVIGATION_SIDEBAR);
  const intl = useIntl();
  const { user } = useUser();

  const appExtensionsHeaderItem: SidebarMenuItem = {
    id: "extensions",
    label: intl.formatMessage(sectionNames.appExtensions),
    type: "divider",
    paddingY: 1.5,
  };

  const getExtensionsSection = (): SidebarMenuItem => ({
    icon: renderIcon(<MarketplaceIcon />),
    label: intl.formatMessage(sectionNames.extensions),
    permissions: [],
    id: "installed-extensions",
    url: ExtensionsPaths.installedExtensions,
    type: "itemGroup",
    endAdornment: <SidebarAppAlert hasNewFailedAttempts={hasNewFailedAttempts} />,
    onClick: () => handleAppsListItemClick(new Date().toISOString()),
    children: [
      {
        label: (
          <Box display="flex" alignItems="center" gap={3}>
            {intl.formatMessage(sectionNames.installedExtensions)}
            <SidebarAppAlert hasNewFailedAttempts={hasNewFailedAttempts} small />
          </Box>
        ),
        id: "installed-extensions",
        url: ExtensionsPaths.installedExtensions,
        matchUrls: [
          ExtensionsPaths.installedExtensions,
          extensionsCustomSection,
          extensionsAppSection,
          extensionsPluginSection,
        ],
        permissions: [],
        type: "item",
      },
      {
        label: intl.formatMessage(sectionNames.exploreExtensions),
        id: "explore-extensions",
        url: ExtensionsPaths.exploreExtensions,
        permissions: [],
        type: "item",
      },
    ],
  });

  const menuItems: SidebarMenuItem[] = [
    {
      icon: renderIcon(<HomeIcon />),
      label: intl.formatMessage(sectionNames.home),
      id: "home",
      url: "/",
      type: "item",
    },
    {
      icon: renderIcon(<SearchIcon />),
      label: (
        <Box display="flex" alignItems="center" gap={2}>
          {intl.formatMessage(sectionNames.search)}
          <SearchShortcut />
        </Box>
      ),
      id: "search",
      url: "/search",
      permissions: [
        PermissionEnum.MANAGE_PRODUCTS,
        PermissionEnum.MANAGE_PAGES,
        PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
        PermissionEnum.MANAGE_ORDERS,
      ],
      type: "item",
    },
    {
      children: [
        {
          label: intl.formatMessage(sectionNames.products),
          id: "products",
          url: productListUrl(),
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.categories),
          id: "categories",
          url: categoryListUrl(),
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.collections),
          id: "collections",
          url: collectionListUrl(),
          permissions: [PermissionEnum.MANAGE_PRODUCTS],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.giftCards),
          id: "giftCards",
          url: giftCardListUrl(),
          permissions: [PermissionEnum.MANAGE_GIFT_CARD],
          type: "item",
        },
        ...mapToExtensionsItems(extensions.NAVIGATION_CATALOG, appExtensionsHeaderItem),
      ],
      icon: renderIcon(<ProductsIcon />),
      url: productListUrl(),
      label: intl.formatMessage(sectionNames.catalog),
      permissions: [PermissionEnum.MANAGE_GIFT_CARD, PermissionEnum.MANAGE_PRODUCTS],
      id: "products",
      type: "itemGroup",
    },
    {
      children: [
        {
          label: intl.formatMessage(sectionNames.orders),
          permissions: [PermissionEnum.MANAGE_ORDERS],
          id: "orders",
          url: orderListUrl(),
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.draftOrders),
          permissions: [PermissionEnum.MANAGE_ORDERS],
          id: "order-drafts",
          url: orderDraftListUrl(),
          type: "item",
        },
        ...mapToExtensionsItems(extensions.NAVIGATION_ORDERS, appExtensionsHeaderItem),
      ],
      icon: renderIcon(<OrdersIcon />),
      label: intl.formatMessage(sectionNames.fulfillment),
      permissions: [PermissionEnum.MANAGE_ORDERS],
      id: "orders",
      url: orderListUrl(),
      type: "itemGroup",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_CUSTOMERS)
        ? [
            {
              label: intl.formatMessage(sectionNames.customers),
              permissions: [PermissionEnum.MANAGE_USERS],
              id: "customers",
              url: customerListUrl(),
              type: "item",
            },
            ...mapToExtensionsItems(extensions.NAVIGATION_CUSTOMERS, appExtensionsHeaderItem),
          ]
        : undefined,
      icon: renderIcon(<CustomersIcon />),
      label: intl.formatMessage(sectionNames.customers),
      permissions: [PermissionEnum.MANAGE_USERS],
      id: "customers",
      url: customerListUrl(),
      type: !isEmpty(extensions.NAVIGATION_CUSTOMERS) ? "itemGroup" : "item",
    },
    {
      children: [
        {
          label: intl.formatMessage(sectionNames.promotions),
          id: "promotions",
          url: saleListUrl(),
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.vouchers),
          id: "vouchers",
          url: voucherListUrl(),
          type: "item",
        },
        ...mapToExtensionsItems(extensions.NAVIGATION_DISCOUNTS, appExtensionsHeaderItem),
      ],
      icon: renderIcon(<DiscountsIcon />),
      label: intl.formatMessage(commonMessages.discounts),
      permissions: [PermissionEnum.MANAGE_DISCOUNTS],
      url: saleListUrl(),
      id: "discounts",
      type: "itemGroup",
    },
    {
      children: [
        {
          label: intl.formatMessage(sectionNames.models),
          id: "models",
          url: pageListPath,
          permissions: [PermissionEnum.MANAGE_PAGES],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.modelTypes),
          id: "model-types",
          url: pageTypeListUrl(),
          permissions: [
            PermissionEnum.MANAGE_PAGES,
            PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
          ],
          type: "item",
        },
        {
          label: intl.formatMessage(sectionNames.structures),
          id: "structures",
          url: menuListUrl(),
          permissions: [PermissionEnum.MANAGE_MENUS],
          type: "item",
        },
        ...mapToExtensionsItems(extensions.NAVIGATION_PAGES, appExtensionsHeaderItem),
      ],
      icon: renderIcon(<ModelingIcon />),
      label: intl.formatMessage(sectionNames.modeling),
      permissions: [PermissionEnum.MANAGE_PAGES, PermissionEnum.MANAGE_MENUS],
      id: "modeling",
      url: pageListPath,
      endAdornment: <Ripple model={ripplePagesAreModels} />,
      type: "itemGroup",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_TRANSLATIONS)
        ? [...mapToExtensionsItems(extensions.NAVIGATION_TRANSLATIONS, appExtensionsHeaderItem)]
        : undefined,
      icon: renderIcon(<TranslationsIcon />),
      label: intl.formatMessage(sectionNames.translations),
      permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
      id: "translations",
      url: languageListUrl,
      type: !isEmpty(extensions.NAVIGATION_TRANSLATIONS) ? "itemGroup" : "item",
    },
    getExtensionsSection(),
    {
      icon: renderIcon(<ConfigurationIcon />),
      label: intl.formatMessage(sectionNames.configuration),
      permissions: getConfigMenuItemsPermissions(intl),
      id: "configure",
      url: configurationMenuUrl,
      type: "item",
    },
  ];
  const isMenuItemPermitted = (menuItem: SidebarMenuItem) => {
    const userPermissions = (user?.userPermissions || []).map(permission => permission.code);

    if (!menuItem?.permissions || menuItem?.permissions?.length < 1) {
      return true;
    }

    return menuItem.permissions.some(permission => userPermissions.includes(permission));
  };
  const getFilteredMenuItems = (menuItems: SidebarMenuItem[]) =>
    menuItems.filter(isMenuItemPermitted);

  return menuItems.reduce((resultItems: SidebarMenuItem[], menuItem: SidebarMenuItem) => {
    if (!isMenuItemPermitted(menuItem)) {
      return resultItems;
    }

    const { children } = menuItem;
    const filteredChildren = children ? getFilteredMenuItems(children) : undefined;

    return [...resultItems, { ...menuItem, children: filteredChildren }];
  }, []);
}

function renderIcon(icon: React.ReactNode) {
  return (
    <Box color="default2" __width={20} __height={20}>
      {icon}
    </Box>
  );
}
