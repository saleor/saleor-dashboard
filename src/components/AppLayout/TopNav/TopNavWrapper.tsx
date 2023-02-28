import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { topBarHeight } from "../consts";

export const TopNavWrapper: React.FC = ({ children }) => (
  <Box
    display="flex"
    alignItems="center"
    paddingX={9}
    paddingY={8}
    borderBottomWidth={1}
    borderBottomStyle="solid"
    borderColor="neutralPlain"
    position="relative"
    data-test-id="page-header"
    __height={topBarHeight}
    gridColumn="8"
    gridRowStart="1"
    backgroundColor="plain"
  >
    {children}
  </Box>
);
