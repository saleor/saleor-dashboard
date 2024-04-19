import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import React from "react";

import { Locale } from "../../Locale";

export const numberCellEmptyValue = Symbol("number-cell-empty-value");
export interface NumberCellProps {
  readonly kind: "number-cell";
  readonly value: number | typeof numberCellEmptyValue;
  readonly options?: {
    format?: "number" | "percent";
    hasFloatingPoint?: boolean;
  };
}

export type NumberCell = CustomCell<NumberCellProps>;

const onlyDigitsRegExp = /^\d+$/;
const flaotingPointDigits = /^[0-9]+[.,]?[0-9]+$/;
const NumberCellEdit: ReturnType<ProvideEditorCallback<NumberCell>> = ({
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
          value: event.target.value ? parseFloat(event.target.value) : numberCellEmptyValue,
        },
      })
    }
    value={cell.data.value === numberCellEmptyValue ? "" : cell.data.value}
    autoFocus
  />
);

export const numberCellRenderer = (locale: Locale): CustomRenderer<NumberCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is NumberCell => (c.data as any).kind === "number-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value, options } = cell.data;
    let formatted = value === numberCellEmptyValue ? "-" : value.toLocaleString(locale);

    if (options?.format === "percent") {
      formatted += "%";
    }

    ctx.fillStyle = theme.textDark;
    ctx.textAlign = "right";
    ctx.fillText(
      formatted,
      rect.x + rect.width - 8,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );

    return true;
  },
  provideEditor: () => ({
    editor: NumberCellEdit,
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
    const testRegExp = data.options?.hasFloatingPoint ? flaotingPointDigits : onlyDigitsRegExp;

    if (!testRegExp.test(value)) {
      return undefined;
    }

    return {
      ...data,
      value: value ? parseFloat(value) : numberCellEmptyValue,
    };
  },
});
