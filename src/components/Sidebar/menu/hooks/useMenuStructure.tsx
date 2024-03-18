import {
  extensionMountPoints,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import { AppPaths } from "@dashboard/apps/urls";
import { useUser } from "@dashboard/auth";
import { categoryListUrl } from "@dashboard/categories/urls";
import { collectionListUrl } from "@dashboard/collections/urls";
import { configurationMenuUrl } from "@dashboard/configuration";
import { getConfigMenuItemsPermissions } from "@dashboard/configuration/utils";
import { customerListUrl } from "@dashboard/customers/urls";
import { saleListUrl, voucherListUrl } from "@dashboard/discounts/urls";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { ConfigurationIcon } from "@dashboard/icons/Configuration";
import { ContentsIcon } from "@dashboard/icons/Contents";
import { CustomersIcon } from "@dashboard/icons/Customers";
import { DiscountsIcon } from "@dashboard/icons/Discounts";
import { HomeIcon } from "@dashboard/icons/Home";
import { MarketplaceIcon } from "@dashboard/icons/Marketplace";
import { OrdersIcon } from "@dashboard/icons/Orders";
import { ProductsIcon } from "@dashboard/icons/Products";
import { TranslationsIcon } from "@dashboard/icons/Translations";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { pageListPath } from "@dashboard/pages/urls";
import { productListUrl } from "@dashboard/products/urls";
import { languageListUrl } from "@dashboard/translations/urls";
import { Box } from "@saleor/macaw-ui-next";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { useIntl } from "react-intl";

import { SidebarMenuItem } from "../types";
import { mapToExtensionsItems } from "../utils";

export function useMenuStructure() {
  const extensions = useExtensions(extensionMountPoints.NAVIGATION_SIDEBAR);
  const intl = useIntl();
  const { user } = useUser();

  const appExtensionsHeaderItem: SidebarMenuItem = {
    id: "extensions",
    label: intl.formatMessage(sectionNames.appExtensions),
    type: "divider",
    paddingY: 1.5,
  };

  const getAppSection = (): SidebarMenuItem => ({
    icon: renderIcon(<MarketplaceIcon />),
    label: intl.formatMessage(sectionNames.apps),
    permissions: [PermissionEnum.MANAGE_APPS],
    id: "apps",
    url: AppPaths.appListPath,
    type: "item",
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
      children: [
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
        ...mapToExtensionsItems(
          extensions.NAVIGATION_CATALOG,
          appExtensionsHeaderItem,
        ),
      ],
      icon: renderIcon(<ProductsIcon />),
      url: productListUrl(),
      label: intl.formatMessage(commonMessages.products),
      permissions: [
        PermissionEnum.MANAGE_GIFT_CARD,
        PermissionEnum.MANAGE_PRODUCTS,
      ],
      id: "products",
      type: "itemGroup",
    },
    {
      children: [
        {
          label: intl.formatMessage(commonMessages.drafts),
          permissions: [PermissionEnum.MANAGE_ORDERS],
          id: "order-drafts",
          url: orderDraftListUrl(),
          type: "item",
        },
        ...mapToExtensionsItems(
          extensions.NAVIGATION_ORDERS,
          appExtensionsHeaderItem,
        ),
      ],
      icon: renderIcon(<OrdersIcon />),
      label: intl.formatMessage(sectionNames.orders),
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
            ...mapToExtensionsItems(
              extensions.NAVIGATION_CUSTOMERS,
              appExtensionsHeaderItem,
            ),
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
          label: intl.formatMessage(sectionNames.vouchers),
          id: "vouchers",
          url: voucherListUrl(),
          type: "item",
        },
        ...mapToExtensionsItems(
          extensions.NAVIGATION_DISCOUNTS,
          appExtensionsHeaderItem,
        ),
      ],
      icon: renderIcon(<DiscountsIcon />),
      label: intl.formatMessage(commonMessages.discounts),
      permissions: [PermissionEnum.MANAGE_DISCOUNTS],
      url: saleListUrl(),
      id: "discounts",
      type: "itemGroup",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_PAGES)
        ? [
            ...mapToExtensionsItems(
              extensions.NAVIGATION_PAGES,
              appExtensionsHeaderItem,
            ),
          ]
        : undefined,
      icon: renderIcon(<ContentsIcon />),
      label: intl.formatMessage(sectionNames.content),
      permissions: [PermissionEnum.MANAGE_PAGES],
      id: "pages",
      url: pageListPath,
      type: !isEmpty(extensions.NAVIGATION_PAGES) ? "itemGroup" : "item",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_TRANSLATIONS)
        ? [
            ...mapToExtensionsItems(
              extensions.NAVIGATION_TRANSLATIONS,
              appExtensionsHeaderItem,
            ),
          ]
        : undefined,
      icon: renderIcon(<TranslationsIcon />),
      label: intl.formatMessage(sectionNames.translations),
      permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
      id: "translations",
      url: languageListUrl,
      type: !isEmpty(extensions.NAVIGATION_TRANSLATIONS) ? "itemGroup" : "item",
    },
    getAppSection(),
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
    const userPermissions = (user?.userPermissions || []).map(
      permission => permission.code,
    );
    if (!menuItem?.permissions || menuItem?.permissions?.length < 1) {
      return true;
    }
    return menuItem.permissions.some(permission =>
      userPermissions.includes(permission),
    );
  };

  const getFilteredMenuItems = (menuItems: SidebarMenuItem[]) =>
    menuItems.filter(isMenuItemPermitted);

  return menuItems.reduce(
    (resultItems: SidebarMenuItem[], menuItem: SidebarMenuItem) => {
      if (!isMenuItemPermitted(menuItem)) {
        return resultItems;
      }
      const { children } = menuItem;
      const filteredChildren = children
        ? getFilteredMenuItems(children)
        : undefined;

      return [...resultItems, { ...menuItem, children: filteredChildren }];
    },
    [],
  );
}

function renderIcon(icon: React.ReactNode) {
  return (
    <Box color="default2" __width={20} __height={20}>
      {icon}
    </Box>
  );
}
