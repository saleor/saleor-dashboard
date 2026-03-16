import { Box, Skeleton, Text, vars } from "@saleor/macaw-ui-next";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { mediaFallbackMessages } from "./messages";

interface MediaFallbackProps {
  src: string;
  alt?: string | null;
  className?: string;
}

export const MediaFallback = ({ src, alt, className }: MediaFallbackProps) => {
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const hasError = errorSrc === src;
  const isLoaded = loadedSrc === src;

  if (hasError || !src) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
        width="100%"
        height="100%"
        borderRadius={2}
      >
        <ImageOff size={24} color={vars.colors.text.defaultDisabled} />
        <Text color="defaultDisabled" size={2} textAlign="center">
          <FormattedMessage {...mediaFallbackMessages.imageLoadFailed} />
        </Text>
      </Box>
    );
  }

  return (
    <>
      {!isLoaded && <Skeleton __width="100%" __height="100%" />}
      <img
        className={className}
        src={src}
        alt={alt ?? undefined}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setErrorSrc(src)}
        style={isLoaded ? undefined : { display: "none" }}
      />
    </>
  );
};
