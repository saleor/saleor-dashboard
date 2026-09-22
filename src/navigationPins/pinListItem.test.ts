import { findNavigationPinByItemId, getNavigationPinItemId } from "./pinListItem";
import { type NavigationPin } from "./types";

describe("getNavigationPinItemId", () => {
  it("joins target and type id so the same type in two sections stays distinct", () => {
    // Arrange
    const pin: NavigationPin = { id: "type-1", target: "favorites" };

    // Act
    const itemId = getNavigationPinItemId(pin);

    // Assert
    expect(itemId).toBe("favorites:type-1");
  });
});

describe("findNavigationPinByItemId", () => {
  const pins: NavigationPin[] = [
    { id: "type-1", target: "favorites" },
    { id: "type-1", target: "products" },
  ];

  it("returns the pin for the matching target and id", () => {
    // Arrange
    const itemId = getNavigationPinItemId(pins[1]);

    // Act
    const result = findNavigationPinByItemId(pins, itemId);

    // Assert
    expect(result).toEqual(pins[1]);
  });

  it("returns undefined when no pin matches", () => {
    // Arrange
    const itemId = "modeling:missing";

    // Act
    const result = findNavigationPinByItemId(pins, itemId);

    // Assert
    expect(result).toBeUndefined();
  });
});
