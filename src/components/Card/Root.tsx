import { Box, Sprinkles } from "@saleor/macaw-ui-next";
import React from "react";

export const Root: React.FC<Sprinkles & { className?: string; onClick?: () => void }> = ({
  children,
  ...rest
}) => (
  <Box display="flex" flexDirection="column" gap={5} position="relative" {...rest}>
    {children}
  </Box>
);
