import { Text, TextProps } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface TitleProps extends TextProps {
  children: ReactNode;
}

export const Title = ({ children, ...rest }: TitleProps) => {
  return (
    <Text typeSize={6} fontWeight="bold" {...rest}>
      {children}
    </Text>
  );
};
