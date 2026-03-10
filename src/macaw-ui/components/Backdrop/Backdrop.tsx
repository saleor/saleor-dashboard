import { forwardRef } from "react";
import { Box, PropsWithBox } from "../Box";

export type BackdropProps = PropsWithBox<{
  children?: React.ReactNode;
}>;

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  ({ children, ...rest }, ref) => (
    <Box
      __backgroundColor="hsla(0, 0%, 0%, 0.6)"
      position="fixed"
      inset={0}
      ref={ref}
      data-macaw-ui-component="Backdrop"
      {...rest}
    >
      {children}
    </Box>
  )
);

Backdrop.displayName = "Backdrop";
