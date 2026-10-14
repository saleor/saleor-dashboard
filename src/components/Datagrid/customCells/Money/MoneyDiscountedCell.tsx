import { type Locale } from "@dashboard/components/Locale/Locale";
import { formatMoney } from "@dashboard/components/Money";
import { type CustomCell, type CustomRenderer, GridCellKind } from "@glideapps/glide-data-grid";

import {
  canShowCurrency,
  drawBreakdownMarker,
  drawCurrency,
  drawPrice,
  drawUndiscountedPrice,
  getFormattedMoney,
  measureSecondaryText,
  PRICE_GAP,
} from "./utils";

interface MoneyDiscountedCellProps {
  readonly kind: "money-discounted-cell";
  readonly currency: string;
  readonly undiscounted?: string | number;
  readonly value: number | string | null;
  readonly locale: Locale;
  /** When true, draws a subtle dot signalling the price has a breakdown. */
  readonly hasBreakdown?: boolean;
}

export type MoneyDiscuntedCell = CustomCell<MoneyDiscountedCellProps>;

export const moneyDiscountedCellRenderer = (): CustomRenderer<MoneyDiscuntedCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is MoneyDiscuntedCell => (c.data as any).kind === "money-discounted-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { currency, value, undiscounted, locale, hasBreakdown } = cell.data;
    const hasValue = value === 0 ? true : !!value;
    // When the value is unknown we leave the price area blank; `drawCurrency`
    // below already renders a single "-" in the currency column, so emitting
    // another "-" here would produce a duplicate indicator.
    const formattedValue = hasValue ? getFormattedMoney(value ?? "", currency, locale) : "";
    const formattedUndiscounted = getFormattedMoney(
      undiscounted !== value ? (undiscounted ?? "") : "",
      currency,
      locale,
    );
    const isDiscounted = undiscounted !== undefined && undiscounted !== value;
    const currencyLabel = hasValue ? currency : "-";
    const undiscountedWidth = isDiscounted
      ? measureSecondaryText(ctx, theme, formattedUndiscounted)
      : 0;
    // The "-" is the only sign of a missing price, so it is never dropped.
    const showCurrency =
      !hasValue ||
      canShowCurrency({
        cellWidth: rect.width,
        currencyWidth: measureSecondaryText(ctx, theme, currencyLabel),
        pricesWidth:
          ctx.measureText(formattedValue).width +
          (isDiscounted ? undiscountedWidth + PRICE_GAP : 0),
      });
    // Without room for the currency label, keep the currency on the price itself.
    const displayedValue = showCurrency
      ? formattedValue
      : formatMoney({ amount: Number(value), currency }, locale);
    const priceWidth = ctx.measureText(displayedValue).width;

    drawPrice(ctx, theme, rect, displayedValue);

    if (isDiscounted) {
      drawUndiscountedPrice(ctx, theme, rect, {
        text: formattedUndiscounted,
        textWidth: undiscountedWidth,
        priceWidth,
      });
    }

    if (showCurrency) {
      ctx.save();
      drawCurrency(ctx, theme, rect, currencyLabel);
      ctx.restore();
    }

    if (hasBreakdown) {
      drawBreakdownMarker(ctx, theme, rect);
    }

    return true;
  },
});
