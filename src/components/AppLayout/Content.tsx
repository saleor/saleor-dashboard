import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { borderHeight, savebarHeight, topBarHeight } from "./consts";

interface ContentProps {
  [key: `data-${string}`]: string;
  children: React.ReactNode;
  noSavebar?: boolean;
  noTopNav?: boolean;
}

export const Content: React.FC<ContentProps> = ({
  children,
  noSavebar = false,
  noTopNav = false,
  ...rest
}) => (
  <Box
    __gridArea="content"
    __height={
      noSavebar
        ? `calc(100vh - ${topBarHeight} - ${borderHeight})`
        : `calc(100vh - ${
            noTopNav ? "0px" : topBarHeight
          } - ${savebarHeight} - ${borderHeight})`
    }
    overflowY="auto"
    className="hide-scrollbar"
    {...rest}
  >
    {children}
  </Box>
);
