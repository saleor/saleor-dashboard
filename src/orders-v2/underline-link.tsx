import { Text, TextProps } from "@saleor/macaw-ui-next";
import React from "react";
import { Link } from "react-router-dom";

interface Props extends TextProps {
  href: string;
  children: React.ReactNode;
}

// TODO: move to MacawUI
export const UnderlineLink = ({ href, children, ...props }: Props) => (
  <Link to={href}>
    <Text as="span" textDecoration="underline" {...props} data-macaw-ui-candidate>
      {children}
    </Text>
  </Link>
);
