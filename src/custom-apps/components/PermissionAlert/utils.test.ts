import { extractPermissions } from "./utils";

describe("Permission Parsing", () => {
  it("should extract permissions from the meta `description` if available", () => {
    // Arrange
    // -> Order.invoices
    //    https://docs.saleor.io/docs/3.x/api-reference/objects/order
    const description = `List of order invoices. Can be fetched for orders created in Saleor 3.2 and later, for other orders requires one of the following permissions: MANAGE_ORDERS, OWNER.`;
    // Act
    const permissions = extractPermissions(description);

    // Assert
    expect(permissions).toHaveLength(2);
    expect(permissions[0]).toEqual("MANAGE_ORDERS");
  });
  it("should return empty list if the `description` doesn't mention permissions", () => {
    // Arrange
    // -> Order.number
    //    https://docs.saleor.io/docs/3.x/api-reference/objects/order
    const description = `User-friendly number of an order.`;
    // Act
    const permissions = extractPermissions(description);

    // Assert
    expect(permissions).toHaveLength(0);
  });
});
