import {
  borderHeight,
  contentMaxWidth,
  savebarHeight,
} from "@dashboard/components/AppLayout/consts";
import { Box, Sprinkles } from "@saleor/macaw-ui/next";
import React from "react";

interface DetailPageLayoutProps {
  children: React.ReactNode;
  gridTemplateColumns?: Sprinkles["gridTemplateColumns"];
  withSavebar?: boolean;
}

const contentWithSidebarHeight = `calc(100vh - ${savebarHeight} - ${borderHeight} * 2)`;
const contentWithoutSidebarHeight = `calc(100vh - ${borderHeight}`;

export const RootLayout: React.FC<DetailPageLayoutProps> = ({
  children,
  gridTemplateColumns = 12,
  withSavebar = true,
}) => (
  <Box
    display="grid"
    margin="auto"
    gridTemplateColumns={{
      mobile: 1,
      desktop: gridTemplateColumns as any,
    }}
    __gridTemplateRows="auto 1fr"
    __maxWidth={contentMaxWidth}
    __height={{
      mobile: "auto",
      desktop: withSavebar
        ? contentWithSidebarHeight
        : contentWithoutSidebarHeight,
    }}
  >
    {children}
  </Box>
);
