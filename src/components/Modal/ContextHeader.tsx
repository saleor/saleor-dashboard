import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { Close } from "./Close";
import styles from "./ContextHeader.module.css";
import modalStyles from "./DashboardModal.module.css";
import { ModalChromeHeader } from "./ModalChromeHeader";
import { MODAL_CONTEXT_HEADER_DISPLAY_NAME } from "./modalDisplayNames";
import { ModalDivider } from "./ModalDivider";
import { type ModalStep, ModalSteps } from "./ModalSteps";
import { Title } from "./Title";
import { MODAL_HEADER_DIVIDER_GAP_SPACING } from "./tokens";

interface ContextHeaderProps {
  children: ReactNode;
  contextLabel?: ReactNode;
  description?: ReactNode;
  /** When false, renders description without default body text styling (e.g. thumbnail rows). */
  wrapDescription?: boolean;
  /** When false, renders contextLabel inline without the default badge chrome. */
  wrapContextLabel?: boolean;
  steps?: {
    current: number;
    items: ModalStep[];
  };
}

export const ContextHeader = ({
  children,
  contextLabel,
  description,
  wrapDescription = true,
  wrapContextLabel = true,
  steps,
}: ContextHeaderProps) => {
  return (
    <Box
      className={modalStyles.modalChromeHeaderWrapper}
      display="flex"
      flexDirection="column"
      flexShrink="0"
      gap={MODAL_HEADER_DIVIDER_GAP_SPACING}
    >
      <ModalChromeHeader alignItems="flex-start">
        <Box display="flex" flexDirection="column" gap={3} minWidth={0}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Title>{children}</Title>
            {contextLabel ? (
              wrapContextLabel ? (
                <Box className={styles.contextBadge} paddingX={2} paddingY={0.5}>
                  {contextLabel}
                </Box>
              ) : (
                contextLabel
              )
            ) : null}
          </Box>
          {description ? (
            <Box className={steps ? styles.descriptionWithSteps : undefined}>
              {wrapDescription ? (
                <Text size={2} color="default2">
                  {description}
                </Text>
              ) : (
                description
              )}
            </Box>
          ) : null}
          {steps ? <ModalSteps currentStep={steps.current} steps={steps.items} /> : null}
        </Box>
        <Close />
      </ModalChromeHeader>
      <ModalDivider />
    </Box>
  );
};

ContextHeader.displayName = MODAL_CONTEXT_HEADER_DISPLAY_NAME;
