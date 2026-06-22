import { Box } from "@saleor/macaw-ui-next";
import { type LucideIcon } from "lucide-react";
import { createElement } from "react";

import {
  attributeInputTypeIconPixelSize,
  type AttributeInputTypeIconSize,
  attributeInputTypeIconStrokeWidthBySize,
} from "./types";

interface AttributeLabelIconProps {
  icon: LucideIcon;
  size?: AttributeInputTypeIconSize;
  ariaLabel?: string;
}

export const AttributeLabelIcon = ({
  icon,
  size = "small",
  ariaLabel,
}: AttributeLabelIconProps): JSX.Element => {
  const pixelSize = attributeInputTypeIconPixelSize[size];

  return (
    <Box
      color="default2"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink="0"
      aria-label={ariaLabel}
    >
      {createElement(icon, {
        size: pixelSize,
        strokeWidth: attributeInputTypeIconStrokeWidthBySize[size],
        style: { display: "block" },
      })}
    </Box>
  );
};
