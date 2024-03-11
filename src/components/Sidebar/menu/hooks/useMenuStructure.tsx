// @ts-strict-ignore
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
import { commonMessages, sectionNames } from "@dashboard/intl";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { pageListPath } from "@dashboard/pages/urls";
import { productListUrl } from "@dashboard/products/urls";
import { languageListUrl } from "@dashboard/translations/urls";
import {
  ConfigurationIcon,
  CustomersIcon,
  HomeIcon,
  MarketplaceIcon,
  OrdersIcon,
  ProductsIcons,
  StorefrontIcon,
  TranslationsIcon,
  VouchersIcon,
} from "@saleor/macaw-ui-next";
import isEmpty from "lodash/isEmpty";
import React from "react";
import { useIntl } from "react-intl";

import { SidebarMenuItem } from "../types";
import { mapToExtensionsItems } from "../utils";

const iconSettings = {
  color: "default2",
  size: "medium",
} as const;

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
    icon: <MarketplaceIcon {...iconSettings} />,
    label: intl.formatMessage(sectionNames.apps),
    permissions: [],
    id: "apps",
    url: AppPaths.appListPath,
    type: "item",
  });

  const menuItems: SidebarMenuItem[] = [
    {
      icon: <HomeIcon {...iconSettings} />,
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
      icon: <ProductsIcons {...iconSettings} />,
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
      icon: <OrdersIcon {...iconSettings} />,
      label: intl.formatMessage(sectionNames.orders),
      permissions: [PermissionEnum.MANAGE_ORDERS],
      id: "orders",
      url: orderListUrl(),
      type: "itemGroup",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_CUSTOMERS) && [
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
      ],
      icon: <CustomersIcon {...iconSettings} />,
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
      icon: <VouchersIcon {...iconSettings} />,
      label: intl.formatMessage(commonMessages.discounts),
      permissions: [PermissionEnum.MANAGE_DISCOUNTS],
      url: saleListUrl(),
      id: "discounts",
      type: "itemGroup",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_PAGES) && [
        ...mapToExtensionsItems(
          extensions.NAVIGATION_PAGES,
          appExtensionsHeaderItem,
        ),
      ],
      icon: <StorefrontIcon {...iconSettings} />,
      label: intl.formatMessage(sectionNames.content),
      permissions: [PermissionEnum.MANAGE_PAGES],
      id: "pages",
      url: pageListPath,
      type: !isEmpty(extensions.NAVIGATION_PAGES) ? "itemGroup" : "item",
    },
    {
      children: !isEmpty(extensions.NAVIGATION_TRANSLATIONS) && [
        ...mapToExtensionsItems(
          extensions.NAVIGATION_TRANSLATIONS,
          appExtensionsHeaderItem,
        ),
      ],
      icon: <TranslationsIcon {...iconSettings} />,
      label: intl.formatMessage(sectionNames.translations),
      permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
      id: "translations",
      url: languageListUrl,
      type: !isEmpty(extensions.NAVIGATION_TRANSLATIONS) ? "itemGroup" : "item",
    },
    getAppSection(),
    {
      icon: <ConfigurationIcon {...iconSettings} />,
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
