import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { contentMaxWidth } from "./consts";

interface DetailedContentProps {
  children: React.ReactNode;
  useSingleColumn?: boolean;
}

export const DetailedContent: React.FC<DetailedContentProps> = ({
  children,
  useSingleColumn = false,
}) => (
  <Box
    as="div"
    display="grid"
    height="100%"
    margin="auto"
    __maxWidth={contentMaxWidth}
    __gridTemplateColumns={useSingleColumn ? "1fr" : "9fr 4fr"}
    __gridTemplateRows="auto 1fr"
    __gridTemplateAreas={
      useSingleColumn ? "'nav' 'content'" : "'nav right' 'content right'"
    }
  >
    {children}
  </Box>
);
