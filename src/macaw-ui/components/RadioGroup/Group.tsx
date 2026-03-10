import { Root } from "@radix-ui/react-radio-group";
import { forwardRef, ReactNode } from "react";

import { classNames } from "~/utils";
import { Box, PropsWithBox } from "../Box";
import { DataAttributes } from "../types";
import { fieldset, groupLabelRecipe, RadioGroupVariants } from "./Group.css";

export type RadioGroupRootProps = PropsWithBox<
  {
    children: ReactNode;
    className?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    label?: ReactNode;
  } & DataAttributes
> &
  RadioGroupVariants;

export const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupRootProps>(
  (
    {
      children,
      className,
      value,
      label,
      onValueChange,
      size,
      disabled = false,
      error = false,
      ...rest
    },
    ref
  ) => (
    <Root asChild value={value} onValueChange={onValueChange}>
      <Box
        {...rest}
        className={classNames(fieldset, className)}
        ref={ref}
        as="fieldset"
        data-macaw-ui-component="RadioGroup"
      >
        {label && (
          <legend
            className={classNames(
              groupLabelRecipe({ disabled, error, size }),
              className
            )}
          >
            {label}
          </legend>
        )}
        {children}
      </Box>
    </Root>
  )
);

RadioGroupRoot.displayName = "RadioGroup";
