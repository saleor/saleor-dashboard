import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import React from "react";

import { usePriceField } from "../../../PriceField/usePriceField";

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

// todo replace this with actual user settings. Using this to avoid prop drilling
const locale = (navigator && navigator.language) || "en";

export const moneyCellRenderer = (): CustomRenderer<MoneyCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is MoneyCell => (c.data as any).kind === "money-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { currency, value } = cell.data;

    const hasValue = value === 0 ? true : !!value;

    if (!hasValue) {
      return true;
    }

    // todo add range support
    const format = new Intl.NumberFormat(locale, {
      style: "currency",
      currencyDisplay: "code",
      currency,
    }).formatToParts(value);

    const shortFormat = new Intl.NumberFormat(locale, {
      style: "currency",
      currencyDisplay: "symbol",
      currency,
    }).formatToParts(value);

    // todo replace with macaw-ui theme font weight values
    ctx.font = `550 ${theme.baseFontStyle} ${theme.fontFamily}`;

    const w = ctx.measureText(format.map(x => x.value).join(""));
    const isHugging = w.width > rect.width - theme.cellHorizontalPadding * 2;

    let drawingPosition = rect.x + rect.width - theme.cellHorizontalPadding;
    const y = rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme);

    const displayFormat = isHugging ? shortFormat : format;

    for (const item of displayFormat.reverse()) {
      ctx.textAlign = "right";
      if (item.type === "currency" && item.value.length > 2) {
        ctx.fillStyle = theme.textLight;
      } else {
        ctx.fillStyle = theme.textDark;
      }

      if (item.type === "currency" && item.value.length > 2 && !isHugging) {
        ctx.textAlign = "left";
        ctx.fillText(item.value, rect.x + theme.cellHorizontalPadding, y);
      } else {
        ctx.fillText(item.value, drawingPosition, y);
        const textWidth = ctx.measureText(item.value).width;
        drawingPosition -= textWidth;
      }
    }

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
