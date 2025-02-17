import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { ExclamationIconFilled } from "@dashboard/icons/ExclamationIconFilled";
import { Box } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

export const AlertExclamationIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  const colorLighter = "#FFD87E";
  const colorDefault = "#FFB84E";

  return (
    <Box
      __color={isHovered ? colorLighter : colorDefault}
      __width={17}
      __height={17}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? <ExclamationIconFilled /> : <ExclamationIcon />}
    </Box>
  );
};
