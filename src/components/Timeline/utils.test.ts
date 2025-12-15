import { safeStringify } from "./utils";

describe("safeStringify", () => {
  it("returns empty string for null/undefined", () => {
    expect(safeStringify(null)).toBe("");
    expect(safeStringify(undefined)).toBe("");
  });

  it("removes __typename fields from GraphQL data", () => {
    const data = {
      __typename: "User",
      name: "John",
      nested: { __typename: "Address", city: "NYC" },
    };

    const result = JSON.parse(safeStringify(data));

    expect(result.__typename).toBeUndefined();
    expect(result.nested.__typename).toBeUndefined();
    expect(result.name).toBe("John");
  });

  it("handles circular references without throwing", () => {
    const data: Record<string, unknown> = { name: "test" };

    data.self = data;

    const result = JSON.parse(safeStringify(data));

    expect(result.self).toBe("[Circular]");
  });
});
