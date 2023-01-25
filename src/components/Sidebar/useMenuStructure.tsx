import { appsListPath } from "@dashboard/apps/urls";
import {
  extensionMountPoints,
  useExtensions,
} from "@dashboard/apps/useExtensions";
import { useUser } from "@dashboard/auth";
import { categoryListUrl } from "@dashboard/categories/urls";
import { collectionListUrl } from "@dashboard/collections/urls";
import { MARKETPLACE_URL } from "@dashboard/config";
import { configurationMenuUrl } from "@dashboard/configuration";
import { getConfigMenuItemsPermissions } from "@dashboard/configuration/utils";
import { customerListUrl } from "@dashboard/customers/urls";
import { saleListUrl, voucherListUrl } from "@dashboard/discounts/urls";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { marketplaceUrlResolver } from "@dashboard/marketplace/marketplace-url-resolver";
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
  TableEditIcon,
  TranslationsIcon,
  VouchersIcon,
} from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import { getMenuItemExtension, mapToExtensionsItems } from "./utils";

export interface MenuItem {
  label?: string;
  id: string;
  url?: string;
  permissions?: PermissionEnum[];
  type: "item" | "itemGroup" | "divider";
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: MenuItem[];
}

export function useMenuStructure() {
  const extensions = useExtensions(extensionMountPoints.NAVIGATION_SIDEBAR);
  const intl = useIntl();
  const { user } = useUser();

  const handleMenuItemClick = (id: string) => {
    const extension = getMenuItemExtension(extensions, id);
    if (extension) {
      extension.open();
      return;
    }
  };

  const appExtensionsHeaderItem: MenuItem = {
    id: "extensions",
    label: intl.formatMessage(sectionNames.appExtensions),
    type: "divider",
  };

  // This will be deleted when Marketplace is released
  // Consider this solution as temporary
  const getAppSection = (): MenuItem => {
    if (MARKETPLACE_URL) {
      return {
        icon: <MarketplaceIcon color="iconNeutralSubdued" />,
        label: intl.formatMessage(sectionNames.apps),
        permissions: [PermissionEnum.MANAGE_APPS],
        id: "apps_section",
        type: "itemGroup",
        children: [
          {
            label: intl.formatMessage(sectionNames.apps),
            id: "apps",
            url: appsListPath,
            type: "item",
          },
          {
            label: intl.formatMessage(sectionNames.marketplace),
            id: "marketplace-saleor-apps",
            url: marketplaceUrlResolver.getSaleorAppsDashboardPath(),
            type: "item",
          },
          {
            label: intl.formatMessage(sectionNames.appTemplateGallery),
            id: "marketplace-template-gallery",
            url: marketplaceUrlResolver.getTemplateGalleryDashboardPath(),
            type: "item",
          },
        ],
      };
    }

    return {
      icon: <MarketplaceIcon color="iconNeutralSubdued" />,
      label: intl.formatMessage(sectionNames.apps),
      permissions: [PermissionEnum.MANAGE_APPS],
      id: "apps",
      url: appsListPath,
      type: "item",
    };
  };

  const menuItems: MenuItem[] = [
    {
      icon: <HomeIcon color="iconNeutralSubdued" />,
      label: intl.formatMessage(sectionNames.home),
      id: "home",
      url: "/",
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
        ...mapToExtensionsItems(
          extensions.NAVIGATION_CATALOG,
          appExtensionsHeaderItem,
        ),
      ],
      icon: <ProductsIcons color="iconNeutralSubdued" />,
      label: intl.formatMessage(commonMessages.catalog),
      permissions: [
        PermissionEnum.MANAGE_GIFT_CARD,
        PermissionEnum.MANAGE_PRODUCTS,
      ],
      id: "catalogue",
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
      icon: <OrdersIcon color="iconNeutralSubdued" />,
      label: intl.formatMessage(sectionNames.orders),
      permissions: [PermissionEnum.MANAGE_ORDERS],
      id: "orders",
      type: "itemGroup",
    },
    {
      children: extensions.NAVIGATION_CUSTOMERS.length > 0 && [
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
      icon: <CustomersIcon color="iconNeutralSubdued" />,
      label: intl.formatMessage(sectionNames.customers),
      permissions: [PermissionEnum.MANAGE_USERS],
      id: "customers",
      url: customerListUrl(),
      type: extensions.NAVIGATION_CUSTOMERS.length > 0 ? "itemGroup" : "item",
    },

    {
      children: [
        {
          label: intl.formatMessage(sectionNames.sales),
          id: "sales",
          url: saleListUrl(),
          type: "item",
        },
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
      icon: <VouchersIcon color="iconNeutralSubdued" />,
      label: intl.formatMessage(commonMessages.discounts),
      permissions: [PermissionEnum.MANAGE_DISCOUNTS],
      id: "discounts",
      type: "itemGroup",
    },
    {
      children: extensions.NAVIGATION_PAGES.length > 0 && [
        {
          label: intl.formatMessage(sectionNames.pages),
          permissions: [PermissionEnum.MANAGE_PAGES],
          id: "pages",
          url: pageListPath,
          type: "item",
        },
        ...mapToExtensionsItems(
          extensions.NAVIGATION_PAGES,
          appExtensionsHeaderItem,
        ),
      ],
      icon: <TableEditIcon color="iconNeutralSubdued" />,
      label: intl.formatMessage(sectionNames.pages),
      permissions: [PermissionEnum.MANAGE_PAGES],
      id: "pages",
      url: pageListPath,
      type: extensions.NAVIGATION_PAGES.length > 0 ? "itemGroup" : "item",
    },
    getAppSection(),
    {
      children: extensions.NAVIGATION_TRANSLATIONS.length > 0 && [
        {
          label: intl.formatMessage(sectionNames.translations),
          permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
          id: "translations",
          url: languageListUrl,
          type: "item",
        },
        ...mapToExtensionsItems(
          extensions.NAVIGATION_TRANSLATIONS,
          appExtensionsHeaderItem,
        ),
      ],
      icon: <TranslationsIcon color="iconNeutralSubdued" />,
      label: intl.formatMessage(sectionNames.translations),
      permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
      id: "translations",
      url: languageListUrl,
      type:
        extensions.NAVIGATION_TRANSLATIONS.length > 0 ? "itemGroup" : "item",
    },
    {
      icon: <ConfigurationIcon color="iconNeutralSubdued" />,
      label: intl.formatMessage(sectionNames.configuration),
      permissions: getConfigMenuItemsPermissions(intl),
      id: "configure",
      url: configurationMenuUrl,
      type: "item",
    },
  ];

  const isMenuItemPermitted = (menuItem: MenuItem) => {
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

  const getFilteredMenuItems = (menuItems: MenuItem[]) =>
    menuItems.filter(isMenuItemPermitted);

  return [
    menuItems.reduce((resultItems: MenuItem[], menuItem: MenuItem) => {
      if (!isMenuItemPermitted(menuItem)) {
        return resultItems;
      }
      const { children } = menuItem;
      const filteredChildren = children
        ? getFilteredMenuItems(children)
        : undefined;

      return [...resultItems, { ...menuItem, children: filteredChildren }];
    }, []),
    handleMenuItemClick,
  ] as const;
}
