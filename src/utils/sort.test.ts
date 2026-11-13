import { DiscountListUrlSortField } from "@dashboard/discounts/discountsUrls";
import { VoucherListUrlSortField } from "@dashboard/discounts/urls";

import { asSortParams } from "./sort";

describe("asSortParams", () => {
  it("keeps a sort the list has", () => {
    // Arrange
    const query: Record<string, string> = { sort: VoucherListUrlSortField.endDate, asc: "false" };

    // Act
    const params = asSortParams(query, VoucherListUrlSortField, VoucherListUrlSortField.code);

    // Assert
    expect(params).toEqual({ sort: VoucherListUrlSortField.endDate, asc: false });
  });

  it("uses the list's default sort and direction when the URL names a sort the list doesn't have", () => {
    // Arrange
    const query: Record<string, string> = { sort: "bogus", asc: "true", query: "summer" };

    // Act
    const params = asSortParams(
      query,
      VoucherListUrlSortField,
      VoucherListUrlSortField.code,
      false,
    );

    // Assert
    expect(params).toEqual({ sort: VoucherListUrlSortField.code, asc: false, query: "summer" });
  });

  it("sorts by name when the list has no default", () => {
    // Arrange
    const query: Record<string, string> = { sort: "status" };

    // Act
    const params = asSortParams(query, DiscountListUrlSortField);

    // Assert
    expect(params).toEqual({ sort: DiscountListUrlSortField.name, asc: true });
  });

  it("uses the list's default sort and direction when the URL has none", () => {
    // Arrange
    const query: Record<string, string> = {};

    // Act
    const params = asSortParams(
      query,
      VoucherListUrlSortField,
      VoucherListUrlSortField.code,
      false,
    );

    // Assert
    expect(params).toEqual({ sort: VoucherListUrlSortField.code, asc: false });
  });
});
