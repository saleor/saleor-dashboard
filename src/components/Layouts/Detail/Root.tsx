import { Box, Sprinkles } from "@saleor/macaw-ui/next";
import React from "react";

import { borderHeight, contentMaxWidth, savebarHeight } from "../consts";

interface DetailPageLayoutProps {
  children: React.ReactNode;
  gridTemplateColumns?: Sprinkles["gridTemplateColumns"];
  gridTemplateRows?: Sprinkles["gridTemplateRows"];
  withSavebar?: boolean;
}

const contentWithSidebarHeight = `calc(100vh - ${savebarHeight} - ${borderHeight})`;
const contentWithoutSidebarHeight = `calc(100vh - ${borderHeight}`;

export const RootLayout: React.FC<DetailPageLayoutProps> = ({
  children,
  gridTemplateColumns = 12,
  gridTemplateRows = 12,
  withSavebar = true,
}) => (
  <Box
    as="article"
    display="grid"
    margin="auto"
    gridTemplateColumns={gridTemplateColumns}
    gridTemplateRows={gridTemplateRows}
    __maxWidth={contentMaxWidth}
    __height={
      withSavebar ? contentWithSidebarHeight : contentWithoutSidebarHeight
    }
  >
    {children}
  </Box>
);
