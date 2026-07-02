import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { Close } from "./Close";
import styles from "./ContextHeader.module.css";
import modalStyles from "./DashboardModal.module.css";
import { type ModalStep, ModalSteps } from "./ModalSteps";
import { Title } from "./Title";

interface ContextHeaderProps {
  children: ReactNode;
  contextLabel?: ReactNode;
  description?: ReactNode;
  steps?: {
    current: number;
    items: ModalStep[];
  };
}

export const ContextHeader = ({
  children,
  contextLabel,
  description,
  steps,
}: ContextHeaderProps) => {
  return (
    <Box className={modalStyles.modalChromeHeaderWrapper} flexShrink="0">
      <Box
        className={modalStyles.modalChromeHeader}
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={4}
      >
        <Box display="flex" flexDirection="column" gap={3} minWidth={0}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Title>{children}</Title>
            {contextLabel ? (
              <Box className={styles.contextBadge} paddingX={2} paddingY={0.5}>
                {contextLabel}
              </Box>
            ) : null}
          </Box>
          {description ? (
            <Box className={steps ? styles.descriptionWithSteps : undefined}>
              <Text size={2} color="default2">
                {description}
              </Text>
            </Box>
          ) : null}
          {steps ? <ModalSteps currentStep={steps.current} steps={steps.items} /> : null}
        </Box>
        <Close />
      </Box>
      <Box className={modalStyles.fullBleedDivider} />
    </Box>
  );
};
