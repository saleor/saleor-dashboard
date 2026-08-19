import { moveListItem } from "./moveListItem";

describe("moveListItem", () => {
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const getId = (item: { id: string }): string => item.id;

  it("moves an item down by sortOrder", () => {
    // Arrange & Act
    const next = moveListItem(items, { id: "a", sortOrder: 2 }, getId);

    // Assert
    expect(next.map(getId)).toEqual(["b", "c", "a"]);
  });

  it("moves an item up by negative sortOrder", () => {
    // Arrange & Act
    const next = moveListItem(items, { id: "c", sortOrder: -2 }, getId);

    // Assert
    expect(next.map(getId)).toEqual(["c", "a", "b"]);
  });

  it("returns the list unchanged when the id is missing", () => {
    // Arrange & Act
    const next = moveListItem(items, { id: "missing", sortOrder: 1 }, getId);

    // Assert
    expect(next).toBe(items);
  });

  it("moves assigned variant attributes by nested attribute id", () => {
    // Arrange
    const assigned = [
      { attribute: { id: "size" } },
      { attribute: { id: "color" } },
      { attribute: { id: "material" } },
    ];

    // Act
    const next = moveListItem(assigned, { id: "size", sortOrder: 1 }, item => item.attribute.id);

    // Assert
    expect(next.map(item => item.attribute.id)).toEqual(["color", "size", "material"]);
  });
});
