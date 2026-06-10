import { type Locale } from "@dashboard/components/Locale";
import { type CustomCell, type CustomRenderer, GridCellKind } from "@glideapps/glide-data-grid";

import { drawCurrency, drawLineCrossedPrice, drawPrice, getFormattedMoney } from "./utils";

interface MoneyDiscountedCellProps {
  readonly kind: "money-discounted-cell";
  readonly currency: string;
  readonly undiscounted?: string | number;
  readonly value: number | string | null;
  readonly locale: Locale;
}

export type MoneyDiscuntedCell = CustomCell<MoneyDiscountedCellProps>;

export const moneyDiscountedCellRenderer = (): CustomRenderer<MoneyDiscuntedCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is MoneyDiscuntedCell => (c.data as any).kind === "money-discounted-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { currency, value, undiscounted, locale } = cell.data;
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
    const formattedWithDiscount = formattedUndiscounted + " " + formattedValue;
    const isDiscounted = undiscounted !== undefined && undiscounted !== value;

    drawPrice(ctx, theme, rect, formattedWithDiscount);

    if (isDiscounted) {
      drawLineCrossedPrice(ctx, rect, formattedWithDiscount, formattedUndiscounted);
    }

    ctx.save();
    drawCurrency(ctx, theme, rect, hasValue ? currency : "-");
    ctx.restore();

    return true;
  },
});
