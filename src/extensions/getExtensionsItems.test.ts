import { PermissionEnum } from "@dashboard/graphql";

import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemForPageDetails,
  getExtensionsItemsForCategoryDetails,
  getExtensionsItemsForCategoryOverviewActions,
  getExtensionsItemsForCollectionDetails,
  getExtensionsItemsForCollectionOverviewActions,
  getExtensionsItemsForCustomerDetails,
  getExtensionsItemsForCustomerOverviewActions,
  getExtensionsItemsForDiscountDetails,
  getExtensionsItemsForDiscountOverviewActions,
  getExtensionsItemsForDraftOrderDetails,
  getExtensionsItemsForDraftOrderOverviewActions,
  getExtensionsItemsForGiftCardDetails,
  getExtensionsItemsForGiftCardOverviewActions,
  getExtensionsItemsForMenuDetails,
  getExtensionsItemsForMenuOverviewActions,
  getExtensionsItemsForOrderDetails,
  getExtensionsItemsForOrderOverviewActions,
  getExtensionsItemsForPageOverviewActions,
  getExtensionsItemsForPageTypeDetails,
  getExtensionsItemsForPageTypeOverviewActions,
  getExtensionsItemsForProductDetails,
  getExtensionsItemsForProductOverviewActions,
  getExtensionsItemsForVoucherDetails,
  getExtensionsItemsForVoucherOverviewActions,
} from "./getExtensionsItems";
import { ExtensionWithParams } from "./types";

const mockedExtension: ExtensionWithParams = {
  id: "ext-1",
  label: "Extension 1",
  app: {
    __typename: "App",
    id: "app-id",
    appUrl: "https://example.com",
    name: "App name",
    brand: {
      logo: {
        default: "https://image.com/image",
        __typename: "AppBrandLogo",
      },
      __typename: "AppBrand",
    },
  },
  accessToken: "test-token",
  permissions: [PermissionEnum.MANAGE_ORDERS],
  mountName: "PRODUCT_OVERVIEW_MORE_ACTIONS",
  url: "https://example.com/extension",
  open: jest.fn(),
  targetName: "POPUP",
  settings: {},
};

