import { Text, TextProps } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface TitleProps extends TextProps {
  children: ReactNode;
}

export const Title = ({ children, ...rest }: TitleProps) => {
  return (
    <Text variant="heading" size="large" {...rest}>
      {children}
    </Text>
  );
};
