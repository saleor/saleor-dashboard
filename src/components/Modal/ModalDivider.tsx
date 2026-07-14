import { Box } from "@saleor/macaw-ui-next";

import styles from "./DashboardModal.module.css";
import { MODAL_DIVIDER_DISPLAY_NAME } from "./modalDisplayNames";

export const ModalDivider = () => {
  return (
    <Box
      className={styles.fullBleedDivider}
      width="100%"
      height="px"
      backgroundColor="default3"
      borderWidth={0}
      flexShrink="0"
    />
  );
};

ModalDivider.displayName = MODAL_DIVIDER_DISPLAY_NAME;
