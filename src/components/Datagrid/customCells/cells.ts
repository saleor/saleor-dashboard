import {
  NumberCell,
  numberCellEmptyValue,
  NumberCellProps,
} from "@dashboard/components/Datagrid/customCells/NumberCell";
import { Locale } from "@dashboard/components/Locale";
import { DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import {
  CustomCell,
  GridCell,
  GridCellKind,
  TextCell,
} from "@glideapps/glide-data-grid";

import {
  DropdownCell,
  DropdownCellContentProps,
  DropdownChoice,
} from "./DropdownCell";
import { MoneyCell, MoneyDiscuntedCell } from "./Money";
import {
  hueToPillColorLight,
  PillCell,
  PillColor,
  stringToHue,
} from "./PillCell";
import { StatusCell } from "./StatusCell";
import { ThumbnailCell } from "./ThumbnailCell";

const common = {
  allowOverlay: true,
  readonly: false,
};

export function textCell(value: string, opts?: Partial<TextCell>): GridCell {
  return {
    ...common,
    data: value,
    displayData: value,
    kind: GridCellKind.Text,
    ...opts,
  };
}

export function readonlyTextCell(
  value: string,
  hasCursorPointer: boolean = true,
): TextCell {
  return {
    cursor: hasCursorPointer ? "pointer" : "default",
    allowOverlay: false,
    readonly: true,
    data: value,
    displayData: value,
    kind: GridCellKind.Text,
  };
}

export function tagsCell(
  tags: Array<{ tag: string; color: string }>,
  selectedTags: string[],
  opts?: Partial<GridCell>,
): GridCell {
  return {
    allowOverlay: true,
    ...opts,
    kind: GridCellKind.Custom,
    copyData: selectedTags.join(", "),
    data: {
      kind: "tags-cell",
      possibleTags: tags,
      tags: selectedTags,
    },
  };
}

export function booleanCell(
  value: boolean,
  options: Partial<GridCell> = {},
): GridCell {
  return {
    ...common,
    ...options,
    allowOverlay: false,
    kind: GridCellKind.Boolean,
    data: value,
  };
}

export function loadingCell(): GridCell {
  return {
    kind: GridCellKind.Custom,
    allowOverlay: true,
    copyData: "",
    data: {
      kind: "spinner-cell",
    },
  };
}

export function numberCell(
  value: number | typeof numberCellEmptyValue,
  options?: NumberCellProps["options"],
): NumberCell {
  return {
    ...common,
    data: {
      kind: "number-cell",
      value,
      options,
    },
    kind: GridCellKind.Custom,
    copyData: value !== numberCellEmptyValue ? value.toString() : "",
  };
}

export function buttonCell(title: string, cb: () => void): CustomCell {
  return {
    kind: GridCellKind.Custom,
    cursor: "pointer",
    allowOverlay: true,
    copyData: "4",
    readonly: true,
    data: {
      kind: "button-cell",
      color: "accentColor",
      borderColor: ["accentLight", "accentColor"],
      borderRadius: 9,
      title,
      onClick: cb,
    },
  };
}

export function moneyCell(
  value: number | number[] | null,
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

interface MoneyDiscountedCellData {
  value: number | string | null;
  discount?: string | number;
  undiscounted?: string | number;
  currency: string;
  locale: Locale;
  lineItemId?: string;
}

export function moneyDiscountedCell(
  {
    value,
    undiscounted,
    currency,
    locale,
    lineItemId,
  }: MoneyDiscountedCellData,
  opts?: Partial<GridCell>,
): MoneyDiscuntedCell {
  return {
    ...common,
    ...opts,
    kind: GridCellKind.Custom,
    data: {
      kind: "money-discounted-cell",
      value,
      currency,
      undiscounted,
      lineItemId,
      locale,
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

export function statusCell(
  status: DotStatus,
  value: string,
  opts?: Partial<GridCell>,
): StatusCell {
  return {
    ...common,
    ...opts,
    kind: GridCellKind.Custom,
    copyData: value ?? "",
    data: {
      kind: "status-cell",
      value,
      status,
    },
  };
}

export function pillCell(
  value: string,
  color: PillColor | null,
  opts?: Partial<GridCell>,
): PillCell {
  const pillColor = color;
  const fallbackColor = hueToPillColorLight(stringToHue(value));
  return {
    ...common,
    ...opts,
    copyData: value ?? "",
    data: {
      kind: "auto-tags-cell",
      value,
      color: pillColor ?? fallbackColor,
    },
    kind: GridCellKind.Custom,
  };
}

export function dateCell(value: string, opts?: Partial<GridCell>): GridCell {
  return {
    ...common,
    ...opts,
    copyData: value ?? "",
    data: {
      kind: "date-cell",
      value,
    },
    kind: GridCellKind.Custom,
  };
}
