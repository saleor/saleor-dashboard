// @ts-strict-ignore
import { DataEditorProps } from "@glideapps/glide-data-grid";

export const preventRowClickOnSelectionCheckbox = (
  rowMarkers: DataEditorProps["rowMarkers"],
  location: number,
) => typeof rowMarkers === "string" && !["number", "none"].includes(rowMarkers) && location === -1;
