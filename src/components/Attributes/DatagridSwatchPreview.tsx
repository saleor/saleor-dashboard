import { SwatchPreview } from "@dashboard/attributes/components/SwatchPreview/SwatchPreview";
import clsx from "clsx";

import styles from "./DatagridSwatchPreview.module.css";
import { type AttributeSwatchData } from "./getAttributeSwatchData";

/** Shared size for combobox adornments and canvas-drawn swatches. */
export const DATAGRID_SWATCH_SIZE = 16;

interface DatagridSwatchPreviewProps extends AttributeSwatchData {
  size?: number;
  /**
   * `input` — closed combobox field (needs vertical centering in Macaw’s wrapper).
   * `option` — list rows (already centered by List.Item; avoid transform).
   */
  placement?: "input" | "option";
}

/**
 * Compact circular swatch for DynamicCombobox options / selected value.
 */
export const DatagridSwatchPreview = ({
  colorValue,
  fileUrl,
  size = DATAGRID_SWATCH_SIZE,
  placement = "option",
}: DatagridSwatchPreviewProps): JSX.Element => (
  <span
    className={clsx(styles.adornment, placement === "input" && styles.adornmentInput)}
    style={{ width: size }}
  >
    <SwatchPreview color={colorValue} imageUrl={fileUrl} size={size} shape="circle" />
  </span>
);
