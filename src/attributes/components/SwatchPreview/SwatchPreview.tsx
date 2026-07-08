import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import type { CSSProperties } from "react";

import styles from "./SwatchPreview.module.css";

interface SwatchPreviewProps {
  className?: string;
  color?: string | null;
  imageUrl?: string | null;
  size?: number;
}

export const SwatchPreview = ({ className, color, imageUrl, size = 40 }: SwatchPreviewProps) => {
  const hasImage = Boolean(imageUrl);
  const hasColor = Boolean(color);
  const isEmpty = !hasImage && !hasColor;

  if (hasImage && imageUrl) {
    return (
      <Box
        alt=""
        aria-hidden
        as="img"
        className={clsx(styles.swatchPreview, className)}
        data-test-id="swatch-preview"
        objectFit="cover"
        src={imageUrl}
        __height={size}
        __width={size}
      />
    );
  }

  const previewStyle: CSSProperties = {
    width: size,
    height: size,
    ...(hasColor ? { backgroundColor: color ?? undefined } : undefined),
  };

  return (
    <span
      aria-hidden
      className={clsx(styles.swatchPreview, isEmpty && styles.swatchPreviewEmpty, className)}
      data-test-id="swatch-preview"
      style={previewStyle}
    />
  );
};
