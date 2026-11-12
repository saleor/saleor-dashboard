import { orderByIds } from "./orderByIds";

interface Item {
  id: string;
}

const items: Item[] = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
const ids = (ordered: Item[]): string[] => ordered.map(item => item.id);
const getId = (item: Item): string => item.id;

describe("orderByIds", () => {
  it("puts items in the given order", () => {
    // Arrange & Act
    const result = orderByIds(items, getId, ["c", "a", "d", "b"]);

    // Assert
    expect(ids(result)).toEqual(["c", "a", "d", "b"]);
  });

  it("keeps items the order does not name last, in their own order", () => {
    // Arrange: "b" and "d" were loaded after the order was made
    const order = ["c", "a"];

    // Act
    const result = orderByIds(items, getId, order);

    // Assert
    expect(ids(result)).toEqual(["c", "a", "b", "d"]);
  });

  it("ignores ids that are no longer among the items", () => {
    // Arrange & Act
    const result = orderByIds(items, getId, ["gone", "d", "c", "b", "a"]);

    // Assert
    expect(ids(result)).toEqual(["d", "c", "b", "a"]);
  });

  it("leaves the given array as it was", () => {
    // Arrange
    const original = [...items];

    // Act
    orderByIds(items, getId, ["d", "c", "b", "a"]);

    // Assert
    expect(items).toEqual(original);
  });
});
