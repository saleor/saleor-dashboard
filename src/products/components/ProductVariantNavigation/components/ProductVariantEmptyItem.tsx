import Drag from "@dashboard/icons/Drag";
import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

import { ImagePlaceholder } from "./ImagePlaceholder";

export const ProductVariantEmptyItem = ({ children }: { children: ReactNode }) => (
  <Box display="block" borderLeftStyle="solid" __borderLeftWidth={2} __marginBottom="-3px">
    <Box maxWidth="100%" paddingX={2} paddingY={1} display="flex" alignItems="center" gap={5}>
      <Box __marginBottom="-2px" color="default2">
        <Drag />
      </Box>

      <ImagePlaceholder />
      {children}
    </Box>
  </Box>
);
