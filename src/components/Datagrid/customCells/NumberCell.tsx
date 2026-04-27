import {
  type CustomCell,
  type CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
  type ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import { type ChangeEvent, type CSSProperties, useState } from "react";

import { type Locale } from "../../Locale";

export const numberCellEmptyValue = Symbol("number-cell-empty-value");
export interface NumberCellProps {
  readonly kind: "number-cell";
  readonly value: number | typeof numberCellEmptyValue;
  readonly options?: {
    format?: "number" | "percent";
    hasFloatingPoint?: boolean;
    cursor?: "pointer" | "default";
  };
}

export type NumberCell = CustomCell<NumberCellProps>;

const floatOrDigits = /^\d+$|^[0-9]+[.,]?[0-9]+$/;

const editorInputStyle: CSSProperties = {
  appearance: "none",
  background: "none",
  border: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  fontSize: "inherit",
  height: "100%",
  outline: "none",
  padding: "0 8px",
  textAlign: "right",
  width: "100%",
};

const formatNumberInput = (value: string, hasFloatingPoint: boolean): string => {
  const normalized = value.replace(/,/g, ".");
  const filtered = normalized.replace(/[^\d.]/g, "");

  if (!filtered) return "";

  if (!hasFloatingPoint) {
    return filtered.replace(/\./g, "").replace(/^0+(\d)/, "$1");
  }

  const firstDotIndex = filtered.indexOf(".");

  if (firstDotIndex === -1) {
    return filtered.replace(/^0+(\d)/, "$1");
  }

  let integerPart = filtered.slice(0, firstDotIndex) || "0";
  const decimalPart = filtered.slice(firstDotIndex + 1).replace(/\./g, "");

  integerPart = integerPart.replace(/^0+(\d)/, "$1");

  return `${integerPart}.${decimalPart}`;
};

const NumberCellEdit: ReturnType<ProvideEditorCallback<NumberCell>> = ({
  value: cell,
  onChange,
}) => {
  const hasFloatingPoint = cell.data.options?.hasFloatingPoint ?? true;

  const [inputValue, setInputValue] = useState<string>(
    cell.data.value === numberCellEmptyValue ? "" : String(cell.data.value),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = String(e.target.value ?? "");
    const formattedValue = formatNumberInput(rawValue, hasFloatingPoint);

    if (!formattedValue && rawValue) return;

    setInputValue(formattedValue);
    onChange({
      ...cell,
      data: {
        ...cell.data,
        value: formattedValue ? parseFloat(formattedValue) : numberCellEmptyValue,
      },
    });
  };

  return (
    <input
      type="text"
      inputMode={hasFloatingPoint ? "decimal" : "numeric"}
      autoComplete="off"
      onChange={handleChange}
      value={inputValue}
      style={editorInputStyle}
      autoFocus
    />
  );
};

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
    disableStyling: true,
    styleOverride: {
      backgroundColor: "var(--gdg-bg-cell)",
      boxShadow: "inset 0 0 0 1.5px var(--gdg-accent-color)",
      width: 0,
      height: 0,
    },
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
    const isValueValid = floatOrDigits.test(value);

    return {
      ...data,
      value: isValueValid ? parseFloat(value) : numberCellEmptyValue,
    };
  },
});
