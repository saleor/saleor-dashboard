import { Box, type PropsWithBox } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import styles from "./DashboardModal.module.css";
import { MODAL_BODY_DISPLAY_NAME } from "./modalDisplayNames";

type BodyProps = PropsWithBox<{
  bleed?: boolean;
  children: ReactNode;
}>;

export const Body = ({ bleed = false, children, className, ...rest }: BodyProps) => {
  return (
    <Box
      className={clsx(styles.body, bleed && styles.bodyBleed, className)}
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
