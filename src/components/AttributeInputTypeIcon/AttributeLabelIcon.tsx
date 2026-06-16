import { iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box } from "@saleor/macaw-ui-next";
import { type LucideIcon } from "lucide-react";
import { createElement } from "react";

import { attributeInputTypeIconPixelSize, type AttributeInputTypeIconSize } from "./types";

interface AttributeLabelIconProps {
  icon: LucideIcon;
  size?: AttributeInputTypeIconSize;
  ariaLabel?: string;
}

const strokeWidthBySize: Record<AttributeInputTypeIconSize, number> = {
  xsmall: iconStrokeWidthBySize.small,
  small: iconStrokeWidthBySize.small,
  medium: iconStrokeWidthBySize.medium,
  large: iconStrokeWidthBySize.large,
};

export const AttributeLabelIcon = ({
  icon,
  size = "small",
  ariaLabel,
}: AttributeLabelIconProps): JSX.Element => {
  const pixelSize = attributeInputTypeIconPixelSize[size];

  return (
    <Box color="default2" display="flex" alignItems="center" flexShrink="0" aria-label={ariaLabel}>
      {createElement(icon, {
        size: pixelSize,
        strokeWidth: strokeWidthBySize[size],
      })}
    </Box>
  );
};
