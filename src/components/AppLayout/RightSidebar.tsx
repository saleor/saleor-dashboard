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
    __position="sticky"
    __top={0}
    // @ts-ignore
    __overflowY="scroll"
    __overflowX="hidden"
    __borderYWidth={0}
    __borderTopWidth={0}
    __borderBottomWidth={0}
    __borderRightWidth={0}
    padding={6}
    // @ts-ignore
    __gridArea="right"
    className="hide-scrollbar"
  >
    {children}
  </Box>
);
