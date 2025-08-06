import { Text, TextProps } from "@saleor/macaw-ui-next";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

interface UnderlineLinkProps extends LinkProps {
  textProps?: Omit<TextProps, "children">;
}

// TODO: move to MacawUI
export const UnderlineLink = ({ children, textProps, ...props }: UnderlineLinkProps) => (
  <Link {...props}>
    <UnderlineText {...textProps}>{children}</UnderlineText>
  </Link>
);

export const UnderlineText = ({ children, ...props }: TextProps) => (
  <Text as="span" textDecoration="underline" fontWeight="medium" size={2} {...props}>
    {children}
  </Text>
);
