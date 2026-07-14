import { Box, type PropsWithBox } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./DashboardModal.module.css";
import { MODAL_ACTIONS_DISPLAY_NAME } from "./modalDisplayNames";

export const Actions = ({ children, ...rest }: PropsWithBox<{ children: ReactNode }>) => {
  return (
    <Box
      className={styles.actions}
      display="flex"
      justifyContent="flex-end"
      gap={4}
      flexShrink="0"
      {...rest}
    >
      {children}
    </Box>
  );
};

Actions.displayName = MODAL_ACTIONS_DISPLAY_NAME;
