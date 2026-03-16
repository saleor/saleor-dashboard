import { Box, Text, vars } from "@saleor/macaw-ui-next";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { mediaFallbackMessages } from "./messages";

interface MediaFallbackProps {
  src: string;
  alt?: string | null;
  className?: string;
}

export const MediaFallback = ({ src, alt, className }: MediaFallbackProps) => {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  if (hasError) {
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
    <img className={className} src={src} alt={alt ?? undefined} onError={() => setHasError(true)} />
  );
};
