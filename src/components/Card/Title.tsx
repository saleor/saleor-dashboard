import { Text, type TextProps } from "@saleor/macaw-ui-next";
import { type PropsWithChildren } from "react";

export const Title = ({ children, ...rest }: PropsWithChildren<TextProps>) => (
  <Text size={5} fontWeight="bold" __width="auto" {...rest}>
    {children}
  </Text>
);
