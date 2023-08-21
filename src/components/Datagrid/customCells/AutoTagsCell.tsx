import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";

export const stringToHue = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash % 360;
};

export interface PillColor {
  readonly base: string;
  readonly border: string;
  readonly text: string;
}

export const pillLabelToColor = (hue: number): PillColor => {
  const l = 94;
  const s = 0.05;
  const base = `oklch(${l}% ${s} ${hue})`;
  const border = `oklch(${l - 8}% ${s} ${hue})`;
  const text = `oklch(${l - 50}% ${s} ${hue})`;

  return { base, border, text };
};

interface AutoTagsCellProps {
  readonly kind: "auto-tags-cell";
  readonly value: string;
  readonly color: {
    readonly text: string;
    readonly border: string;
    readonly base: string;
  };
}

export type AutoTagsCell = CustomCell<AutoTagsCellProps>;

export const autoTagsCellRenderer = (): CustomRenderer<AutoTagsCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is AutoTagsCell => (c.data as any).kind === "auto-tags-cell",
  draw: (args, cell) => {
    const label = cell.data.value;
    const { text, border, base } = cell.data.color;
    const { rect, ctx, theme } = args;
    const { x, y, height } = rect;

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
