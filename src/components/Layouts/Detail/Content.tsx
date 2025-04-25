import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React from "react";

interface DetailPageLayoutContentProps extends BoxProps {
  [key: `data-${string}`]: string;
  children: React.ReactNode;
  hideScrollbar?: boolean;
}

export const Content: React.FC<DetailPageLayoutContentProps> = ({
  children,
  hideScrollbar = true,
  ...rest
}) => {
  return (
    <Box
      height="100%"
      overflowY="auto"
      className={hideScrollbar ? "hide-scrollbar" : ""}
      gridColumn="8"
      gridRow={{ mobile: "6", tablet: "12", desktop: "12" }}
      {...rest}
    >
      {children}
    </Box>
  );
};
