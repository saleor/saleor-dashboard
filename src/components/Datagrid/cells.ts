import { GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import { NumberCell } from "@saleor/components/Datagrid/NumberCell";

import { MoneyCell } from "./MoneyCell";

const common = {
  allowOverlay: true,
  readonly: false,
};

export function textCell(value: string): GridCell {
  return {
    ...common,
    data: value,
    displayData: value,
    kind: GridCellKind.Text,
  };
}

export function booleanCell(value: boolean): GridCell {
  return {
    ...common,
    allowOverlay: false,
    kind: GridCellKind.Boolean,
    data: value,
  };
}

export function numberCell(value: number | null): NumberCell {
  return {
    ...common,
    data: {
      kind: "number-cell",
      value,
    },
    kind: GridCellKind.Custom,
    copyData: value !== null ? value.toString() : "",
  };
}

export function moneyCell(value: number | null, currency: string): MoneyCell {
  return {
    ...common,
    kind: GridCellKind.Custom,
    data: {
      kind: "money-cell",
      value,
      currency,
    },
    copyData: value !== null ? value.toString() : "",
  };
}
