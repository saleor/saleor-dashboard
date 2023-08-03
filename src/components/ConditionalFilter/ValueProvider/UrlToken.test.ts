import { ConditionSelected } from "../FilterElement/ConditionSelected";
import { UrlEntry } from "./UrlToken";

describe("UrlEntry", () => {
  it("should create an instance with a single value", () => {
    const entry = new UrlEntry("key", "value");
    expect(entry).toEqual({ key: "value" });
  });

  it("should create an instance with an array value", () => {
    const entry = new UrlEntry("key", ["value1", "value2"]);
    expect(entry).toEqual({ key: ["value1", "value2"] });
  });

  it("should create an instance from a ParsedQs object", () => {
    const entry = UrlEntry.fromQs({ key: "value" });
    expect(entry).toEqual({ key: "value" });
  });

  it("should create an instance for an attribute condition", () => {
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
    const entry = UrlEntry.forAttribute(condition, "bottle-size");
    expect(entry).toEqual({ "s-1.bottle-size": "value-id" });
  });

  it.skip("should create an instance for a static condition", () => {
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
    const entry = UrlEntry.forStatic(condition, "price");
    expect(entry).toEqual({ static: "value" });
  });

  it("should return the correct info", () => {
    const entry = new UrlEntry("s0.price", "value");
    const info = entry.getInfo();
    expect(info).toEqual({
      key: "s0.price",
      value: "value",
      entryName: "price",
      type: "s",
      conditionKid: "is",
    });
  });
});
