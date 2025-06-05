import { AppExtensionMountEnum, PermissionEnum } from "@dashboard/graphql";

import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForProductOverviewActions,
} from "./get-extensions-items";
import { ExtensionWithParams } from "./types";

const mockedExtension: ExtensionWithParams = {
  id: "ext-1",
  label: "Extension 1",
  app: {
    __typename: "App",
    id: "app-id",
    appUrl: "https://example.com",
  },
  accessToken: "test-token",
  permissions: [PermissionEnum.MANAGE_ORDERS],
  mount: AppExtensionMountEnum.PRODUCT_OVERVIEW_MORE_ACTIONS,
  url: "https://example.com/extension",
  open: jest.fn(),
};

describe("get-extensions-items", () => {
  describe("getExtensionItemsForOverviewCreate", () => {
    it("should map extensions to menu items without parameters", () => {
      const result = getExtensionItemsForOverviewCreate([mockedExtension]);

      expect(result).toStrictEqual([
        {
          label: "Extension 1",
          testId: "extension-ext-1",
          onSelect: expect.any(Function),
        },
      ]);
    });

    it("should call extension open with empty params when onSelect is called", () => {
      const result = getExtensionItemsForOverviewCreate([mockedExtension]);

      result[0].onSelect({});

      expect(mockedExtension.open).toHaveBeenCalledWith({});
    });

    it("should handle empty extensions array", () => {
      const result = getExtensionItemsForOverviewCreate([]);

      expect(result).toStrictEqual([]);
    });
  });

  describe("getExtensionsItemsForProductOverviewActions", () => {
    it("should map extensions with productIds parameter", () => {
      const productIds = ["prod-1", "prod-2"];
      const result = getExtensionsItemsForProductOverviewActions([mockedExtension], productIds);

      expect(result).toStrictEqual([
        {
          label: "Extension 1",
          testId: "extension-ext-1",
          onSelect: expect.any(Function),
        },
      ]);
    });

    it("should call extension open with productIds when onSelect is called", () => {
      const productIds = ["prod-1", "prod-2"];
      const result = getExtensionsItemsForProductOverviewActions([mockedExtension], productIds);

      result[0].onSelect({ productIds });

      expect(mockedExtension.open).toHaveBeenCalledWith({ productIds });
    });

    it("should handle undefined productIds parameter", () => {
      const result = getExtensionsItemsForProductOverviewActions([mockedExtension], undefined);

      result[0].onSelect({});

      expect(mockedExtension.open).toHaveBeenCalledWith({ productIds: undefined });
    });

    // it("should handle single productId string", () => {
    //   const productId = "prod-1";
    //   const result = getExtensionsItemsForProductOverviewActions(mockExtensions, productId);

    //   result[0].onSelect();

    //   expect(mockExtensions[0].open).toHaveBeenCalledWith({ productIds: productId });
    // });
  });

  //   describe("getExtensionsItemsForProductDetails", () => {
  //     it("should map extensions with productId parameter", () => {
  //       const productId = "prod-1";
  //       const result = getExtensionsItemsForProductDetails(mockExtensions, productId);

  //       expect(result).toHaveLength(2);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ productId });
  //     });
  //   });

  //   describe("getExtensionsItemsForCustomerDetails", () => {
  //     it("should map extensions with customerId parameter", () => {
  //       const customerId = "cust-1";
  //       const result = getExtensionsItemsForCustomerDetails(mockExtensions, customerId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ customerId });
  //     });
  //   });

  //   describe("getExtensionsItemsForCustomerOverviewActions", () => {
  //     it("should map extensions with customerIds parameter", () => {
  //       const customerIds = ["cust-1", "cust-2"];
  //       const result = getExtensionsItemsForCustomerOverviewActions(mockExtensions, customerIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ customerIds });
  //     });
  //   });

  //   describe("getExtensionsItemsForOrderDetails", () => {
  //     it("should map extensions with orderId parameter", () => {
  //       const orderId = "order-1";
  //       const result = getExtensionsItemsForOrderDetails(mockExtensions, orderId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ orderId });
  //     });
  //   });

  //   describe("getExtensionsItemsForOrderOverviewActions", () => {
  //     it("should map extensions without parameters (same as overview create)", () => {
  //       const result = getExtensionsItemsForOrderOverviewActions(mockExtensions);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({});
  //     });
  //   });

  //   describe("getExtensionsItemsForCategoryOverviewActions", () => {
  //     it("should map extensions with categoryIds parameter", () => {
  //       const categoryIds = ["cat-1", "cat-2"];
  //       const result = getExtensionsItemsForCategoryOverviewActions(mockExtensions, categoryIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ categoryIds });
  //     });
  //   });

  //   describe("getExtensionsItemsForCategoryDetails", () => {
  //     it("should map extensions with categoryId parameter", () => {
  //       const categoryId = "cat-1";
  //       const result = getExtensionsItemsForCategoryDetails(mockExtensions, categoryId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ categoryId });
  //     });
  //   });

  //   describe("getExtensionsItemsForCollectionOverviewActions", () => {
  //     it("should map extensions with collectionIds parameter", () => {
  //       const collectionIds = ["coll-1", "coll-2"];
  //       const result = getExtensionsItemsForCollectionOverviewActions(mockExtensions, collectionIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ collectionIds });
  //     });
  //   });

  //   describe("getExtensionsItemsForCollectionDetails", () => {
  //     it("should map extensions with collectionId parameter", () => {
  //       const collectionId = "coll-1";
  //       const result = getExtensionsItemsForCollectionDetails(mockExtensions, collectionId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ collectionId });
  //     });
  //   });

  //   describe("getExtensionsItemsForGiftCardOverviewActions", () => {
  //     it("should map extensions with giftCardIds parameter", () => {
  //       const giftCardIds = ["gift-1", "gift-2"];
  //       const result = getExtensionsItemsForGiftCardOverviewActions(mockExtensions, giftCardIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ giftCardIds });
  //     });
  //   });

  //   describe("getExtensionsItemsForGiftCardDetails", () => {
  //     it("should map extensions with giftCardId parameter", () => {
  //       const giftCardId = "gift-1";
  //       const result = getExtensionsItemsForGiftCardDetails(mockExtensions, giftCardId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ giftCardId });
  //     });
  //   });

  //   describe("getExtensionsItemsForDraftOrderOverviewActions", () => {
  //     it("should map extensions with draftOrderIds parameter", () => {
  //       const draftOrderIds = ["draft-1", "draft-2"];
  //       const result = getExtensionsItemsForDraftOrderOverviewActions(mockExtensions, draftOrderIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ draftOrderIds });
  //     });
  //   });

  //   describe("getExtensionsItemsForDraftOrderDetails", () => {
  //     it("should map extensions with draftOrderId parameter", () => {
  //       const draftOrderId = "draft-1";
  //       const result = getExtensionsItemsForDraftOrderDetails(mockExtensions, draftOrderId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ draftOrderId });
  //     });
  //   });

  //   describe("getExtensionsItemsForDiscountOverviewActions", () => {
  //     it("should map extensions without parameters (same as overview create)", () => {
  //       const result = getExtensionsItemsForDiscountOverviewActions(mockExtensions);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({});
  //     });
  //   });

  //   describe("getExtensionsItemsForDiscountDetails", () => {
  //     it("should map extensions with discountId parameter", () => {
  //       const discountId = "discount-1";
  //       const result = getExtensionsItemsForDiscountDetails(mockExtensions, discountId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ discountId });
  //     });
  //   });

  //   describe("getExtensionsItemsForVoucherOverviewActions", () => {
  //     it("should map extensions with voucherIds parameter", () => {
  //       const voucherIds = ["voucher-1", "voucher-2"];
  //       const result = getExtensionsItemsForVoucherOverviewActions(mockExtensions, voucherIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ voucherIds });
  //     });
  //   });

  //   describe("getExtensionsItemsForVoucherDetails", () => {
  //     it("should map extensions with voucherId parameter", () => {
  //       const voucherId = "voucher-1";
  //       const result = getExtensionsItemsForVoucherDetails(mockExtensions, voucherId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ voucherId });
  //     });
  //   });

  //   describe("getExtensionsItemsForPageOverviewActions", () => {
  //     it("should map extensions with pageIds parameter", () => {
  //       const pageIds = ["page-1", "page-2"];
  //       const result = getExtensionsItemsForPageOverviewActions(mockExtensions, pageIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ pageIds });
  //     });
  //   });

  //   describe("getExtensionsItemForPageDetails", () => {
  //     it("should map extensions with pageId parameter", () => {
  //       const pageId = "page-1";
  //       const result = getExtensionsItemForPageDetails(mockExtensions, pageId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ pageId });
  //     });
  //   });

  //   describe("getExtensionsItemsForPageTypeOverviewActions", () => {
  //     it("should map extensions with pageTypeIds parameter", () => {
  //       const pageTypeIds = ["pageType-1", "pageType-2"];
  //       const result = getExtensionsItemsForPageTypeOverviewActions(mockExtensions, pageTypeIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ pageTypeIds });
  //     });
  //   });

  //   describe("getExtensionsItemsForPageTypeDetails", () => {
  //     it("should map extensions with pageTypeId parameter", () => {
  //       const pageTypeId = "pageType-1";
  //       const result = getExtensionsItemsForPageTypeDetails(mockExtensions, pageTypeId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ pageTypeId });
  //     });
  //   });

  //   describe("getExtensionsItemsForMenuOverviewActions", () => {
  //     it("should map extensions with menuIds parameter", () => {
  //       const menuIds = ["menu-1", "menu-2"];
  //       const result = getExtensionsItemsForMenuOverviewActions(mockExtensions, menuIds);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ menuIds });
  //     });
  //   });

  //   describe("getExtensionsItemsForMenuDetails", () => {
  //     it("should map extensions with menuId parameter", () => {
  //       const menuId = "menu-1";
  //       const result = getExtensionsItemsForMenuDetails(mockExtensions, menuId);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ menuId });
  //     });
  //   });

  //   describe("Edge cases", () => {
  //     it("should handle extensions with special characters in IDs", () => {
  //       const specialExtension = createMockExtension("ext-@#$%", "Special Extension");
  //       const result = getExtensionItemsForOverviewCreate([specialExtension]);

  //       expect(result[0].testId).toBe("extension-ext-@#$%");
  //     });

  //     it("should handle multiple extensions with same parameters correctly", () => {
  //       const extensions = [
  //         createMockExtension("ext-1", "Extension 1"),
  //         createMockExtension("ext-2", "Extension 2"),
  //         createMockExtension("ext-3", "Extension 3"),
  //       ];
  //       const productIds = ["prod-1", "prod-2"];
  //       const result = getExtensionsItemsForProductOverviewActions(extensions, productIds);

  //       expect(result).toHaveLength(3);

  //       // Test that each extension is called with the same parameters
  //       result.forEach((item, index) => {
  //         item.onSelect();
  //         expect(extensions[index].open).toHaveBeenCalledWith({ productIds });
  //       });
  //     });

  //     it("should preserve extension labels and IDs correctly", () => {
  //       const extensions = [
  //         createMockExtension("unique-id-1", "My Custom Extension"),
  //         createMockExtension("another-id", "Another Extension Name"),
  //       ];
  //       const result = getExtensionItemsForOverviewCreate(extensions);

  //       expect(result[0]).toEqual({
  //         label: "My Custom Extension",
  //         testId: "extension-unique-id-1",
  //         onSelect: expect.any(Function),
  //       });
  //       expect(result[1]).toEqual({
  //         label: "Another Extension Name",
  //         testId: "extension-another-id",
  //         onSelect: expect.any(Function),
  //       });
  //     });

  //     it("should handle empty string parameters", () => {
  //       const result = getExtensionsItemsForProductDetails(mockExtensions, "");

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ productId: "" });
  //     });

  //     it("should handle empty array parameters", () => {
  //       const result = getExtensionsItemsForProductOverviewActions(mockExtensions, []);

  //       result[0].onSelect();

  //       expect(mockExtensions[0].open).toHaveBeenCalledWith({ productIds: [] });
  //     });
  //   });
});
