import { DataEditorProps } from "@glideapps/glide-data-grid";

import { ColumnPickerProps } from "../ColumnPicker";

export const getDefultColumnPickerProps = (
  className: string,
): Partial<ColumnPickerProps> => ({
  IconButtonProps: {
    className,
    variant: "ghost",
    hoverOutline: false,
  },
});

export const preventRowClickOnSelectionCheckbox = (
  rowMarkers: DataEditorProps["rowMarkers"],
  location: number,
) => !["number", "none"].includes(rowMarkers) && location === -1;
