import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import {
  AppExtensionMountEnum,
  ExtensionListQuery,
  PermissionEnum,
  useExtensionListQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { useExternalApp } from "../components/ExternalAppContext";
import { AppData } from "../components/ExternalAppContext/context";
import { AppDetailsUrlMountQueryParams } from "../urls";

export interface Extension {
  id: string;
  app: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>[0]["app"];
  accessToken: string;
  permissions: PermissionEnum[];
  label: string;
  mount: AppExtensionMountEnum;
  url: string;
  open: () => void;
}

export interface ExtensionWithParams extends Omit<Extension, "open"> {
  open: (params: AppDetailsUrlMountQueryParams) => void;
}

export const extensionMountPoints = {
  CATEGORY_LIST: [
    AppExtensionMountEnum.CATEGORY_OVERVIEW_CREATE,
    AppExtensionMountEnum.CATEGORY_OVERVIEW_MORE_ACTIONS,
  ],
  COLLECTION_LIST: [
    AppExtensionMountEnum.COLLECTION_OVERVIEW_CREATE,
    AppExtensionMountEnum.COLLECTION_OVERVIEW_MORE_ACTIONS,
  ],
  GIFT_CARD_LIST: [
    AppExtensionMountEnum.GIFT_CARD_OVERVIEW_CREATE,
    AppExtensionMountEnum.GIFT_CARD_OVERVIEW_MORE_ACTIONS,
  ],
  CUSTOMER_LIST: [
    AppExtensionMountEnum.CUSTOMER_OVERVIEW_CREATE,
    AppExtensionMountEnum.CUSTOMER_OVERVIEW_MORE_ACTIONS,
  ],
  PRODUCT_LIST: [
    AppExtensionMountEnum.PRODUCT_OVERVIEW_CREATE,
    AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS,
  ],
  ORDER_LIST: [
    AppExtensionMountEnum.ORDER_OVERVIEW_CREATE,
    AppExtensionMountEnum.ORDER_OVERVIEW_MORE_ACTIONS,
  ],
  DRAFT_ORDER_LIST: [
    AppExtensionMountEnum.DRAFT_ORDER_OVERVIEW_CREATE,
    AppExtensionMountEnum.DRAFT_ORDER_OVERVIEW_MORE_ACTIONS,
  ],
  DISCOUNT_LIST: [
    AppExtensionMountEnum.DISCOUNT_OVERVIEW_CREATE,
    AppExtensionMountEnum.DISCOUNT_OVERVIEW_MORE_ACTIONS,
  ],
  VOUCHER_LIST: [
    AppExtensionMountEnum.VOUCHER_OVERVIEW_CREATE,
    AppExtensionMountEnum.VOUCHER_OVERVIEW_MORE_ACTIONS,
  ],
  PAGE_LIST: [
    AppExtensionMountEnum.PAGE_OVERVIEW_CREATE,
    AppExtensionMountEnum.PAGE_OVERVIEW_MORE_ACTIONS,
  ],
  PAGE_TYPE_LIST: [
    AppExtensionMountEnum.PAGE_TYPE_OVERVIEW_CREATE,
    AppExtensionMountEnum.PAGE_TYPE_OVERVIEW_MORE_ACTIONS,
  ],
  MENU_LIST: [
    AppExtensionMountEnum.MENU_OVERVIEW_CREATE,
    AppExtensionMountEnum.MENU_OVERVIEW_MORE_ACTIONS,
  ],
  COLLECTION_DETAILS: [AppExtensionMountEnum.COLLECTION_DETAILS_MORE_ACTIONS],
  CATEGORY_DETAILS: [AppExtensionMountEnum.CATEGORY_DETAILS_MORE_ACTIONS],
  GIFT_CARD_DETAILS: [AppExtensionMountEnum.GIFT_CARD_DETAILS_MORE_ACTIONS],
  CUSTOMER_DETAILS: [AppExtensionMountEnum.CUSTOMER_DETAILS_MORE_ACTIONS],
  ORDER_DETAILS: [AppExtensionMountEnum.ORDER_DETAILS_MORE_ACTIONS],
  DRAFT_ORDER_DETAILS: [AppExtensionMountEnum.DRAFT_ORDER_DETAILS_MORE_ACTIONS],
  PRODUCT_DETAILS: [AppExtensionMountEnum.PRODUCT_DETAILS_MORE_ACTIONS],
  DISCOUNT_DETAILS: [AppExtensionMountEnum.DISCOUNT_DETAILS_MORE_ACTIONS],
  VOUCHER_DETAILS: [AppExtensionMountEnum.VOUCHER_DETAILS_MORE_ACTIONS],
  PAGE_DETAILS: [AppExtensionMountEnum.PAGE_DETAILS_MORE_ACTIONS],
  PAGE_TYPE_DETAILS: [AppExtensionMountEnum.PAGE_TYPE_DETAILS_MORE_ACTIONS],
  MENU_DETAILS: [AppExtensionMountEnum.MENU_DETAILS_MORE_ACTIONS],
  NAVIGATION_SIDEBAR: [
    AppExtensionMountEnum.NAVIGATION_CATALOG,
    AppExtensionMountEnum.NAVIGATION_CUSTOMERS,
    AppExtensionMountEnum.NAVIGATION_DISCOUNTS,
    AppExtensionMountEnum.NAVIGATION_ORDERS,
    AppExtensionMountEnum.NAVIGATION_PAGES,
    AppExtensionMountEnum.NAVIGATION_TRANSLATIONS,
  ],
};

const filterAndMapToTarget = (
  extensions: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>,
  openApp: (appData: AppData) => void,
): ExtensionWithParams[] =>
  extensions.map(({ id, accessToken, permissions, url, label, mount, target, app }) => ({
    id,
    app,
    accessToken: accessToken || "",
    permissions: permissions.map(({ code }) => code),
    url,
    label,
    mount,
    open: (params: AppDetailsUrlMountQueryParams) =>
      openApp({
        id: app.id,
        appToken: accessToken || "",
        src: url,
        label,
        target,
        params,
      }),
  }));

const mapToMenuItem = ({ label, id, open }: ExtensionWithParams) => ({
  label,
  testId: `extension-${id}`,
  onSelect: open,
});

const getExtensionItemsWithoutParams = (extensions: ExtensionWithParams[]) =>
  extensions.map(extension => mapToMenuItem({ ...extension, open: () => extension.open({}) }));

const getExtensionsItemsWithParam =
  (queryParam: keyof AppDetailsUrlMountQueryParams) =>
  (extensions: ExtensionWithParams[], paramValue: string[] | string | undefined) =>
    extensions.map(extension =>
      mapToMenuItem({ ...extension, open: () => extension.open({ [queryParam]: paramValue }) }),
    );

// Some pages don't have ability to select items - that is why we use the same function
// for overview actions and create buttons.
export const getExtensionItemsForOverviewCreate = getExtensionItemsWithoutParams;
export const getExtensionsItemsForProductOverviewActions =
  getExtensionsItemsWithParam("productIds");
export const getExtensionsItemsForProductDetails = getExtensionsItemsWithParam("productId");
export const getExtensionsItemsForCustomerDetails = getExtensionsItemsWithParam("customerId");
export const getExtensionsItemsForCustomerOverviewActions =
  getExtensionsItemsWithParam("customerIds");
export const getExtensionsItemsForOrderDetails = getExtensionsItemsWithParam("orderId");
export const getExtensionsItemsForCategoryOverviewActions =
  getExtensionsItemsWithParam("categoryIds");
export const getExtensionsItemsForCategoryDetails = getExtensionsItemsWithParam("categoryId");
export const getExtensionsItemsForCollectionOverviewActions =
  getExtensionsItemsWithParam("collectionIds");
export const getExtensionsItemsForCollectionDetails = getExtensionsItemsWithParam("collectionId");
export const getExtensionsItemsForGiftCardOverviewActions =
  getExtensionsItemsWithParam("giftCardIds");
export const getExtensionsItemsForGiftCardDetails = getExtensionsItemsWithParam("giftCardId");
export const getExtensionsItemsForOrderOverviewActions = getExtensionItemsWithoutParams;
export const getExtensionsItemsForDraftOrderOverviewActions =
  getExtensionsItemsWithParam("draftOrderIds");
export const getExtensionsItemsForDraftOrderDetails = getExtensionsItemsWithParam("draftOrderId");
export const getExtensionsItemsForDiscountOverviewActions = getExtensionItemsForOverviewCreate;
export const getExtensionsItemsForDiscountDetails = getExtensionsItemsWithParam("discountId");
export const getExtensionsItemsForVoucherOverviewActions =
  getExtensionsItemsWithParam("voucherIds");
export const getExtensionsItemsForVoucherDetails = getExtensionsItemsWithParam("voucherId");
export const getExtensionsItemsForPageOverviewActions = getExtensionsItemsWithParam("pageIds");
export const getExtensionsItemForPageDetails = getExtensionsItemsWithParam("pageId");
export const getExtensionsItemsForPageTypeOverviewActions =
  getExtensionsItemsWithParam("pageTypeIds");
export const getExtensionsItemsForPageTypeDetails = getExtensionsItemsWithParam("pageTypeId");
export const getExtensionsItemsForMenuOverviewActions = getExtensionsItemsWithParam("menuIds");
export const getExtensionsItemsForMenuDetails = getExtensionsItemsWithParam("menuId");

export const useExtensions = <T extends AppExtensionMountEnum>(
  mountList: T[],
): Record<T, Extension[]> => {
  const { openApp } = useExternalApp();
  const permissions = useUserPermissions();
  const extensionsPermissions = permissions?.find(perm => perm.code === PermissionEnum.MANAGE_APPS);
  const { data } = useExtensionListQuery({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        mount: mountList,
      },
    },
    skip: !extensionsPermissions,
  });
  const extensions = filterAndMapToTarget(
    mapEdgesToItems(data?.appExtensions ?? undefined) || [],
    openApp,
  );
  const extensionsMap = mountList.reduce(
    (extensionsMap, mount) => ({ ...extensionsMap, [mount]: [] }),
    {} as Record<AppExtensionMountEnum, Extension[]>,
  );

  return extensions.reduce(
    (prevExtensionsMap, extension) => ({
      ...prevExtensionsMap,
      [extension.mount]: [...(prevExtensionsMap[extension.mount] || []), extension],
    }),
    extensionsMap,
  );
};
