import { Box } from "@saleor/macaw-ui-next";
import React from "react";

interface DetailPageLayoutContentProps {
  [key: `data-${string}`]: string;
  children: React.ReactNode;
}

export const Content: React.FC<DetailPageLayoutContentProps> = ({ children, ...rest }) => (
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
