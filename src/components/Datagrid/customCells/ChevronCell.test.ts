import { GridCellKind } from "@glideapps/glide-data-grid";

import { chevronCell } from "./cells";
import { chevronCellRenderer } from "./ChevronCell";

describe("ChevronCell", () => {
  it("should create collapsed chevron cell with pointer cursor", () => {
    // Arrange
    const expanded = false;

    // Act
    const result = chevronCell(expanded);

    // Assert
    expect(result).toMatchObject({
      cursor: "pointer",
      allowOverlay: false,
      readonly: true,
      kind: GridCellKind.Custom,
      data: {
        kind: "chevron-cell",
        direction: "right",
      },
    });
  });

  it("should create expanded chevron cell without pointer cursor", () => {
    // Arrange
    const expanded = true;

    // Act
    const result = chevronCell(expanded, false);

    // Assert
    expect(result).toMatchObject({
      cursor: "default",
      data: {
        kind: "chevron-cell",
        direction: "down",
      },
    });
  });

  it("should match only chevron custom cells", () => {
    // Arrange
    const chevron = chevronCell(false);
    const nonChevron = {
      ...chevronCell(false),
      data: {
        kind: "spinner-cell",
      },
    };

    // Act
    const chevronMatch = chevronCellRenderer.isMatch(chevron);
    const nonChevronMatch = chevronCellRenderer.isMatch(nonChevron);

    // Assert
    expect(chevronMatch).toBe(true);
    expect(nonChevronMatch).toBe(false);
  });
});
