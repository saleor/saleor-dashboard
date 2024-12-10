import { Box, Paragraph } from "@saleor/macaw-ui-next";
import React from "react";

const Root = ({ children, ...rest }: React.ComponentProps<typeof Paragraph>) => (
  <Paragraph width="100%" color="default2" fontWeight="medium" fontSize={2} paddingY={2} {...rest}>
    {children}
  </Paragraph>
);

const ContextualLineLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Box as="a" textDecoration="underline" href={href}>
    {children}
  </Box>
);

export const ContextualLine = Object.assign(Root, {
  Link: ContextualLineLink,
});
