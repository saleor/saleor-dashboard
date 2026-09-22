import { createElement } from "react";

import {
  findActivatorTableRow,
  findSortableRow,
  getSortableRowIds,
  measureTableRowCellWidths,
} from "./sortableTableRows";

describe("sortableTableRows", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("collects row ids from children", () => {
    // Arrange
    const children = [
      createElement("div", { id: "attr-1", key: "a" }),
      createElement("div", { id: "attr-2", key: "b" }),
    ];

    // Act
    const ids = getSortableRowIds(children);

    // Assert
    expect(ids).toEqual(["attr-1", "attr-2"]);
  });

  it("finds the active row by id", () => {
    // Arrange
    const first = createElement("div", { id: "attr-1", key: "a" }, "Color");
    const second = createElement("div", { id: "attr-2", key: "b" }, "Size");

    // Act
    const match = findSortableRow([first, second], "attr-2");

    // Assert
    expect(match?.props.id).toBe("attr-2");
  });

  it("finds the table row from a nested drag handle", () => {
    // Arrange
    const table = document.createElement("table");
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    const handle = document.createElement("button");

    row.id = "row";
    handle.id = "handle";
    cell.appendChild(handle);
    row.appendChild(cell);
    table.appendChild(row);
    document.body.appendChild(table);

    // Act
    const found = findActivatorTableRow(handle);

    // Assert
    expect(found).toBe(row);
  });

  it("measures a width for each cell in the row", () => {
    // Arrange
    const row = document.createElement("tr");

    [40, 80, 120].forEach(width => {
      const cell = document.createElement("td");

      jest.spyOn(cell, "getBoundingClientRect").mockReturnValue({
        width,
        height: 40,
        top: 0,
        left: 0,
        bottom: 40,
        right: width,
        x: 0,
        y: 0,
        toJSON: () => undefined,
      });
      row.appendChild(cell);
    });

    // Act
    const widths = measureTableRowCellWidths(row);

    // Assert
    expect(widths).toEqual([40, 80, 120]);
  });
});
