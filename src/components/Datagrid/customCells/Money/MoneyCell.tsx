import {
  CustomCell,
  CustomRenderer,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import React from "react";

import { usePriceField } from "../../../PriceField/usePriceField";
import { drawCurrency, drawPrice } from "./utils";

interface MoneyCellProps {
  readonly kind: "money-cell";
  readonly currency: string;
  readonly value: number | string | null;
}

export type MoneyCell = CustomCell<MoneyCellProps>;

const MoneyCellEdit: ReturnType<ProvideEditorCallback<MoneyCell>> = ({
  value: cell,
  onChange: onChangeBase,
}) => {
  const { onChange, onKeyDown, minValue, step } = usePriceField(
    cell.data.currency,
    event =>
      onChangeBase({
        ...cell,
        data: {
          ...cell.data,
          value: event.target.value,
        },
      }),
  );

  return (
    <input
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

export const moneyCellRenderer = (): CustomRenderer<MoneyCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is MoneyCell => (c.data as any).kind === "money-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { currency, value } = cell.data;
    const hasValue = value === 0 ? true : !!value;
    const formatted = value?.toString() ?? "-";

    drawPrice(ctx, theme, rect, formatted);

    ctx.save();

    drawCurrency(ctx, theme, rect, hasValue ? currency : "-");

    ctx.restore();
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
        value: cell.data.value ?? null,
      },
    }),
  }),
  onPaste: (value, data) => ({
    ...data,
    value: parseFloat(value),
  }),
});
