import { forwardRef, ReactNode } from "react";
import { classNames } from "~/utils";
import { Box, PropsWithBox } from "../Box";

import { chip, ChipVariants } from "./Chip.css";

export type ChipProps = PropsWithBox<{
  children: ReactNode;
  className?: string;
}> &
  ChipVariants;

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ children, size, className, ...props }, ref) => {
    return (
      <Box
        as="span"
        className={classNames(
          chip({
            size,
          }),
          className
        )}
        ref={ref}
        data-macaw-ui-component="Chip"
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Chip.displayName = "Chip";
