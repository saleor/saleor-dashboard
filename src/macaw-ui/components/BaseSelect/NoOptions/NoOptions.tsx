import { ReactNode } from "react";
import { Text, TextProps } from "~/components";

export interface NoOptionsProps extends TextProps {
  children: ReactNode;
}

export const NoOptions = ({ children, ...props }: NoOptionsProps) => {
  return (
    <Text as="p" padding={2} textAlign="center" fontStyle="italic" {...props}>
      {children}
    </Text>
  );
};
