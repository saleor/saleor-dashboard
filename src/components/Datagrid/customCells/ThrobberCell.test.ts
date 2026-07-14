import { GridCellKind } from "@glideapps/glide-data-grid";

import { loadingCell } from "./cells";
import { throbberCellRenderer } from "./ThrobberCell";

describe("ThrobberCell", () => {
  it("should create throbber loading cell", () => {
    // Arrange
    // Act
    const result = loadingCell();

    // Assert
    expect(result).toMatchObject({
      allowOverlay: false,
      readonly: true,
      kind: GridCellKind.Custom,
      data: {
        kind: "throbber-cell",
      },
    });
  });

  it("should match only throbber custom cells", () => {
    // Arrange
    const throbber = loadingCell();
    const nonThrobber = {
      ...loadingCell(),
      data: {
        kind: "chevron-cell",
      },
    };

    // Act
    const throbberMatch = throbberCellRenderer.isMatch(throbber);
    const nonThrobberMatch = throbberCellRenderer.isMatch(nonThrobber);

    // Assert
    expect(throbberMatch).toBe(true);
    expect(nonThrobberMatch).toBe(false);
  });
});
