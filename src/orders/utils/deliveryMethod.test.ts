import { getDeliveryMethodInfo } from "./deliveryMethod";

describe("getDeliveryMethodInfo", () => {
  it("returns Pickup info for a Warehouse delivery method", () => {
    // Arrange
    const deliveryMethod = { __typename: "Warehouse" } as const;

    // Act
    const result = getDeliveryMethodInfo(deliveryMethod);

    // Assert
    expect(result?.color).toBe("attention");
    expect(result?.labelMessage.defaultMessage).toBe("Pickup");
  });

  it("returns Shipping info for a ShippingMethod delivery method", () => {
    // Arrange
    const deliveryMethod = { __typename: "ShippingMethod" } as const;

    // Act
    const result = getDeliveryMethodInfo(deliveryMethod);

    // Assert
    expect(result?.color).toBe("info");
    expect(result?.labelMessage.defaultMessage).toBe("Shipping");
  });

  it("returns null when there is no delivery method", () => {
    // Arrange
    const deliveryMethod = null;

    // Act
    const result = getDeliveryMethodInfo(deliveryMethod);

    // Assert
    expect(result).toBeNull();
  });
});
