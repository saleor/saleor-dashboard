import { Box } from "@saleor/macaw-ui-next";
import React from "react";

const defaultProps = {
  __height: "48px",
  __width: "48px",
};

export const NavigatorThumbnail = ({
  src,
  alt,
}: {
  src: string | undefined;
  alt: string | undefined;
}) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    __padding="2px"
    borderRadius={4}
    borderStyle="solid"
    borderWidth={1}
    borderColor="default1"
    overflow="hidden"
    marginRight={2}
    {...defaultProps}
  >
    <Box
      as="img"
      width="100%"
      height="100%"
      objectFit="contain"
      src={src}
      alt={alt || ""}
      borderRadius={2}
    />
  </Box>
);
