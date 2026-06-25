import { useModalContext } from "@dashboard/components/Modal/context";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { Close } from "./Close";
import { Title, type TitleProps } from "./Title";

interface HeaderProps extends TitleProps {
  children: ReactNode;
  subtitle?: ReactNode;
}

export const Header = ({ children, subtitle, ...rest }: HeaderProps) => {
  const { onChange } = useModalContext();

  return (
    <Box display="flex" justifyContent="space-between" gap={4}>
      <Box display="flex" flexDirection="column" gap={2} minWidth={0}>
        <Title {...rest}>{children}</Title>
        {subtitle ? (
          <Text size={2} fontWeight="light" color="default2">
            {subtitle}
          </Text>
        ) : null}
      </Box>
      <Close onClose={() => onChange?.(false)} />
    </Box>
  );
};
