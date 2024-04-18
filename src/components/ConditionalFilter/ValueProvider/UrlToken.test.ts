import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { UrlEntry } from "./UrlToken";

describe("UrlEntry", () => {
  it("should create an instance with a single value", () => {
    // Arrange & Act
    const entry = new UrlEntry("key", "value");
    // Assert
    expect(entry).toEqual({ key: "value" });
  });
  it("should create an instance with an array value", () => {
    // Arrange & Act
    const entry = new UrlEntry("key", ["value1", "value2"]);
    // Assert
    expect(entry).toEqual({ key: ["value1", "value2"] });
  });
  it("should create an instance from a ParsedQs object", () => {
    // Arrange & Act
    const entry = UrlEntry.fromQs({ key: "value" });
    // Assert
    expect(entry).toEqual({ key: "value" });
  });
  it("should create an instance for an attribute condition", () => {
    // Arrange
    const condition = new ConditionSelected(
      {
        label: "5l",
        slug: "value-id",
        value: "value-id",
        originalSlug: "5l",
      },
      {
        type: "DROPDOWN",
        value: "bottle-size",
        label: "Bottle Size",
      },
      [],
      false,
    );
    // Act
    const entry = UrlEntry.forAttribute(condition, "bottle-size");
    // Assert
    expect(entry).toEqual({ "s-1.bottle-size": "value-id" });
  });
  it.skip("should create an instance for a static condition", () => {
    // Arrange
    const condition = new ConditionSelected(
      "value",
      {
        type: "price",
        value: "price",
        label: "Price",
      },
      [],
      false,
    );
    // Act
    const entry = UrlEntry.forStatic(condition, "price");
    // Assert
    expect(entry).toEqual({ static: "value" });
  });
  it("should return the correct info", () => {
    // Arrange
    const entry = new UrlEntry("s0.price", "value");
    // Act
    const info = entry.getInfo();
    // Assert
    expect(info).toEqual({
      key: "s0.price",
      value: "value",
      entryName: "price",
      type: "s",
      conditionKid: "is",
    });
  });
});