describe("getExtensionsItems", () => {
  describe("getExtensionItemsWithoutParams", () => {
    it.each([
      {
        fn: getExtensionItemsForOverviewCreate,
        name: "getExtensionItemsForOverviewCreate",
      },
      {
        fn: getExtensionsItemsForOrderOverviewActions,
        name: "getExtensionsItemsForOrderOverviewActions",
      },
      {
        fn: getExtensionsItemsForDiscountOverviewActions,
        name: "getExtensionsItemsForDiscountOverviewActions",
      },
    ])("$name should call extension open with empty params", ({ fn }) => {
      const [result] = fn([mockedExtension]);

      result.onSelect({});
      expect(mockedExtension.open).toHaveBeenCalledWith({});
    });

    it.each([
      {
        fn: getExtensionItemsForOverviewCreate,
        name: "getExtensionItemsForOverviewCreate",
      },
      {
        fn: getExtensionsItemsForOrderOverviewActions,
        name: "getExtensionsItemsForOrderOverviewActions",
      },
      {
        fn: getExtensionsItemsForDiscountOverviewActions,
        name: "getExtensionsItemsForDiscountOverviewActions",
      },
    ])("$name should handle empty extensions array", ({ fn }) => {
      const result = fn([]);

      expect(result).toStrictEqual([]);
    });

    it.each([
      {
        fn: getExtensionsItemsForOrderOverviewActions,
        name: "getExtensionsItemsForOrderOverviewActions",
      },
      {
        fn: getExtensionsItemsForDiscountOverviewActions,
        name: "getExtensionsItemsForDiscountOverviewActions",
      },
    ])("$name should map extensions to menu items without parameters", ({ fn }) => {
      const result = fn([mockedExtension]);

      expect(result).toStrictEqual([
        {
          label: "Extension 1",
          testId: "extension-ext-1",
          avatar: "https://image.com/image",

          onSelect: expect.any(Function),
        },
      ]);
    });
  });

  describe("getExtensionsItemsWithParam", () => {
    it.each([
      {
        name: "getExtensionsItemsForProductOverviewActions",
        params: ["prod-1", "prod-2"],
        expectedOpenParams: { productIds: ["prod-1", "prod-2"] },
        fn: getExtensionsItemsForProductOverviewActions,
      },
      {
        name: "getExtensionsItemsForProductDetails",
        params: {
          productId: "prod-1",
          productSlug: "prod-one",
        },
        expectedOpenParams: { productId: "prod-1", productSlug: "prod-one" },
        fn: getExtensionsItemsForProductDetails,
      },
      {
        name: "getExtensionsItemsForCustomerOverviewActions",
        params: ["cust-1", "cust-2"],
        expectedOpenParams: { customerIds: ["cust-1", "cust-2"] },
        fn: getExtensionsItemsForCustomerOverviewActions,
      },
      {
        name: "getExtensionsItemsForCustomerDetails",
        params: "cust-1",
        expectedOpenParams: { customerId: "cust-1" },
        fn: getExtensionsItemsForCustomerDetails,
      },
      {
        name: "getExtensionsItemsForOrderDetails",
        params: "order-1",
        expectedOpenParams: { orderId: "order-1" },
        fn: getExtensionsItemsForOrderDetails,
      },
      {
        name: "getExtensionsItemsForCategoryOverviewActions",
        params: ["cat-1", "cat-2"],
        expectedOpenParams: { categoryIds: ["cat-1", "cat-2"] },
        fn: getExtensionsItemsForCategoryOverviewActions,
      },
      {
        name: "getExtensionsItemsForCategoryDetails",
        params: "cat-1",
        expectedOpenParams: { categoryId: "cat-1" },
        fn: getExtensionsItemsForCategoryDetails,
      },
      {
        name: "getExtensionsItemsForCollectionOverviewActions",
        params: ["coll-1", "coll-2"],
        expectedOpenParams: { collectionIds: ["coll-1", "coll-2"] },
        fn: getExtensionsItemsForCollectionOverviewActions,
      },
      {
        name: "getExtensionsItemsForCollectionDetails",
        params: "coll-1",
        expectedOpenParams: { collectionId: "coll-1" },
        fn: getExtensionsItemsForCollectionDetails,
      },
      {
        name: "getExtensionsItemsForGiftCardOverviewActions",
        params: ["gift-1", "gift-2"],
        expectedOpenParams: { giftCardIds: ["gift-1", "gift-2"] },
        fn: getExtensionsItemsForGiftCardOverviewActions,
      },
      {
        name: "getExtensionsItemsForGiftCardDetails",
        params: "gift-1",
        expectedOpenParams: { giftCardId: "gift-1" },
        fn: getExtensionsItemsForGiftCardDetails,
      },
      {
        name: "getExtensionsItemsForDraftOrderOverviewActions",
        params: ["draft-1", "draft-2"],
        expectedOpenParams: { draftOrderIds: ["draft-1", "draft-2"] },
        fn: getExtensionsItemsForDraftOrderOverviewActions,
      },
      {
        name: "getExtensionsItemsForDraftOrderDetails",
        params: "draft-1",
        expectedOpenParams: { draftOrderId: "draft-1" },
        fn: getExtensionsItemsForDraftOrderDetails,
      },
      {
        name: "getExtensionsItemsForDiscountDetails",
        params: "discount-1",
        expectedOpenParams: { discountId: "discount-1" },
        fn: getExtensionsItemsForDiscountDetails,
      },
      {
        name: "getExtensionsItemsForVoucherOverviewActions",
        params: ["voucher-1", "voucher-2"],
        expectedOpenParams: { voucherIds: ["voucher-1", "voucher-2"] },
        fn: getExtensionsItemsForVoucherOverviewActions,
      },
      {
        name: "getExtensionsItemsForVoucherDetails",
        params: "voucher-1",
        expectedOpenParams: { voucherId: "voucher-1" },
        fn: getExtensionsItemsForVoucherDetails,
      },
      {
        name: "getExtensionsItemsForPageOverviewActions",
        params: ["page-1", "page-2"],
        expectedOpenParams: { pageIds: ["page-1", "page-2"] },
        fn: getExtensionsItemsForPageOverviewActions,
      },
      {
        name: "getExtensionsItemForPageDetails",
        params: "page-1",
        expectedOpenParams: { pageId: "page-1" },
        fn: getExtensionsItemForPageDetails,
      },
      {
        name: "getExtensionsItemsForPageTypeOverviewActions",
        params: ["type-1", "type-2"],
        expectedOpenParams: { pageTypeIds: ["type-1", "type-2"] },
        fn: getExtensionsItemsForPageTypeOverviewActions,
      },
      {
        name: "getExtensionsItemsForPageTypeDetails",
        params: "type-1",
        expectedOpenParams: { pageTypeId: "type-1" },
        fn: getExtensionsItemsForPageTypeDetails,
      },
      {
        name: "getExtensionsItemsForMenuOverviewActions",
        params: ["menu-1", "menu-2"],
        expectedOpenParams: { menuIds: ["menu-1", "menu-2"] },
        fn: getExtensionsItemsForMenuOverviewActions,
      },
      {
        name: "getExtensionsItemsForMenuDetails",
        params: "menu-1",
        expectedOpenParams: { menuId: "menu-1" },
        fn: getExtensionsItemsForMenuDetails,
      },
    ])(
      "$name should call extension open with $expectedOpenParams params when onSelect is called with $params",
      ({ params, expectedOpenParams, fn }) => {
        // @ts-expect-error params is different depending on function, so TS is complaining, but that's fine
        const [result] = fn([mockedExtension], params);

        result.onSelect(expectedOpenParams);
        expect(mockedExtension.open).toHaveBeenCalledWith(expectedOpenParams);
      },
    );
  });
});
