import { render, screen } from "@testing-library/react";
import React from "react";

import { GridTable } from "./index";

describe("GridTable", () => {
  it("renders table with header and rows", () => {
    // Arrange
    const data = [
      { id: 1, name: "John", age: 30 },
      { id: 2, name: "Jane", age: 25 },
    ];

    // Act
    render(
      <GridTable>
        <GridTable.Body>
          {data.map((item, index) => (
            <GridTable.Row key={item.id} data-test-id={`row-${index}`}>
              <GridTable.Cell data-test-id={`row-${index}-cell-0`}>{item.id}</GridTable.Cell>
              <GridTable.Cell data-test-id={`row-${index}-cell-1`}>{item.name}</GridTable.Cell>
              <GridTable.Cell data-test-id={`row-${index}-cell-2`}>{item.age}</GridTable.Cell>
            </GridTable.Row>
          ))}
        </GridTable.Body>
      </GridTable>,
    );

    // Assert
    expect(screen.getByTestId("row-0-cell-0").textContent).toBe("1");
    expect(screen.getByTestId("row-0-cell-1").textContent).toBe("John");
    expect(screen.getByTestId("row-0-cell-2").textContent).toBe("30");
    expect(screen.getByTestId("row-1-cell-0").textContent).toBe("2");
    expect(screen.getByTestId("row-1-cell-1").textContent).toBe("Jane");
    expect(screen.getByTestId("row-1-cell-2").textContent).toBe("25");
  });
});
