import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { Close } from "./Close";
import { ContextHeader } from "./ContextHeader";
import modalStyles from "./DashboardModal.module.css";
import { ModalChromeHeader } from "./ModalChromeHeader";
import { MODAL_HEADER_DISPLAY_NAME } from "./modalDisplayNames";
import { ModalDivider } from "./ModalDivider";
import { Title, type TitleProps } from "./Title";
import { MODAL_HEADER_DIVIDER_GAP_SPACING } from "./tokens";

interface HeaderProps extends TitleProps {
  children: ReactNode;
  subtitle?: ReactNode;
}

export const Header = ({ children, subtitle, ...rest }: HeaderProps) => {
  if (subtitle) {
    return <ContextHeader description={subtitle}>{children}</ContextHeader>;
  }

  return (
    <Box
      className={modalStyles.modalChromeHeaderWrapper}
      display="flex"
      flexDirection="column"
      flexShrink="0"
      gap={MODAL_HEADER_DIVIDER_GAP_SPACING}
    >
      <ModalChromeHeader>
        <Box minWidth={0}>
          <Title {...rest}>{children}</Title>
        </Box>
        <Close />
      </ModalChromeHeader>
      <ModalDivider />
    </Box>
  );
};

Header.displayName = MODAL_HEADER_DISPLAY_NAME;
