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
  children?: ReactNode;
  description?: ReactNode;
  /** Hide title and close button — for pickers embedded in wizards that provide their own chrome. */
  hideChrome?: boolean;
  toolbar?: ReactNode;
}

export const PickerHeader = ({
  children,
  description,
  hideChrome = false,
  toolbar,
}: PickerHeaderProps) => {
  return (
    <Box
      className={modalStyles.modalChromeHeaderWrapper}
      display="flex"
      flexDirection="column"
      flexShrink="0"
      gap={hideChrome ? undefined : MODAL_HEADER_DIVIDER_GAP_SPACING}
    >
      {!hideChrome ? (
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
      ) : null}
      {toolbar ? (
        <Box
          className={hideChrome ? styles.toolbarEmbedded : styles.toolbar}
          paddingX={MODAL_PADDING_SPACING}
        >
          {toolbar}
        </Box>
      ) : null}
      {!hideChrome ? <ModalDivider /> : null}
    </Box>
  );
};

PickerHeader.displayName = MODAL_PICKER_HEADER_DISPLAY_NAME;
