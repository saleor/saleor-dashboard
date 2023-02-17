import { Box, tabletMediaQuery } from "@saleor/macaw-ui/next";
import React from "react";
import { useMediaQuery } from "usehooks-ts";

import { contentMaxWidth } from "./consts";

interface DetailedContentProps {
  children: React.ReactNode;
  useSingleColumn?: boolean;
  constHeight?: boolean;
}

const getLayoutAreas = (useSingleColumn: boolean, isTablet: boolean) => {
  if (useSingleColumn) {
    return '"nav" "content"';
  }

  return isTablet ? '"nav right" "content right"' : '"nav" "content" "right"';
};

export const DetailedContent: React.FC<DetailedContentProps> = ({
  children,
  useSingleColumn = false,
  constHeight = false,
}) => {
  const isTablet = useMediaQuery(tabletMediaQuery);

  return (
    <Box
      as="div"
      display="grid"
      height={constHeight ? "100vh" : "100%"}
      margin="auto"
      __maxWidth={contentMaxWidth}
      __gridTemplateColumns={useSingleColumn ? "1fr" : "9fr 4fr"}
      __gridTemplateRows="auto 1fr"
      __gridTemplateAreas={getLayoutAreas(useSingleColumn, isTablet)}
    >
      {children}
    </Box>
  );
};
