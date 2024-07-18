import { Text, TextProps } from "@saleor/macaw-ui-next";
import React, { PropsWithChildren } from "react";

type TitleProps = TextProps;

export const Title: React.FC<PropsWithChildren<TitleProps>> = ({ children, ...rest }) => (
  <Text size={5} fontWeight="bold" __width="auto" {...rest}>
    {children}
  </Text>
);
