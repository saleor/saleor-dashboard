import { Box, type PropsWithBox } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./DashboardModal.module.css";
import { MODAL_BODY_DISPLAY_NAME } from "./modalDisplayNames";

type BodyProps = PropsWithBox<{
  children: ReactNode;
  fill?: boolean;
}>;

export const Body = ({ children, className, fill = false, ...rest }: BodyProps) => {
  return (
    <Box
      className={clsx(styles.body, fill && styles.bodyFill, className)}
      flexGrow="1"
      overflowY="auto"
      __minHeight="0"
      {...rest}
    >
      {children}
    </Box>
  );
};

Body.displayName = MODAL_BODY_DISPLAY_NAME;
