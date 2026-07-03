import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ReactNode } from "react";

import { Close } from "./Close";
import modalStyles from "./DashboardModal.module.css";
import { MODAL_PICKER_HEADER_DISPLAY_NAME } from "./modalDisplayNames";
import styles from "./PickerHeader.module.css";
import { Title } from "./Title";

interface PickerHeaderProps {
  children: ReactNode;
  description?: ReactNode;
  toolbar?: ReactNode;
}

export const PickerHeader = ({ children, description, toolbar }: PickerHeaderProps) => {
  return (
    <Box className={modalStyles.modalChromeHeaderWrapper} flexShrink="0">
      <Box
        className={modalStyles.modalChromeHeader}
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={4}
      >
        <Box minWidth={0}>
          <Title>{children}</Title>
          {description ? (
            <Text size={2} color="default2" marginTop={3} display="block">
              {description}
            </Text>
          ) : null}
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

PickerHeader.displayName = MODAL_PICKER_HEADER_DISPLAY_NAME;
