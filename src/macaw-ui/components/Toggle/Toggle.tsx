import { Root as RadixToggle, ToggleProps } from "@radix-ui/react-toggle";
import { forwardRef } from "react";
import { Box } from "../Box";
import { toggle } from "./Toggle.css";

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      disabled = false,
      pressed,
      onPressedChange,
      children,
      ...props
    }: ToggleProps,
    ref
  ) => {
    return (
      <Box
        as="label"
        display="flex"
        alignItems="center"
        gap={1.5}
        cursor={disabled ? "not-allowed" : "pointer"}
        data-macaw-ui-component="Toggle"
      >
        <RadixToggle
          ref={ref}
          className={toggle()}
          pressed={pressed}
          onPressedChange={onPressedChange}
          disabled={disabled}
          {...props}
        />
        {children}
      </Box>
    );
  }
);

Toggle.displayName = "Toggle";
