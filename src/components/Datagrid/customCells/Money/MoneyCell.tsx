import { Locale } from "@dashboard/components/Locale";
import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";

import { usePriceField } from "../../../PriceField/usePriceField";
import { hasDiscountValue } from "./utils";

interface MoneyCellProps {
  readonly kind: "money-cell";
  readonly currency: string;
  readonly value: number | number[] | null;
}

export type MoneyCell = CustomCell<MoneyCellProps>;

const MoneyCellEdit: ReturnType<ProvideEditorCallback<MoneyCell>> = ({
  value: cell,
  onChange: onChangeBase,
}) => {
  const { onChange, onKeyDown, minValue, step } = usePriceField(cell.data.currency, event =>
    onChangeBase({
      ...cell,
      data: {
        ...cell.data,
        value: event.target.value,
      },
    }),
  );

  // TODO: range is read only - we don't need support for editing,
  // it is better to split component into range and editable money cell
  return (
    <input
      type="number"
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={Array.isArray(cell.data.value) ? "" : cell.data.value ?? ""}
      min={minValue}
      step={step}
      autoFocus
    />
  );
};

export const moneyCellRenderer = (locale: Locale): CustomRenderer<MoneyCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is MoneyCell => (c.data as any).kind === "money-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { currency, value } = cell.data;
    const isRange = Array.isArray(value);
    const displayValue = isRange ? value[0] : value;

    if (!hasDiscountValue(displayValue) || !currency) {
      return true;
    }

    const codeFormatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currencyDisplay: "code",
      currency,
    });
    const symbolFormatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currencyDisplay: "symbol",
      currency,
    });

    if (!("formatRangeToParts" in codeFormatter)) {
      return true;
    }

    const format = isRange
      ? codeFormatter.formatRangeToParts(value[0], value[1])
      : codeFormatter.formatToParts(displayValue);
    const shortFormat = isRange
      ? symbolFormatter.formatRangeToParts(value[0], value[1])
      : symbolFormatter.formatToParts(displayValue);

    // TODO: replace with macaw-ui theme font weight values
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
