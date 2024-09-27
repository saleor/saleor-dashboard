import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

import { Close } from "./Close";
import { Title, TitleProps } from "./Title";

interface HeaderProps extends TitleProps {
  children: ReactNode;
  onClose: () => void;
}

export const Header = ({ children, onClose, ...rest }: HeaderProps) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Title {...rest}>{children}</Title>
      <Close onClose={onClose} />
    </Box>
  );
};
