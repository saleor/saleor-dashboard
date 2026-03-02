import { GridCellKind } from "@glideapps/glide-data-grid";

import { chevronCell } from "./cells";
import { chevronCellRenderer } from "./ChevronCell";

type ChevronDrawArgs = Parameters<NonNullable<typeof chevronCellRenderer.draw>>[0];

interface ContextMock {
  beginPath: jest.Mock;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  lineTo: jest.Mock;
  lineWidth: number;
  moveTo: jest.Mock;
  restore: jest.Mock;
  save: jest.Mock;
  stroke: jest.Mock;
  strokeStyle: string;
}

const createContextMock = (): ContextMock => ({
  save: jest.fn(),
  beginPath: jest.fn(),
  strokeStyle: "",
  lineWidth: 0,
  lineCap: "butt",
  lineJoin: "miter",
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  restore: jest.fn(),
});

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

  it("should draw a collapsed chevron", () => {
    // Arrange
    const ctx = createContextMock();
    const args = {
      ctx,
      rect: { x: 0, y: 0, width: 32, height: 32 },
      theme: { textDark: "#111111" },
    } as unknown as ChevronDrawArgs;

    // Act
    const result = chevronCellRenderer.draw(args, chevronCell(false));

    // Assert
    expect(result).toBe(true);
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.beginPath).toHaveBeenCalledTimes(1);
    expect(ctx.moveTo).toHaveBeenCalledTimes(1);
    expect(ctx.lineTo).toHaveBeenCalledTimes(2);
    expect(ctx.stroke).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });
});
