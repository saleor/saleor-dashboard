import { WARNING_ICON_COLOR, WARNING_ICON_COLOR_LIGHTER } from "@dashboard/colors";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { ExclamationIconFilled } from "@dashboard/icons/ExclamationIconFilled";
import { Box } from "@saleor/macaw-ui-next";
import { useState } from "react";

export const AlertExclamationIcon = ({
  width = 17,
  height = 17,
}: {
  width?: number;
  height?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      __color={isHovered ? WARNING_ICON_COLOR_LIGHTER : WARNING_ICON_COLOR}
      __width={width}
      __height={height}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <ExclamationIconFilled width={width} height={height} />
      ) : (
        <ExclamationIcon width={`${width}px`} height={`${height}px`} />
      )}
    </Box>
  );
};
