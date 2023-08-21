// @ts-strict-ignore
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import React from "react";

import { Locale } from "../../Locale";

export const numberCellEmptyValue = Symbol("date-cell-empty-value");
interface DateCellProps {
  readonly kind: "date-cell";
  readonly value: number | typeof numberCellEmptyValue;
}

export type DateCell = CustomCell<DateCellProps>;

const onlyDigitsRegExp = /^\d+$/;

const DateCellEdit: ReturnType<ProvideEditorCallback<DateCell>> = ({
  value: cell,
  onChange,
}) => (
  <input
    type="number"
    onChange={event =>
      onChange({
        ...cell,
        data: {
          ...cell.data,
          value: event.target.value ? parseFloat(event.target.value) : null,
        },
      })
    }
    value={cell.data.value === numberCellEmptyValue ? "" : cell.data.value}
    autoFocus
  />
);

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

    let time = new Intl.DateTimeFormat(locale, {
      timeStyle: "short",
    }).format(date);

    let displayDate = dateFormats.full;

    ctx.textAlign = "left";
    let justifyToRight = true;

    if (
      ctx.measureText(`${displayDate} ${time}`).width >
      rect.width - theme.cellHorizontalPadding * 2
    ) {
      if (
        ctx.measureText(`${dateFormats.long} ${time}`).width >
        rect.width - theme.cellHorizontalPadding * 2
      ) {
        if (
          ctx.measureText(`${dateFormats.short} ${time}`).width >
          rect.width - theme.cellHorizontalPadding * 2
        ) {
          if (
            ctx.measureText(`${dateFormats.short} ${time}`).width >
            rect.width - theme.cellHorizontalPadding * 2
          ) {
            displayDate = dateFormats.short;
            justifyToRight = false;
          } else {
            displayDate = dateFormats.short;
          }
        } else {
          displayDate = dateFormats.short;
        }
      } else {
        displayDate = dateFormats.long;
      }
    }

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
  provideEditor: () => ({
    editor: DateCellEdit,
    disablePadding: true,
    deletedValue: cell => ({
      ...cell,
      copyData: "",
      data: {
        ...cell.data,
        value: numberCellEmptyValue,
      },
    }),
  }),
  onPaste: (value, data) => {
    if (!onlyDigitsRegExp.test(value)) {
      return undefined;
    }

    return {
      ...data,
      value: value ? parseFloat(value) : numberCellEmptyValue,
    };
  },
});
