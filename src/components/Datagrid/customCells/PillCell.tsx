import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import chroma from "chroma-js";

export const stringToHue = (str: string): number => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }

  return hash % 360;
};

const oklchIsSupported = typeof CSS !== "undefined" && CSS.supports("color: oklch(0% 0 0)");
const oklch = (l: number, c: number, h: number) => {
  if (oklchIsSupported) {
    return `oklch(${l}% ${c} ${h})`;
  } else {
    return chroma(l / 100, c, h, "oklch").hex();
  }
};

export const hueToPillColorLight = (hue: number): PillColor => {
  const l = 94;
  const c = 0.05;
  const base = oklch(l, c, hue);
  const border = oklch(l - 8, c, hue);
  const text = oklch(l - 50, c, hue);

  return { base, border, text };
};

export const hueToPillColorDark = (hue: number): PillColor => {
  const l = 40;
  const s = 0.09;
  const contrast = 55;
  const base = oklch(l, s, hue);
  const border = oklch(l, s, hue);
  const text = oklch(l + contrast, s, hue);

  return { base, border, text };
};

export interface PillColor {
  readonly base: string;
  readonly border: string;
  readonly text: string;
}
interface PillCellProps {
  readonly kind: "auto-tags-cell";
  readonly value: string;
  readonly color: {
    readonly text: string;
    readonly border: string;
    readonly base: string;
  };
}

export type PillCell = CustomCell<PillCellProps>;

export const pillCellRenderer = (): CustomRenderer<PillCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is PillCell => (c.data as any).kind === "auto-tags-cell",
  draw: (args, cell) => {
    const label = cell.data.value;
    const { rect, ctx, theme } = args;
    const { x, y, height } = rect;
    const { base, border, text } = cell.data.color;
    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
    const tileWidth = textWidth + 10;
    const tileHeight = textHeight * 1.2;

    // Draw the tile
    ctx.fillStyle = base;
    ctx.strokeStyle = border;
    ctx.beginPath();
    ctx.roundRect(x + 10, y + height / 2 - tileHeight / 2, tileWidth, tileHeight, 5);
    ctx.stroke();
    ctx.fill();
    // Draw the text
    ctx.fillStyle = text;
    ctx.fillText(label, x + 15, y + height / 2 + getMiddleCenterBias(ctx, theme));

    return true;
  },
});
