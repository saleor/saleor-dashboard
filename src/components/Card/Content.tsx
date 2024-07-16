import { Box } from "@saleor/macaw-ui-next";
import React from "react";

type ContentProps = React.ComponentProps<typeof Box>;

export const Content: React.FC<ContentProps & { className?: string }> = ({ children, ...rest }) => (
  <Box paddingX={6} {...rest}>
    {children}
  </Box>
);
