import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";

export const VariantThumbnail = ({
  src,
  loading,
}: {
  src: string | undefined;
  loading: boolean;
}) => {
  if (loading) {
    return <Skeleton height={20} width={20} />;
  }

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
      <img src={src} alt="" />
    </Box>
  );
};
