import {
  CustomCell,
  CustomCellRenderer,
  getMiddleCenterBias,
  ProvideEditorCallback
} from "@glideapps/glide-data-grid";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { Locale } from "../Locale";
import { usePriceField } from "../PriceField/usePriceField";

interface MoneyCellProps {
  readonly kind: "money-cell";
  readonly currency: string;
  readonly value: number | null;
}

export type MoneyCell = CustomCell<MoneyCellProps>;

const useMoneyCellStyles = makeStyles(
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
  { name: "MoneyCell" }
);

const MoneyCellEdit: ReturnType<ProvideEditorCallback<MoneyCell>> = ({
  value: cell,
  onChange: onChangeBase
}) => {
  const classes = useMoneyCellStyles();
  const { onChange, onKeyDown, minValue, step } = usePriceField(
    cell.data.currency,
    event =>
      onChangeBase({
        ...cell,
        data: {
          ...cell.data,
          value: event.target.value
        }
      })
  );

  return (
    <input
      className={classes.input}
      type="number"
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={cell.data.value ?? ""}
      min={minValue}
      step={step}
      autoFocus
    />
  );
};

export const moneyCellRenderer = (
  locale: Locale
): CustomCellRenderer<MoneyCell> => ({
  isMatch: (c): c is MoneyCell => (c.data as any).kind === "money-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { currency, value } = cell.data;
    const currencyFractionDigits = new Intl.NumberFormat(locale, {
      style: "currency",
      currency
    }).resolvedOptions().maximumFractionDigits;
    const formatted =
      value?.toLocaleString(locale, {
        maximumFractionDigits: currencyFractionDigits,
        minimumFractionDigits: currencyFractionDigits
      }) ?? "-";

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
    editor: MoneyCellEdit,
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
