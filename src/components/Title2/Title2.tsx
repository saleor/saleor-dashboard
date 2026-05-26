import { Text, type TextProps } from "@saleor/macaw-ui-next";
import { type PropsWithChildren } from "react";

export const Title2 = ({ children, ...rest }: PropsWithChildren<TextProps>) => (
  <Text size={4} fontWeight="medium" __width="auto" {...rest}>
    {children}
  </Text>
);
