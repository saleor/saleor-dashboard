import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import React from "react";

import { Locale } from "../../Locale";

export const numberCellEmptyValue = Symbol();
interface NumberCellProps {
  readonly kind: "number-cell";
  readonly value: number | typeof numberCellEmptyValue;
}

export type NumberCell = CustomCell<NumberCellProps>;

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
          value: event.target.value ? parseFloat(event.target.value) : null,
        },
      })
    }
    value={cell.data.value === numberCellEmptyValue ? "" : cell.data.value}
    autoFocus
  />
);

export const numberCellRenderer = (
  locale: Locale,
): CustomRenderer<NumberCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is NumberCell => (c.data as any).kind === "number-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;
    const formatted =
      value === numberCellEmptyValue ? "-" : value.toLocaleString(locale);
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
  onPaste: (value, data) => ({
    ...data,
    value: value ? parseFloat(value) : numberCellEmptyValue,
  }),
});
