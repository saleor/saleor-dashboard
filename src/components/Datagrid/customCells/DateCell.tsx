import { Locale } from "@dashboard/components/Locale";
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";

export const numberCellEmptyValue = Symbol("date-cell-empty-value");
interface DateCellProps {
  readonly kind: "date-cell";
  readonly value: number | typeof numberCellEmptyValue;
}

export type DateCell = CustomCell<DateCellProps>;

export const dateCellRenderer = (locale: Locale): CustomRenderer<DateCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is DateCell => (c.data as any).kind === "date-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;

    if (value === numberCellEmptyValue) return;

    const date = new Date(value);

    if (isNaN(date?.getTime())) {
      // invalid date object
      return;
    }

    const dateFormat = new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
    }).format(date);

    const time = new Intl.DateTimeFormat(locale, {
      timeStyle: "short",
    }).format(date);

    ctx.textAlign = "left";

    const justifyToRight = false;

    ctx.fillStyle = theme.textDark;
    ctx.fillText(
      dateFormat,
      rect.x + theme.cellHorizontalPadding,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );
    ctx.fillStyle = theme.textLight;
    ctx.textAlign = justifyToRight ? "right" : "left";
    ctx.fillText(
      time,
      justifyToRight
        ? rect.x + rect.width - theme.cellHorizontalPadding
        : rect.x + theme.cellHorizontalPadding + ctx.measureText(dateFormat).width + 5,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );

    return true;
  },
});
