import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { Close } from "./Close";
import { ContextHeader } from "./ContextHeader";
import modalStyles from "./DashboardModal.module.css";
import { MODAL_HEADER_DISPLAY_NAME } from "./modalDisplayNames";
import { Title, type TitleProps } from "./Title";

interface HeaderProps extends TitleProps {
  children: ReactNode;
  subtitle?: ReactNode;
}

export const Header = ({ children, subtitle, ...rest }: HeaderProps) => {
  if (subtitle) {
    return <ContextHeader description={subtitle}>{children}</ContextHeader>;
  }

  return (
    <Box className={modalStyles.modalChromeHeaderWrapper} flexShrink="0">
      <Box
        className={modalStyles.modalChromeHeader}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
      >
        <Box minWidth={0}>
          <Title {...rest}>{children}</Title>
        </Box>
        <Close />
      </Box>
      <Box className={modalStyles.fullBleedDivider} />
    </Box>
  );
};

Header.displayName = MODAL_HEADER_DISPLAY_NAME;
