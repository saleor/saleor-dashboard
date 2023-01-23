import {
  CustomCell,
  CustomCellRenderer,
  getMiddleCenterBias,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import React from "react";

import { usePriceField } from "../PriceField/usePriceField";

interface MoneyCellProps {
  readonly kind: "money-cell";
  readonly currency: string;
  readonly value: number | null;
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

export const moneyCellRenderer = (): CustomCellRenderer<MoneyCell> => ({
  isMatch: (c): c is MoneyCell => (c.data as any).kind === "money-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { currency, value } = cell.data;
    const hasValue = value === 0 ? true : !!value;
    const formatted = value?.toString() ?? "-";

    ctx.fillStyle = theme.textDark;
    ctx.textAlign = "right";
    ctx.fillText(
      formatted,
      rect.x + rect.width - 8,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );

    ctx.save();
    ctx.fillStyle = theme.textMedium;
    ctx.textAlign = "left";
    ctx.font = [
      theme.baseFontStyle.replace(/bold/g, "normal"),
      theme.fontFamily,
    ].join(" ");
    ctx.fillText(
      hasValue ? currency : "-",
      rect.x + 8,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );
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
