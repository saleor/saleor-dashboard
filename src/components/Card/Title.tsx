import { Text, type TextProps } from "@saleor/macaw-ui-next";
import { type PropsWithChildren } from "react";

// `size={6} fontWeight="medium"` is the dashboard's redesign-era section header
// style (OrderDetailsPage, customer details, gift cards, etc. all converged on
// it). Setting it as the default avoids having to repeat the override at every
// call site; consumers can still pass `size` / `fontWeight` to opt out.
export const Title = ({ children, ...rest }: PropsWithChildren<TextProps>) => (
  <Text size={6} fontWeight="medium" __width="auto" {...rest}>
    {children}
  </Text>
);
