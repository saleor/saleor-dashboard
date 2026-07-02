import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import { Close } from "./Close";
import modalStyles from "./DashboardModal.module.css";
import styles from "./PickerHeader.module.css";
import { Title } from "./Title";

interface PickerHeaderProps {
  children: ReactNode;
  toolbar?: ReactNode;
}

export const PickerHeader = ({ children, toolbar }: PickerHeaderProps) => {
  return (
    <Box className={styles.wrapper} flexShrink="0">
      <Box
        className={modalStyles.modalChromeHeader}
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={4}
      >
        <Box minWidth={0}>
          <Title>{children}</Title>
        </Box>
        <Close />
      </Box>
      {toolbar ? (
        <Box className={clsx(modalStyles.modalChrome, styles.toolbar)}>{toolbar}</Box>
      ) : null}
      <Box className={modalStyles.fullBleedDivider} />
    </Box>
  );
};
