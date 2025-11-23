import { DataEditorProps } from "@glideapps/glide-data-grid";

export const preventRowClickOnSelectionCheckbox = (
  rowMarkers: DataEditorProps["rowMarkers"],
  location: number,
) => !["number", "none"].includes(rowMarkers ?? "none") && location === -1;
