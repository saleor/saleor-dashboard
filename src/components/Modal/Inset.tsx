import { Box, type PropsWithBox } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./DashboardModal.module.css";

export const Inset = ({ children, ...rest }: PropsWithBox<{ children: ReactNode }>) => {
  return (
    <Box className={styles.modalBodyInset} {...rest}>
      {children}
    </Box>
  );
};
