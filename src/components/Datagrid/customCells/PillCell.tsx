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
const oklch = (l: number, c: number, h: number, a?: number) => {
  if (oklchIsSupported) {
    return `oklch(${l}% ${c} ${h} ${a ? `/ ${a}` : ""})`;
  } else {
    if (a) {
      return chroma(l / 100, c, h, "oklch")
        .alpha(a)
        .hex();
    }

    return chroma(l / 100, c, h, "oklch").hex();
  }
};

export const hueToPillColorLight = (hue: number): PillColor => {
  const isNeutral = hue === 0;
  const l = isNeutral ? 97 : 94;
  const c = isNeutral ? 0 : 0.065;
  const cText = isNeutral ? 0 : 0.06;
  const base = oklch(l, c, hue, isNeutral ? 0.3 : undefined); // Add transparency to neutral
  const border = oklch(l - (isNeutral ? 45 : 8), c, hue, isNeutral ? 0.3 : undefined);
  const text = oklch(l - 55, cText, hue);

  return { base, border, text };
};

export const hueToPillColorDark = (hue: number): PillColor => {
  const isNeutral = hue === 0;
  const l = isNeutral ? 25 : 40;
  const s = isNeutral ? 0 : 0.07;
  const sText = isNeutral ? 0 : 0.08;
  const contrast = isNeutral ? 70 : 55;
  const base = oklch(l, s, hue, isNeutral ? 0.3 : undefined); // Add transparency to neutral
  const border = oklch(l + (isNeutral ? 55 : 3), s, hue, isNeutral ? 0.3 : undefined);
  const text = oklch(l + contrast, sText, hue);

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

    ctx.font = `500 12px ${theme.fontFamily}`;

    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
    const padding = 8;
    const tileWidth = textWidth + 2 * padding;
    const tileHeight = textHeight * 1.35;

    // Draw the tile
    if ("roundRect" in ctx) {
      ctx.fillStyle = base;
      ctx.strokeStyle = border;
      ctx.beginPath();
      ctx.roundRect(x + 10, y + height / 2 - tileHeight / 2, tileWidth, tileHeight, 16);
      ctx.fill();
      ctx.stroke();
    }

    // Draw the text
    ctx.fillStyle = text;
    ctx.fillText(label, x + 10 + padding, y + height / 2 + getMiddleCenterBias(ctx, theme));

    return true;
  },
});
