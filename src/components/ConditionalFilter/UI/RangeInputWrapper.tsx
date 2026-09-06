import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./RangeInputWrapper.module.css";

interface RangeInputWrapperProps {
  children: ReactNode;
  /** Side-by-side start/end when the value column is wide enough (date between). */
  inline?: boolean;
  /** Content-sized cap; datetime is wider than date. */
  compact?: "date" | "datetime";
}

export const RangeInputWrapper = ({
  children,
  inline = false,
  compact = "date",
}: RangeInputWrapperProps): React.ReactNode => (
  <Box
    className={clsx(styles.root, inline && styles.inline)}
    data-range-layout={inline ? "inline" : "stack"}
    data-range-size={inline ? compact : undefined}
    width={inline ? undefined : "100%"}
    __minWidth="0"
  >
    {children}
  </Box>
);
