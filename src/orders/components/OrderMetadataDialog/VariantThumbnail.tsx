import { Box } from "@saleor/macaw-ui-next";
import React from "react";

export const VariantThumbnail = ({ src }: { src: string }) => {
  return (
    <Box
      display="flex"
      height={20}
      width={20}
      borderRadius={4}
      borderStyle="solid"
      borderWidth={1}
      borderColor="default1"
    >
      <img src={src} />
    </Box>
  );
};
