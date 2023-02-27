import { contentMaxWidth } from "@dashboard/components/AppLayout/consts";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

interface ListPageLayoutProps {
  children: React.ReactNode;
  hasSaveBar?: boolean;
  hasTopNav?: boolean;
}

export const ListPageLayout: React.FC<ListPageLayoutProps> = ({ children }) => (
  <Box
    display="grid"
    margin="auto"
    gridTemplateColumns={1}
    height="100%"
    as="article"
    __maxWidth={contentMaxWidth}
  >
    {children}
  </Box>
);
