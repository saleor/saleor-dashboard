import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { savebarHeight, topBarHeight } from "./consts";

interface ContentProps {
  [key: `data-${string}`]: string;
  children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children, ...rest }) => (
  <Box
    __gridArea="content"
    __height={`calc(100vh - ${topBarHeight} - ${savebarHeight})`}
    overflowY="auto"
    className="hide-scrollbar"
    {...rest}
  >
    {children}
  </Box>
);
