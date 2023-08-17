import {
  CustomCell,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";

const stringToHue = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash % 360;
};

interface AutoTagsCellProps {
  readonly kind: "auto-tags-cell";
}

export type AutoTagsCell = CustomCell<AutoTagsCellProps>;

export const autoTagsCellRenderer = () => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is AutoTagsCell => (c.data as any).kind === "auto-tags-cell",
  draw: (args, cell) => {
    const label = cell.data.value;
    const { rect, ctx, theme } = args;
    const { x, y, height } = rect;

    const h = stringToHue(label);
    const l = 94;
    const s = 0.05;
    const base = `oklch(${l}% ${s} ${h})`;
    const border = `oklch(${l - 9}% ${s} ${h})`;
    const text = `oklch(${l - 50}% ${s} ${h})`;

    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width;
    const textHeight =
      textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

    const tileWidth = textWidth + 10;
    const tileHeight = textHeight * 1.2;

    // Draw the tile
    ctx.fillStyle = base;
    ctx.strokeStyle = border;
    ctx.beginPath();
    ctx.roundRect(
      x + 10,
      y + height / 2 - tileHeight / 2,
      tileWidth,
      tileHeight,
      5,
    );
    ctx.stroke();
    ctx.fill();

    // Draw the text
    ctx.fillStyle = text;
    ctx.fillText(
      label,
      x + 15,
      y + height / 2 + getMiddleCenterBias(ctx, theme),
    );

    return true;
  },
});
