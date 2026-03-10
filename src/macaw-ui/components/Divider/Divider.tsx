import { forwardRef } from "react";
import { Box, PropsWithBox } from "..";

export type DividerProps = PropsWithBox<{
  className?: string;
}>;

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ className, ...rest }, ref) => (
    <Box
      ref={ref}
      as="hr"
      className={className}
      backgroundColor="default3"
      borderWidth={0}
      width="100%"
      height="px"
      data-macaw-ui-component="Divider"
      {...rest}
    />
  )
);

Divider.displayName = "Divider";
