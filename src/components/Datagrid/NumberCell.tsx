import {
  CustomCell,
  CustomCellRenderer,
  getMiddleCenterBias,
  ProvideEditorCallback
} from "@glideapps/glide-data-grid";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { Locale } from "../Locale";

interface NumberCellProps {
  readonly kind: "number-cell";
  readonly value: number;
}

export type NumberCell = CustomCell<NumberCellProps>;

const useNumberCellStyles = makeStyles(
  theme => ({
    input: {
      ...theme.typography.body1,
      appearance: "none",
      background: "none",
      border: "none",
      padding: theme.spacing(1.5, 1),
      outline: 0,
      textAlign: "right"
    }
  }),
  { name: "NumberCell" }
);

const NumberCellEdit: ReturnType<ProvideEditorCallback<NumberCell>> = ({
  value: cell,
  onChange
}) => {
  const classes = useNumberCellStyles();

  return (
    <input
      className={classes.input}
      type="number"
      onChange={event =>
        onChange({
          ...cell,
          data: {
            ...cell.data,
            value: event.target.value ? parseFloat(event.target.value) : null
          }
        })
      }
      value={cell.data.value}
      autoFocus
    />
  );
};

export const numberCellRenderer = (
  locale: Locale
): CustomCellRenderer<NumberCell> => ({
  isMatch: (c): c is NumberCell => (c.data as any).kind === "number-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;
    const formatted = value?.toLocaleString(locale) ?? "-";
    ctx.fillStyle = theme.textDark;
    ctx.textAlign = "right";
    ctx.fillText(
      formatted,
      rect.x + rect.width - 8,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
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
        value: cell.data.value ?? null
      }
    })
  }),
  onPaste: (value, data) => ({
    ...data,
    value: parseFloat(value)
  })
});
