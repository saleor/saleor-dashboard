import { PageListUrlSortField } from "@dashboard/modeling/urls";

import { canBeSorted } from "./sort";

describe("canBeSorted", () => {
  it("allows sorting for columns backed by a PageSortField", () => {
    // Arrange
    const sortable: PageListUrlSortField[] = [
      PageListUrlSortField.title,
      PageListUrlSortField.slug,
      PageListUrlSortField.visible,
    ];

    // Act
    const results = sortable.map(canBeSorted);

    // Assert
    expect(results).toEqual([true, true, true]);
  });

  it("rejects contentType, which the API cannot order by", () => {
    // Act
    const result = canBeSorted(PageListUrlSortField.contentType);

    // Assert
    expect(result).toBe(false);
  });
});
