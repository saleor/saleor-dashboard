import { OrderListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

import { getCustomerCellContent } from "./datagrid";

describe("getCustomerCellContent", () => {
  it("should return billing address first name and last name when exists", () => {
    // Arrange
    const data = {
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
      },
    } as RelayToFlat<NonNullable<OrderListQuery["orders"]>>[number];
    // Act
    const result = getCustomerCellContent(data);

    // Assert
    expect(result.data).toEqual("John Doe");
    expect(result.displayData).toEqual("John Doe");
  });
  it("should return user email when exists", () => {
    // Arrange
    const data = {
      billingAddress: {
        city: "New York",
      },
      userEmail: "john@doe.com",
    } as RelayToFlat<NonNullable<OrderListQuery["orders"]>>[number];
    // Act
    const result = getCustomerCellContent(data);

    // Assert
    expect(result.data).toEqual("john@doe.com");
    expect(result.displayData).toEqual("john@doe.com");
  });
  it("should return - when no user email and billing address", () => {
    // Arrange
    const data = {} as RelayToFlat<NonNullable<OrderListQuery["orders"]>>[number];
    // Act
    const result = getCustomerCellContent(data);

    // Assert
    expect(result.data).toEqual("-");
    expect(result.displayData).toEqual("-");
  });
});
