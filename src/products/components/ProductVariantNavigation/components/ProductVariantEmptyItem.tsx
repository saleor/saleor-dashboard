import Drag from "@dashboard/icons/Drag";
import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

import { ImagePlaceholder } from "./ImagePlaceholder";

export const ProductVariantEmptyItem = ({
  children,
  hasVariants,
}: {
  children: ReactNode;
  hasVariants: boolean;
}) => (
  <Box display="block" borderLeftStyle="solid" __borderLeftWidth={2}>
    <Box
      maxWidth="100%"
      paddingX={2}
      paddingY={1}
      display="flex"
      alignItems="center"
      gap={5}
      borderBottomStyle="solid"
      // Show top border when user creates first variant
      borderTopStyle={hasVariants ? undefined : "solid"}
      borderTopWidth={1}
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
