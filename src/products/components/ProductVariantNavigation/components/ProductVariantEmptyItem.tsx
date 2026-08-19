import Drag from "@dashboard/icons/Drag";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { ImagePlaceholder } from "./ImagePlaceholder";

export const ProductVariantEmptyItem = ({ children }: { children: ReactNode }) => (
  <Box display="block" borderLeftStyle="solid" __borderLeftWidth={2}>
    <Box
      maxWidth="100%"
      paddingX={2}
      paddingY={2}
      display="flex"
      alignItems="center"
      gap={5}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderColor="default1"
    >
      <Box __marginBottom="-2px" color="default2">
        <Drag />
      </Box>

      <ImagePlaceholder />
      {children}
    </Box>
  </Box>
);
