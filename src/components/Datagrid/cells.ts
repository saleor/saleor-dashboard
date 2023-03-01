import {
  NumberCell,
  numberCellEmptyValue,
} from "@dashboard/components/Datagrid/NumberCell";
import { GridCell, GridCellKind } from "@glideapps/glide-data-grid";

import {
  DropdownCell,
  DropdownCellContentProps,
  DropdownChoice,
} from "./DropdownCell";
import { MoneyCell } from "./MoneyCell";
import { ThumbnailCell } from "./ThumbnailCell";

const common = {
  allowOverlay: true,
  readonly: false,
};

export function textCell(value: string, opts?: Partial<GridCell>): GridCell {
  return {
    ...common,
    ...opts,
    data: value,
    displayData: value,
    kind: GridCellKind.Text,
  };
}

export function readonlyTextCell(
  value: string,
  opts?: Partial<GridCell>,
): GridCell {
  return {
    ...opts,
    allowOverlay: false,
    readonly: true,
    data: value,
    displayData: value,
    kind: GridCellKind.Text,
  };
}

export function booleanCell(
  value: boolean,
  opts?: Partial<GridCell>,
): GridCell {
  return {
    ...common,
    ...opts,
    allowOverlay: false,
    kind: GridCellKind.Boolean,
    data: value,
  };
}

export function loadingCell(): GridCell {
  return {
    kind: GridCellKind.Loading,
    allowOverlay: true,
  };
}

export function numberCell(
  value: number | typeof numberCellEmptyValue,
  opts?: Partial<GridCell>,
): NumberCell {
  return {
    ...common,
    ...opts,
    data: {
      kind: "number-cell",
      value,
    },
    kind: GridCellKind.Custom,
    copyData: value !== numberCellEmptyValue ? value.toString() : "",
  };
}

export function moneyCell(
  value: number | null,
  currency: string,
  opts?: Partial<GridCell>,
): MoneyCell {
  return {
    ...common,
    ...opts,
    kind: GridCellKind.Custom,
    data: {
      kind: "money-cell",
      value,
      currency,
    },
    copyData: value?.toString() ?? "",
  };
}

export function dropdownCell(
  value: DropdownChoice,
  dataOpts: DropdownCellContentProps &
    (
      | { choices: DropdownChoice[] }
      | { update: (text: string) => Promise<DropdownChoice[]> }
    ),
  opts?: Partial<GridCell>,
): DropdownCell {
  return {
    ...common,
    ...opts,
    data: {
      ...dataOpts,
      kind: "dropdown-cell",
      value,
    },
    kind: GridCellKind.Custom,
    copyData: value.label,
  };
}

export function thumbnailCell(
  name: string,
  image: string,
  opts?: Partial<GridCell>,
): ThumbnailCell {
  return {
    ...common,
    ...opts,
    kind: GridCellKind.Custom,
    copyData: name ?? "",
    data: {
      kind: "thumbnail-cell",
      image,
      name,
    },
  };
}
