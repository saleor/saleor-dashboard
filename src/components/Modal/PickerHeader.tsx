import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { Close } from "./Close";
import modalStyles from "./DashboardModal.module.css";
import { ModalChromeHeader } from "./ModalChromeHeader";
import { MODAL_PICKER_HEADER_DISPLAY_NAME } from "./modalDisplayNames";
import { ModalDivider } from "./ModalDivider";
import styles from "./PickerHeader.module.css";
import { Title } from "./Title";
import { MODAL_HEADER_DIVIDER_GAP_SPACING, MODAL_PADDING_SPACING } from "./tokens";

interface PickerHeaderProps {
  children: ReactNode;
  description?: ReactNode;
  toolbar?: ReactNode;
}

export const PickerHeader = ({ children, description, toolbar }: PickerHeaderProps) => {
  return (
    <Box
      className={modalStyles.modalChromeHeaderWrapper}
      display="flex"
      flexDirection="column"
      flexShrink="0"
      gap={MODAL_HEADER_DIVIDER_GAP_SPACING}
    >
      <ModalChromeHeader alignItems="flex-start">
        <Box minWidth={0}>
          <Title>{children}</Title>
          {description ? (
            <Text size={2} color="default2" marginTop={3} display="block">
              {description}
            </Text>
          ) : null}
        </Box>
        <Close />
      </ModalChromeHeader>
      {toolbar ? (
        <Box className={styles.toolbar} paddingX={MODAL_PADDING_SPACING}>
          {toolbar}
        </Box>
      ) : null}
      <ModalDivider />
    </Box>
  );
};

PickerHeader.displayName = MODAL_PICKER_HEADER_DISPLAY_NAME;
