import { thumbnailCell } from "./cells";
import { thumbnailCellRenderer } from "./ThumbnailCell";

const createDrawArgs = ({
  image,
  loadOrGetImage = jest.fn(),
}: {
  image?: CanvasImageSource;
  loadOrGetImage?: jest.Mock;
}): {
  ctx: {
    save: jest.Mock;
    restore: jest.Mock;
    beginPath: jest.Mock;
    moveTo: jest.Mock;
    lineTo: jest.Mock;
    quadraticCurveTo: jest.Mock;
    closePath: jest.Mock;
    fill: jest.Mock;
    stroke: jest.Mock;
    clip: jest.Mock;
    drawImage: jest.Mock;
    fillText: jest.Mock;
    measureText: jest.Mock;
    globalAlpha: number;
  };
  rect: { x: number; y: number; width: number; height: number };
  theme: { borderColor: string; textDark: string; textLight: string };
  imageLoader: { loadOrGetImage: jest.Mock };
  col: number;
  row: number;
} => {
  if (image !== undefined) {
    loadOrGetImage.mockReturnValue(image);
  }

  return {
    ctx: {
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      clip: jest.fn(),
      drawImage: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn(() => ({ width: 10 })),
      globalAlpha: 1,
    },
    rect: { x: 0, y: 0, width: 200, height: 40 },
    theme: {
      borderColor: "#ccc",
      textDark: "#111",
      textLight: "#888888",
    },
    imageLoader: { loadOrGetImage },
    col: 0,
    row: 1,
  };
};

describe("ThumbnailCell", () => {
  it("draws the empty image icon when there is no thumbnail", () => {
    // Arrange
    const icon = {} as CanvasImageSource;
    const loadOrGetImage = jest.fn();
    const args = createDrawArgs({ image: icon, loadOrGetImage });
    const cell = thumbnailCell("Bean Juice", "");

    // Act
    thumbnailCellRenderer.draw(args as never, cell);

    // Assert
    expect(loadOrGetImage).toHaveBeenCalledWith(
      expect.stringContaining("data:image/svg+xml"),
      0,
      1,
    );
    expect(args.ctx.fill).not.toHaveBeenCalled();
    expect(args.ctx.drawImage).toHaveBeenCalledWith(
      icon,
      expect.any(Number),
      expect.any(Number),
      16,
      16,
    );
  });

  it("does not draw the empty icon while a thumbnail is still loading", () => {
    // Arrange
    const loadOrGetImage = jest.fn().mockReturnValue(undefined);
    const args = createDrawArgs({ loadOrGetImage });
    const cell = thumbnailCell("Bean Juice", "https://example.com/thumb.png");

    // Act
    thumbnailCellRenderer.draw(args as never, cell);

    // Assert
    expect(args.ctx.drawImage).not.toHaveBeenCalled();
    expect(args.ctx.fill).not.toHaveBeenCalled();
  });
});
