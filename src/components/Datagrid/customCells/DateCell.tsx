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

    if (value === numberCellEmptyValue) return false;

    const date = new Date(value);

    const dateFormats = {
      full: new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
      }).format(date),
      long: new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
      }).format(date),
      short: new Intl.DateTimeFormat(locale, {
        dateStyle: "short",
      }).format(date),
    };

    const time = new Intl.DateTimeFormat(locale, {
      timeStyle: "short",
    }).format(date);

    let displayDate = dateFormats.full;

    ctx.textAlign = "left";
    let justifyToRight = true;

    const candidateFormats = [
      {
        format: dateFormats.short,
        width: ctx.measureText(`${dateFormats.short} ${time}`).width,
      },
      {
        format: dateFormats.long,
        width: ctx.measureText(`${dateFormats.long} ${time}`).width,
      },
      {
        format: displayDate,
        width: ctx.measureText(`${displayDate} ${time}`).width,
      },
    ];

    let chosenFormat = candidateFormats.find(
      candidate =>
        candidate.width <= rect.width - theme.cellHorizontalPadding * 2,
    );

    if (!chosenFormat) {
      chosenFormat = candidateFormats[candidateFormats.length - 1];
    }

    displayDate = chosenFormat.format;
    justifyToRight =
      chosenFormat.format === dateFormats.short ? false : justifyToRight;

    ctx.fillStyle = theme.textDark;

    ctx.fillText(
      displayDate,
      rect.x + theme.cellHorizontalPadding,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );

    ctx.fillStyle = theme.textLight;
    ctx.textAlign = justifyToRight ? "right" : "left";
    ctx.fillText(
      time,
      justifyToRight
        ? rect.x + rect.width - theme.cellHorizontalPadding
        : rect.x +
            theme.cellHorizontalPadding +
            ctx.measureText(displayDate).width +
            5,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );

    return true;
  },
});
