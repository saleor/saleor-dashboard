import { OrderDraftListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

import { getCustomerName } from "./datagrid";

describe("getCustomerName", () => {
  it("should return billing address first name and last name when exists", () => {
    // Arrange
    const data = {
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
      },
    } as RelayToFlat<NonNullable<OrderDraftListQuery["draftOrders"]>>[number];

    // Act
    const result = getCustomerName(data);

    // Assert
    expect(result).toEqual("John Doe");
  });

  it("should return user email when exists", () => {
    // Arrange
    const data = {
      billingAddress: {
        city: "New York",
      },
      userEmail: "john@doe.com",
    } as RelayToFlat<NonNullable<OrderDraftListQuery["draftOrders"]>>[number];

    // Act
    const result = getCustomerName(data);

    // Assert
    expect(result).toEqual("john@doe.com");
  });

  it("should return - when no user email and billing address", () => {
    // Arrange
    const data = {} as RelayToFlat<
      NonNullable<OrderDraftListQuery["draftOrders"]>
    >[number];

    // Act
    const result = getCustomerName(data);

    // Assert
    expect(result).toEqual("-");
  });
});
