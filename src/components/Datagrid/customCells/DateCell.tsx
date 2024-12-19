import { Locale } from "@dashboard/components/Locale";
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  Rectangle,
  Theme,
} from "@glideapps/glide-data-grid";
import type { FullTheme } from "@glideapps/glide-data-grid/src/common/styles";

export const numberCellEmptyValue = Symbol("date-cell-empty-value");
interface DateCellProps {
  readonly kind: "date-cell";
  readonly value: number | typeof numberCellEmptyValue;
}

export type DateCell = CustomCell<DateCellProps>;

type DateFormaters = {
  full: Intl.DateTimeFormat;
  long: Intl.DateTimeFormat;
  short: Intl.DateTimeFormat;
};

export const dateCellRenderer = (locale: Locale): CustomRenderer<DateCell> => {
  const dateFormaters: DateFormaters = {
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

      const cellWidth = getCellWidth(rect, theme);
      const textY = getCellMiddleY(ctx, rect, theme);
      const textXStart = getCellX(rect, theme);

      const displayTime = timeFromater.format(date);

      const { displayDate, justifyToRight } = formatDate({
        date,
        formaters: dateFormaters,
        time: displayTime,
        ctx,
        cellWidth,
      });

      drawText({
        ctx,
        text: displayDate,
        x: textXStart,
        y: textY,
        align: "left",
        color: theme.textDark,
      });

      const dateTextXEnd = textXStart + ctx.measureText(displayDate).width;

      drawText({
        ctx,
        text: displayTime,
        x: calculateTimeX({ rect, theme, justifyToRight, dateTextXEnd }),
        y: textY,
        align: justifyToRight ? "right" : "left",
        color: theme.textLight,
      });

      return true;
    },
  };
};

function formatDate({
  cellWidth,
  ctx,
  date,
  formaters,
  time,
}: {
  date: Date;
  formaters: DateFormaters;
  time: string;
  ctx: CanvasRenderingContext2D;
  cellWidth: number;
}): { displayDate: string; justifyToRight: boolean } {
  const fullFormater = formaters.full.format(date);
  const longFormater = formaters.long.format(date);
  const shortFormater = formaters.short.format(date);

  if (cellWidth >= getTextWidth(ctx, fullFormater, time)) {
    return { displayDate: fullFormater, justifyToRight: true };
  }

  const candidateFormats = [
    {
      format: longFormater,
      width: getTextWidth(ctx, longFormater, time),
    },
    {
      format: shortFormater,
      width: getTextWidth(ctx, shortFormater, time),
    },
  ];

  const displayFormat = candidateFormats.find(format => format.width <= cellWidth)?.format;

  if (!displayFormat) {
    return { displayDate: shortFormater, justifyToRight: false };
  }

  return { displayDate: displayFormat, justifyToRight: true };
}

function drawText({
  align,
  color,
  ctx,
  text,
  x,
  y,
}: {
  ctx: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  align: CanvasTextAlign;
  color: string;
}) {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function getCellMiddleY(ctx: CanvasRenderingContext2D, rect: Rectangle, theme: string | FullTheme) {
  const bias = getMiddleCenterBias(ctx, theme);

  return rect.y + rect.height / 2 + bias;
}

function getCellWidth(rect: Rectangle, theme: Theme) {
  return rect.width - theme.cellHorizontalPadding * 2;
}

function getCellX(rect: Rectangle, theme: Theme) {
  return rect.x + theme.cellHorizontalPadding;
}

function getTextWidth(ctx: CanvasRenderingContext2D, date: string, time: string) {
  return ctx.measureText(`${date} ${time}`).width;
}

function calculateTimeX({
  rect,
  justifyToRight,
  theme,
  dateTextXEnd,
}: {
  rect: Rectangle;
  theme: Theme;
  justifyToRight: boolean;
  dateTextXEnd: number;
}) {
  if (justifyToRight) {
    return rect.x + rect.width - theme.cellHorizontalPadding;
  }

  return dateTextXEnd + 5;
}
