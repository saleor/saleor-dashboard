import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import type { CSSProperties } from "react";

import styles from "./SwatchPreview.module.css";

interface SwatchPreviewProps {
  className?: string;
  color?: string | null;
  imageUrl?: string | null;
  size?: number;
  /**
   * `circle` — compact combobox / datagrid dots (color or image cropped).
   * `rounded` — larger form previews (default).
   */
  shape?: "circle" | "rounded";
}

export const SwatchPreview = ({
  className,
  color,
  imageUrl,
  size = 40,
  shape = "rounded",
}: SwatchPreviewProps): JSX.Element => {
  const hasImage = Boolean(imageUrl);
  const hasColor = Boolean(color);
  const isEmpty = !hasImage && !hasColor;
  const shapeClass = shape === "circle" ? styles.swatchPreviewCircle : styles.swatchPreviewRounded;

  if (hasImage && imageUrl) {
    return (
      <Box
        alt=""
        aria-hidden
        as="img"
        className={clsx(styles.swatchPreview, shapeClass, className)}
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
      className={clsx(
        styles.swatchPreview,
        shapeClass,
        isEmpty && styles.swatchPreviewEmpty,
        className,
      )}
      data-test-id="swatch-preview"
      style={previewStyle}
    />
  );
};
