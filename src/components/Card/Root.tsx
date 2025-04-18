import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React from "react";

const borderProps: BoxProps = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "default1",
  borderRadius: 2,
  padding: 4,
};

export const Root = ({ children, withBorder, ...rest }: { withBorder?: boolean } & BoxProps) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={5}
    backgroundColor="default1"
    {...(withBorder ? borderProps : {})}
    {...rest}
  >
    {children}
  </Box>
);
