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

export const dateCellRenderer = (locale: Locale): CustomRenderer<DateCell> => {
  const dateFormaters = {
    full: new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
    }),
    long: new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
    }),
    short: new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
    }),
  };

  const timeFromater = new Intl.DateTimeFormat(locale, {
    timeStyle: "short",
  });

  return {
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

      const time = timeFromater.format(date);

      ctx.textAlign = "left";

      let justifyToRight = true;

      const fullFormater = dateFormaters.full.format(date);
      const fullFormaterWidth = ctx.measureText(`${fullFormater} ${time}`).width;
      const longFormater = dateFormaters.long.format(date);
      const shortFormater = dateFormaters.short.format(date);

      const cellWidth = rect.width - theme.cellHorizontalPadding * 2;
      let displayDate: string | undefined = fullFormater;

      if (cellWidth < fullFormaterWidth) {
        const candidateFormats = [
          {
            format: longFormater,
            width: ctx.measureText(`${longFormater} ${time}`).width,
          },
          {
            format: shortFormater,
            width: ctx.measureText(`${shortFormater} ${time}`).width,
          },
        ];

        displayDate = candidateFormats.find(format => format.width <= cellWidth)?.format;

        if (!displayDate) {
          displayDate = shortFormater;
          justifyToRight = false;
        }
      }

      const bias = getMiddleCenterBias(ctx, theme);

      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        displayDate,
        rect.x + theme.cellHorizontalPadding,
        rect.y + rect.height / 2 + bias,
      );

      ctx.fillStyle = theme.textLight;
      ctx.textAlign = justifyToRight ? "right" : "left";
      ctx.fillText(
        time,
        justifyToRight
          ? rect.x + rect.width - theme.cellHorizontalPadding
          : rect.x + theme.cellHorizontalPadding + ctx.measureText(displayDate).width + 5,
        rect.y + rect.height / 2 + bias,
      );

      return true;
    },
  };
};
