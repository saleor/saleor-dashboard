import { slugFromConditionValue } from "./ConditionValue";

describe("slugFromConditionValue", () => {
  it("should return string when input is string", () => {
    const result = slugFromConditionValue("test");

    expect(result).toBe("test");
  });

  it("should return slug when input is ItemOption", () => {
    const result = slugFromConditionValue({ label: "test", value: "test", slug: "test" });

    expect(result).toBe("test");
  });

  it("should return slug when input is ItemOption array", () => {
    const result = slugFromConditionValue([{ label: "test", value: "test", slug: "test" }]);

    expect(result).toEqual(["test"]);
  });

  it("should return slug when input is tuple", () => {
    const result = slugFromConditionValue(["test", "test"]);

    expect(result).toEqual(["test", "test"]);
  });

  it("should return empty string when input is undefined", () => {
    const result = slugFromConditionValue(undefined);

    expect(result).toBe("");
  });
});
