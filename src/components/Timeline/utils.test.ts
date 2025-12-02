import { safeStringify } from "./utils";

describe("safeStringify", () => {
  it("returns empty string for null", () => {
    const data = null;
    const result = safeStringify(data);

    expect(result).toBe("");
  });

  it("returns empty string for undefined", () => {
    const data = undefined;
    const result = safeStringify(data);

    expect(result).toBe("");
  });

  it("stringifies simple object", () => {
    const data = { name: "test", value: 123 };

    const result = safeStringify(data);

    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it("stringifies nested object", () => {
    const data = {
      user: {
        name: "John",
        email: "john@example.com",
      },
      items: [1, 2, 3],
    };
    const result = safeStringify(data);

    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it("removes __typename fields", () => {
    const data = {
      __typename: "User",
      name: "John",
      nested: {
        __typename: "Address",
        city: "NYC",
      },
    };

    const result = safeStringify(data);
    const parsed = JSON.parse(result);

    expect(parsed.__typename).toBeUndefined();
    expect(parsed.nested.__typename).toBeUndefined();
    expect(parsed.name).toBe("John");
    expect(parsed.nested.city).toBe("NYC");
  });

  it("handles circular references", () => {
    const data: Record<string, unknown> = { name: "test" };

    data.self = data; // Create circular reference

    const result = safeStringify(data);
    const parsed = JSON.parse(result);

    expect(parsed.name).toBe("test");
    expect(parsed.self).toBe("[Circular]");
  });

  it("handles deeply nested circular references", () => {
    const data: Record<string, unknown> = {
      level1: {
        level2: {
          value: "deep",
        },
      },
    };

    (data.level1 as Record<string, unknown>).circular = data;

    const result = safeStringify(data);
    const parsed = JSON.parse(result);

    expect(parsed.level1.level2.value).toBe("deep");
    expect(parsed.level1.circular).toBe("[Circular]");
  });

  it("stringifies arrays", () => {
    const data = [1, 2, { name: "test" }];
    const result = safeStringify(data);

    expect(result).toBe(JSON.stringify(data, null, 2));
  });

  it("stringifies primitive values", () => {
    expect(safeStringify("string")).toBe('"string"');
    expect(safeStringify(123)).toBe("123");
    expect(safeStringify(true)).toBe("true");
    expect(safeStringify(false)).toBe("false");
    expect(safeStringify(0)).toBe("0");
    expect(safeStringify("")).toBe('""');
  });
});
