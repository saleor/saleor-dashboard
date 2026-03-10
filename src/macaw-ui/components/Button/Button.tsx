import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

import { classNames } from "~/utils";

import { Box, PropsWithBox } from "../Box";
import { isFixedWidth } from "./utils";
import { button, ButtonVariants } from "./Button.css";

export type ButtonProps = PropsWithBox<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "nonce"> & {
    children?: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    className?: string;
  }
> &
  ButtonVariants;

export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      children,
      icon,
      size,
      fixedWidth,
      variant,
      disabled,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <Box
        as="button"
        className={classNames(
          button({
            variant,
            size,
            fixedWidth: isFixedWidth({ icon, children, fixedWidth }),
          }),
          className
        )}
        disabled={disabled}
        ref={ref}
        type={type}
        data-macaw-ui-component="Button"
        {...props}
      >
        {icon}
        {children}
      </Box>
    );
  }
);

Button.displayName = "Button";
