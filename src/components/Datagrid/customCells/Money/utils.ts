import { type Locale } from "@dashboard/components/Locale/Locale";
import { formatMoneyAmount } from "@dashboard/components/Money";
import {
  getMiddleCenterBias,
  measureTextCached,
  type Rectangle,
  type Theme,
} from "@glideapps/glide-data-grid";

const OFFSET = 8;

export function drawPrice(
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  rect: Rectangle,
  text: string,
) {
  ctx.fillStyle = theme.textDark;
  ctx.textAlign = "right";
  ctx.fillText(
    text,
    rect.x + rect.width - OFFSET,
    rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
  );
}

/** Gap between the crossed-out price and the current price. */
export const PRICE_GAP = 6;

/** Currency labels and crossed-out prices are drawn smaller so they read as secondary. */
const SECONDARY_FONT_SCALE = 0.85;

const secondaryFonts = new WeakMap<Theme, string>();

const getSecondaryFont = (theme: Theme): string => {
  const cached = secondaryFonts.get(theme);

  if (cached) {
    return cached;
  }

  const font = [
    theme.baseFontStyle.replace(
      /(\d+(?:\.\d+)?)px/,
      (_, size: string) => `${Number(size) * SECONDARY_FONT_SCALE}px`,
    ),
    theme.fontFamily,
  ].join(" ");

  secondaryFonts.set(theme, font);

  return font;
};

export function drawCurrency(
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  rect: Rectangle,
  currency: string,
) {
  const font = getSecondaryFont(theme);

  ctx.fillStyle = theme.textLight;
  ctx.textAlign = "left";
  ctx.font = font;
  ctx.fillText(
    currency,
    rect.x + theme.cellHorizontalPadding,
    rect.y + rect.height / 2 + getMiddleCenterBias(ctx, font),
  );
}

/** Width of text drawn in the secondary font (currency labels, crossed-out prices). */
export function measureSecondaryText(
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  text: string,
): number {
  const font = getSecondaryFont(theme);

  ctx.save();
  ctx.font = font;

  const { width } = measureTextCached(text, ctx, font);

  ctx.restore();

  return width;
}

interface UndiscountedPriceOptions {
  text: string;
  /** Width of `text` from `measureSecondaryText`. */
  textWidth: number;
  /** Width of the current price drawn to the right of the crossed-out one. */
  priceWidth: number;
}

/**
 * Draw the undiscounted price, smaller and muted, with a line through it,
 * to the left of the current price.
 */
export function drawUndiscountedPrice(
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  rect: Rectangle,
  { text, textWidth, priceWidth }: UndiscountedPriceOptions,
): void {
  const font = getSecondaryFont(theme);
  const right = rect.x + rect.width - OFFSET - priceWidth - PRICE_GAP;
  const centerY = rect.y + rect.height / 2;

  ctx.save();
  ctx.font = font;
  ctx.fillStyle = theme.textLight;
  ctx.textAlign = "right";
  ctx.fillText(text, right, centerY + getMiddleCenterBias(ctx, font));
  ctx.fillRect(right - textWidth, centerY, textWidth, 1);
  ctx.restore();
}

interface CurrencyFitWidths {
  cellWidth: number;
  currencyWidth: number;
  /** Width of the right-aligned prices: current price plus any crossed-out price. */
  pricesWidth: number;
}

/**
 * Whether the left-aligned currency label fits next to the prices. When it
 * doesn't, the cell shows the currency symbol on the price instead, so the
 * prices never overlap the label; both prices are always kept so a
 * discounted cell never looks like a regular one.
 */
export function canShowCurrency({
  cellWidth,
  currencyWidth,
  pricesWidth,
}: CurrencyFitWidths): boolean {
  return currencyWidth + OFFSET + pricesWidth <= cellWidth - OFFSET * 2;
}

export function getFormattedMoney(
  value: string | number,
  currency: string,
  locale: Locale,
  placeholder = "",
) {
  if (value !== undefined && value !== null && value !== "") {
    return formatMoneyAmount({ amount: Number(value), currency }, locale);
  }

  return placeholder;
}

export function hasDiscountValue(value: number | null | undefined): value is number {
  return value !== undefined && value !== null;
}

/** Radius of the "has price breakdown" marker dot, in device-independent px. */
const BREAKDOWN_MARKER_RADIUS = 2;

/**
 * Draw a small, subtle dot in the top-right corner of a money cell to signal
 * that the price has a breakdown worth opening (discounted or overridden).
 * Uses the theme accent colour so it reads as an interactive affordance
 * without competing with the price text, which is vertically centred.
 */
export function drawBreakdownMarker(ctx: CanvasRenderingContext2D, theme: Theme, rect: Rectangle) {
  const cx = rect.x + rect.width - OFFSET / 2 - BREAKDOWN_MARKER_RADIUS;
  const cy = rect.y + OFFSET / 2 + BREAKDOWN_MARKER_RADIUS;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, BREAKDOWN_MARKER_RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = theme.accentColor;
  ctx.fill();
  ctx.restore();
}
