import { Box, Skeleton, Text, vars } from "@saleor/macaw-ui-next";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { mediaFallbackMessages } from "./messages";

interface MediaWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt"> {
  // Extend to allow "null" because GraphQL can return it. It's suger to avoid extra mapping in parents
  alt?: string | null;
  /** Shown instead of a skeleton while `src` is loading (e.g. local blob preview after upload). */
  placeholderSrc?: string | null;
  onPlaceholderUnused?: () => void;
}

export const MediaWithFallback = ({
  src,
  alt,
  className,
  style,
  placeholderSrc,
  onPlaceholderUnused,
  ...rest
}: MediaWithFallbackProps) => {
  const [loadingStatus, setLoadingStatus] = useState<"loading" | "loaded" | "error">("loading");

  const hasError = loadingStatus === "error";
  const isLoaded = loadingStatus === "loaded";

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

  const handleLoad = () => {
    setLoadingStatus("loaded");
    onPlaceholderUnused?.();
  };

  return (
    <>
      {!isLoaded && placeholderSrc ? (
        <img
          className={className}
          src={placeholderSrc}
          alt=""
          aria-hidden
          style={style}
          data-test-id="media-placeholder"
        />
      ) : null}
      {!isLoaded && !placeholderSrc ? <Skeleton __width="100%" __height="100%" /> : null}
      <img
        className={className}
        src={src}
        alt={alt ?? undefined}
        onLoad={handleLoad}
        onError={() => {
          setLoadingStatus("error");
          onPlaceholderUnused?.();
        }}
        style={isLoaded ? { ...style } : { ...style, display: "none" }}
        {...rest}
      />
    </>
  );
};
