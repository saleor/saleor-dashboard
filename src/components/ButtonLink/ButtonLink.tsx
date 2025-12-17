import { Button, ButtonProps, vars } from "@saleor/macaw-ui-next";
import * as React from "react";

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
  const color = disabled ? vars.colors.text.defaultDisabled : vars.colors.text.accent1;

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
        display: "inline",
        textUnderlineOffset: vars.spacing[1],
        padding: 0,
        margin: 0,
        height: "auto",
        minHeight: 0,
        color,
        fontWeight: "inherit",
        fontSize: "inherit",
        lineHeight: "inherit",
        textDecorationColor: color,
        verticalAlign: "baseline",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
