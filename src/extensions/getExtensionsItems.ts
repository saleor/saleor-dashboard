import { ExtensionWithParams } from "./types";
import { AppDetailsUrlMountQueryParams } from "./urls";

export interface ExtensionMenuItem {
  label: string;
  testId: string;
  onSelect: (params: AppDetailsUrlMountQueryParams) => void;
  avatar?: string;
}

const mapToMenuItem = ({ label, id, open, app }: ExtensionWithParams): ExtensionMenuItem => ({
  label,
  testId: `extension-${id}`,
  onSelect: open,
  avatar: app.brand?.logo.default,
});

const getExtensionItemsWithoutParams = (extensions: ExtensionWithParams[]) =>
  extensions.map(extension => mapToMenuItem({ ...extension, open: () => extension.open({}) }));

const getExtensionsItemsWithParam =
  (queryParam: keyof AppDetailsUrlMountQueryParams) =>
  (
    extensions: ExtensionWithParams[],
    paramValue: string[] | string | undefined,
  ): ExtensionMenuItem[] =>
    extensions.map(extension =>
      mapToMenuItem({ ...extension, open: () => extension.open({ [queryParam]: paramValue }) }),
    );
const getExtensionsItemsWithManyParams = (
  extensions: ExtensionWithParams[],
  paramsRecord: AppDetailsUrlMountQueryParams,
): ExtensionMenuItem[] =>
  extensions.map(extension =>
    mapToMenuItem({ ...extension, open: () => extension.open(paramsRecord) }),
  );

// Some pages don't have ability to select items - that is why we use the same function
// for overview actions and create buttons.
export const getExtensionItemsForOverviewCreate = getExtensionItemsWithoutParams;
export const getExtensionsItemsForProductOverviewActions =
  getExtensionsItemsWithParam("productIds");
export const getExtensionsItemsForProductDetails = getExtensionsItemsWithManyParams;
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
export const getExtensionsItemsForTranslationDetails = getExtensionsItemsWithManyParams;
