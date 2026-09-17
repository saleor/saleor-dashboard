import { CustomerListUrlSortField } from "@dashboard/customers/urls";

import { canBeSorted } from "./sort";

describe("canBeSorted", () => {
  it("allows sorting for columns backed by a UserSortField", () => {
    // Arrange
    const sortable: CustomerListUrlSortField[] = [
      CustomerListUrlSortField.name,
      CustomerListUrlSortField.email,
      CustomerListUrlSortField.orders,
    ];

    // Act
    const results = sortable.map(canBeSorted);

    // Assert
    expect(results).toEqual([true, true, true]);
  });

  it("rejects columns the API cannot order by", () => {
    // Arrange
    const nonSortable: string[] = ["companyName", "externalReference"];

    // Act
    const results = nonSortable.map(canBeSorted);

    // Assert
    expect(results).toEqual([false, false]);
  });
});
