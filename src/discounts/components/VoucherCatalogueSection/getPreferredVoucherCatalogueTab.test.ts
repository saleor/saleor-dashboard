import { VoucherDetailsPageTab } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";

import { getPreferredVoucherCatalogueTab } from "./getPreferredVoucherCatalogueTab";

describe("getPreferredVoucherCatalogueTab", () => {
  it("returns categories when every group is empty", () => {
    // Arrange // Act // Assert
    expect(getPreferredVoucherCatalogueTab({})).toBe(VoucherDetailsPageTab.categories);
    expect(
      getPreferredVoucherCatalogueTab({
        categories: 0,
        collections: 0,
        products: 0,
        variants: 0,
      }),
    ).toBe(VoucherDetailsPageTab.categories);
  });

  it("returns the first group that has items", () => {
    // Arrange // Act // Assert
    expect(
      getPreferredVoucherCatalogueTab({
        categories: 0,
        collections: 2,
        products: 5,
      }),
    ).toBe(VoucherDetailsPageTab.collections);
    expect(
      getPreferredVoucherCatalogueTab({
        categories: 0,
        collections: 0,
        products: 3,
        variants: 1,
      }),
    ).toBe(VoucherDetailsPageTab.products);
    expect(
      getPreferredVoucherCatalogueTab({
        categories: 0,
        collections: 0,
        products: 0,
        variants: 4,
      }),
    ).toBe(VoucherDetailsPageTab.variants);
  });
});
