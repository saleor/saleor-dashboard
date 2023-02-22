import { Box, Sprinkles } from "@saleor/macaw-ui/next";
import React from "react";

interface DetailPageLayoutProps {
  children: React.ReactNode;
  hasSaveBar?: boolean;
  gridTemplateColumns?: Sprinkles["gridTemplateColumns"];
  gridTemplateRows?: Sprinkles["gridTemplateRows"];
}

import { contentMaxWidth } from "../AppLayout/consts";

const RootLayout: React.FC<DetailPageLayoutProps> = ({
  children,
  hasSaveBar = true,
  gridTemplateColumns = 12,
  gridTemplateRows = 12,
}) => (
  <Box
    as="article"
    display="grid"
    margin="auto"
    gridTemplateColumns={gridTemplateColumns}
    gridTemplateRows={gridTemplateRows}
    __maxWidth={contentMaxWidth}
    __height={hasSaveBar ? "calc(100vh - 64px - 1px)" : "calc(100vh - 1px)"}
  >
    {children}
  </Box>
);

interface ContentProps {
  [key: `data-${string}`]: string;
  children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children, ...rest }) => (
  <Box
    height="100%"
    overflowY="auto"
    className="hide-scrollbar"
    gridColumn="8"
    gridRow={{ mobile: "6", tablet: "12", desktop: "12" }}
    {...rest}
  >
    {children}
  </Box>
);

interface RightSidebarProps {
  children: React.ReactNode;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ children }) => (
  <Box
    borderLeftStyle="solid"
    borderColor="neutralPlain"
    height="100%"
    overflowY="auto"
    className="hide-scrollbar"
    gridColumn={"8"}
    gridRow={{ mobile: "6", tablet: "full", desktop: "full" }}
  >
    {children}
  </Box>
);

export const DetailPageLayout = Object.assign(RootLayout, {
  Content,
  RightSidebar,
});
