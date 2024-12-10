import { Box, Paragraph, TextProps } from "@saleor/macaw-ui-next";
import React from "react";

const Root = ({ children, ...rest }: TextProps) => (
  <Paragraph width="100%" color="default2" fontWeight="medium" fontSize={2} paddingY={2} {...rest}>
    {children}
  </Paragraph>
);

const ContextualLineLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Box
    as="a"
    textDecoration="underline"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onClick}
  >
    {children}
  </Box>
);

export const ContextualLine = Object.assign(Root, {
  Link: ContextualLineLink,
});
