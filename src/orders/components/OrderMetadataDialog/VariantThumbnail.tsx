import { Box, Spinner } from "@saleor/macaw-ui-next";
import React from "react";

export const VariantThumbnail = ({ src, loading }: { src: string; loading: boolean }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={20}
      width={20}
      borderRadius={4}
      borderStyle="solid"
      borderWidth={1}
      borderColor="default1"
    >
      {loading ? <Spinner /> : <img src={src} alt="" />}
    </Box>
  );
};
