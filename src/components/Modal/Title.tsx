import { Text, type TextProps } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

export interface TitleProps extends TextProps {
  children: ReactNode;
}

export const Title = ({ children, ...rest }: TitleProps) => {
  return (
    <Text size={6} fontWeight="bold" {...rest}>
      {children}
    </Text>
  );
};
