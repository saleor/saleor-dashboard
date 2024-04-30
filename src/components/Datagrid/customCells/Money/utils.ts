import { Locale } from "@dashboard/components/Locale";
import { formatMoneyAmount } from "@dashboard/components/Money";
import { getMiddleCenterBias, Rectangle, Theme } from "@glideapps/glide-data-grid";

const OFFSET = 8;

export function drawLineCrossedPrice(
  ctx: CanvasRenderingContext2D,
  rect: Rectangle,
  discountedPrice: string,
  undiscountedPrice: string,
) {
  const { width: totalTextWidth } = ctx.measureText(discountedPrice);
  const { width: undiscountedTextWidth } = ctx.measureText(undiscountedPrice);

  ctx.fillRect(
    rect.x + rect.width - OFFSET - totalTextWidth,
    rect.y + rect.height / 2,
    undiscountedTextWidth,
    1,
  );
}

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

export function drawCurrency(
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  rect: Rectangle,
  currency: string,
) {
  ctx.fillStyle = theme.textMedium;
  ctx.textAlign = "left";
  ctx.font = [theme.baseFontStyle.replace(/bold/g, "normal"), theme.fontFamily].join(" ");
  ctx.fillText(currency, rect.x + 8, rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme));
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
