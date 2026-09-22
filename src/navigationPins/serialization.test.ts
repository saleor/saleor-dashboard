import { MAX_PINS_PER_TARGET, NAVIGATION_PINS_METADATA_KEY } from "./constants";
import {
  addPin,
  isPinned,
  isTargetFull,
  parseNavigationPins,
  removePin,
  removePinsById,
  serializeNavigationPins,
} from "./serialization";
import { type NavigationPin } from "./types";

const metadata = (value: string) => [{ key: NAVIGATION_PINS_METADATA_KEY, value }];

describe("parseNavigationPins", () => {
  it("returns pins stored under the navigation pins key", () => {
    // Arrange
    const pins: NavigationPin[] = [{ id: "type-1", target: "favorites" }];

    // Act
    const result = parseNavigationPins(metadata(serializeNavigationPins(pins)));

    // Assert
    expect(result).toEqual(pins);
  });

  it("returns an empty list when the key is absent", () => {
    // Arrange
    const other = [{ key: "unrelated", value: "[]" }];

    // Act
    const result = parseNavigationPins(other);

    // Assert
    expect(result).toEqual([]);
  });

  it.each(["not json", '{"not":"an array"}', "[1,2,3]"])(
    "degrades to no pins for malformed value %p",
    value => {
      // Act
      const result = parseNavigationPins(metadata(value));

      // Assert
      expect(result).toEqual([]);
    },
  );

  it("drops pins pointing at targets that no longer exist", () => {
    // Arrange
    const stored = JSON.stringify([
      { id: "type-1", target: "favorites" },
      { id: "type-2", target: "a-section-we-removed" },
    ]);

    // Act
    const result = parseNavigationPins(metadata(stored));

    // Assert
    expect(result).toEqual([{ id: "type-1", target: "favorites" }]);
  });
});

describe("addPin", () => {
  it("appends so insertion order is render order", () => {
    // Arrange
    const pins: NavigationPin[] = [{ id: "type-1", target: "favorites" }];

    // Act
    const result = addPin(pins, { id: "type-2", target: "favorites" });

    // Assert
    expect(result.map(pin => pin.id)).toEqual(["type-1", "type-2"]);
  });

  it("refuses to exceed the per-target cap", () => {
    // Arrange
    const pins: NavigationPin[] = Array.from({ length: MAX_PINS_PER_TARGET }, (_, index) => ({
      id: `type-${index}`,
      target: "favorites",
    }));

    // Act
    const result = addPin(pins, { id: "one-too-many", target: "favorites" });

    // Assert
    expect(result).toEqual(pins);
    expect(isTargetFull(pins, "favorites")).toBe(true);
  });

  it("counts the cap per target, not globally", () => {
    // Arrange
    const pins: NavigationPin[] = Array.from({ length: MAX_PINS_PER_TARGET }, (_, index) => ({
      id: `type-${index}`,
      target: "favorites",
    }));

    // Act
    const result = addPin(pins, { id: "type-x", target: "products" });

    // Assert
    expect(result).toHaveLength(MAX_PINS_PER_TARGET + 1);
  });

  it("ignores a pin that already exists on that target", () => {
    // Arrange
    const pins: NavigationPin[] = [{ id: "type-1", target: "favorites" }];

    // Act
    const result = addPin(pins, { id: "type-1", target: "favorites" });

    // Assert
    expect(result).toEqual(pins);
  });
});

describe("removePin", () => {
  it("removes only the matching target, leaving the same type pinned elsewhere", () => {
    // Arrange
    const pins: NavigationPin[] = [
      { id: "type-1", target: "favorites" },
      { id: "type-1", target: "products" },
    ];

    // Act
    const result = removePin(pins, { id: "type-1", target: "favorites" });

    // Assert
    expect(result).toEqual([{ id: "type-1", target: "products" }]);
  });

  it("removes every target for a type when unpinning by id", () => {
    // Arrange
    const pins: NavigationPin[] = [
      { id: "type-1", target: "favorites" },
      { id: "type-1", target: "products" },
      { id: "type-2", target: "products" },
    ];

    // Act
    const result = removePinsById(pins, "type-1");

    // Assert
    expect(result).toEqual([{ id: "type-2", target: "products" }]);
    expect(isPinned(result, "type-1")).toBe(false);
  });
});
