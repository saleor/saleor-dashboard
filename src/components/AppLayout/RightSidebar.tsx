import { Box } from "@saleor/macaw-ui/next";
import React from "react";

export const RightSidebar = ({ children }) => (
  <Box
    borderStyle="solid"
    borderColor="neutralPlain"
    paddingLeft={6}
    paddingRight={6}
    borderLeftWidth={1}
    height="100vh"
    __paddingBottom={300}
    position="sticky"
    top={0}
    overflowY="scroll"
    overflowX="hidden"
    borderYWidth={0}
    borderTopWidth={0}
    borderBottomWidth={0}
    borderRightWidth={0}
    padding={6}
    __gridArea="right"
    className="hide-scrollbar"
  >
    {children}
  </Box>
);
