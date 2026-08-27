import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./RangeInputWrapper.module.css";

interface RangeInputWrapperProps {
  children: ReactNode;
  /** Side-by-side start/end when the value column is wide enough (date between). */
  inline?: boolean;
}

export const RangeInputWrapper = ({
  children,
  inline = false,
}: RangeInputWrapperProps): JSX.Element => (
  <Box
    className={clsx(inline && styles.inline)}
    data-range-layout={inline ? "inline" : "stack"}
    display="flex"
    gap={0.5}
    alignItems="center"
    flexWrap="wrap"
    width="100%"
  >
    {children}
  </Box>
);
