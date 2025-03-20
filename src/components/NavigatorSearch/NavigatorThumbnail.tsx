import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

const defaultProps = {
  __height: "48px",
  __width: "48px",
  __minWidth: "48px",
};

export const NavigatorThumbnail = ({
  src,
  alt,
}: {
  src: string | undefined;
  alt: string | undefined;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false || !src);

  if (error) {
    return (
      <Box
        {...defaultProps}
        backgroundColor="default2"
        borderRadius={4}
        borderStyle="solid"
        borderColor="default1"
        borderWidth={1}
        marginRight={2}
      />
    );
  }

  return (
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
      position="relative"
      {...defaultProps}
    >
      {loading && (
        <Skeleton {...defaultProps} position="absolute" left={0} right={0} top={0} bottom={0} />
      )}
      <Box
        as="img"
        width="100%"
        height="100%"
        objectFit="contain"
        src={src}
        alt={alt || ""}
        borderRadius={2}
        backgroundColor="default2"
        onError={() => {
          setError(true);
        }}
        onLoad={() => {
          setLoading(false);
        }}
      />
    </Box>
  );
};
