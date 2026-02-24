import { type Sprinkles, Text } from "@saleor/macaw-ui-next";
import { type PropsWithChildren } from "react";

type CardSubtitleProps = Sprinkles;

export const CardSubtitle = ({ children, ...rest }: PropsWithChildren<CardSubtitleProps>) => (
  <Text size={4} fontWeight="light" display="block" {...rest}>
    {children}
  </Text>
);
