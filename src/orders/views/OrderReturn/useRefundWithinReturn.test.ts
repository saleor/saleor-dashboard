import { GrantRefundInputLine, squashLines } from "./useRefundWithinReturn";

describe("squashLines", () => {
  it("merges items with the same ID", () => {
    const items = [
      { id: "abc", quantity: 1 },
      { id: "def", quantity: 2 },
      { id: "abc", quantity: 3 },
    ];
    const result = squashLines(items);
    expect(result).toEqual([
      { id: "abc", quantity: 4 },
      { id: "def", quantity: 2 },
    ]);
  });
  it("handles an empty array", () => {
    const items = [] as GrantRefundInputLine[];
    const result = squashLines(items);
    expect(result).toEqual([]);
  });
  it("does not modify items with unique IDs", () => {
    const items = [
      { id: "abc", quantity: 1 },
      { id: "def", quantity: 2 },
    ];
    const result = squashLines(items);
    expect(result).toEqual(items);
  });
});
