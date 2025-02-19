import { WARNING_ICON_COLOR, WARNING_ICON_COLOR_LIGHTER } from "@dashboard/colors";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { ExclamationIconFilled } from "@dashboard/icons/ExclamationIconFilled";
import { Box } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

export const AlertExclamationIcon = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      __color={isHovered ? WARNING_ICON_COLOR_LIGHTER : WARNING_ICON_COLOR}
      __width={17}
      __height={17}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? <ExclamationIconFilled /> : <ExclamationIcon />}
    </Box>
  );
};
