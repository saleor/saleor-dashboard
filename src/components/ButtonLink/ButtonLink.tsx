import { Button, ButtonProps, vars } from "@saleor/macaw-ui-next";
import React from "react";

interface ButtonLinkProps extends ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  underline?: boolean;
}

export const ButtonLink = ({
  children,
  disabled,
  onClick,
  underline,
  ...props
}: ButtonLinkProps) => {
  const color = disabled
    ? vars.colors.text.defaultDisabled
    : vars.colors.text.accent1;

  const handleClick = (event: React.MouseEvent) => {
    if (disabled || !onClick) {
      return;
    }

    onClick(event);
  };

  return (
    <Button
      variant="tertiary"
      onClick={handleClick}
      __backgroundColor="transparent"
      textDecoration={{
        default: underline ? "underline" : "none",
        hover: "underline",
        focus: "underline",
      }}
      cursor={disabled ? "not-allowed" : "pointer"}
      style={{
        textUnderlineOffset: vars.spacing[1],
        padding: 0,
        color,
        fontWeight: 400,
        textDecorationColor: color,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
