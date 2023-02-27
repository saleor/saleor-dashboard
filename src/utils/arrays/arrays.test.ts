import { arrayDiff } from "./arrays";

const fruits = ["apple", "orange", "strawberry"];

const vegetables = ["potato", "onion"];

describe("Validate diff results", () => {
  it("Empty arrays", () => {
    const diff = arrayDiff([], []);
    expect(diff).toStrictEqual({ added: [], removed: [], common: [] });
  });

  it("Compare array with itself", () => {
    const diff = arrayDiff(fruits, fruits);
    expect(diff).toStrictEqual({ added: [], removed: [], common: fruits });
  });

  it("Added elements to empty", () => {
    const diff = arrayDiff([], vegetables);
    expect(diff).toStrictEqual({
      added: vegetables,
      removed: [],
      common: [],
    });
  });

  it("Added elements to populated array", () => {
    const diff = arrayDiff(fruits, [...fruits, ...vegetables]);
    expect(diff).toStrictEqual({
      added: vegetables,
      removed: [],
      common: fruits,
    });
  });

  it("Removed elements", () => {
    const diff = arrayDiff([...fruits, ...vegetables], fruits);
    expect(diff).toStrictEqual({
      added: [],
      removed: vegetables,
      common: fruits,
    });
  });

  it("Added, removed, and common elements", () => {
    const before = ["a", "b", "c", "d"];
    const after = ["b", "e", "a", "t"];
    const diff = arrayDiff(before, after);
    expect(diff).toStrictEqual({
      added: ["e", "t"],
      removed: ["c", "d"],
      common: ["a", "b"],
    });
  });
});
