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

    // if (isNaN(date?.getTime())) {
    //   // invalid date object
    //   return;
    // }

    // const dateFormats = {
    //   full: new Intl.DateTimeFormat(locale, {
    //     dateStyle: "full",
    //   }).format(date),
    //   long: new Intl.DateTimeFormat(locale, {
    //     dateStyle: "long",
    //   }).format(date),
    //   short: new Intl.DateTimeFormat(locale, {
    //     dateStyle: "short",
    //   }).format(date),
    // };
    // const time = new Intl.DateTimeFormat(locale, {
    //   timeStyle: "short",
    // }).format(date);

    // ctx.textAlign = "left";

    // let justifyToRight = true;

    // const candidateFormats = [
    //   {
    //     format: dateFormats.full,
    //     width: ctx.measureText(`${dateFormats.full} ${time}`).width,
    //   },
    //   {
    //     format: dateFormats.long,
    //     width: ctx.measureText(`${dateFormats.long} ${time}`).width,
    //   },
    //   {
    //     format: dateFormats.short,
    //     width: ctx.measureText(`${dateFormats.short} ${time}`).width,
    //   },
    // ];
    // const cellWidth = rect.width - theme.cellHorizontalPadding * 2;
    // let displayDate: string | undefined = dateFormats.full;

    // if (cellWidth < candidateFormats[0].width) {
    //   displayDate = candidateFormats.find(format => format.width <= cellWidth)?.format;

    //   if (!displayDate) {
    //     displayDate = dateFormats.short;
    //     justifyToRight = false;
    //   }
    // }

    ctx.fillStyle = theme.textDark;
    ctx.fillText(
      date.toISOString(),
      rect.x + theme.cellHorizontalPadding,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );
    ctx.fillStyle = theme.textLight;
    // ctx.fillText(
    //   time,
    //   justifyToRight
    //     ? rect.x + rect.width - theme.cellHorizontalPadding
    //     : rect.x + theme.cellHorizontalPadding + ctx.measureText(displayDate).width + 5,
    //   rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    // );

    return true;
  },
});
