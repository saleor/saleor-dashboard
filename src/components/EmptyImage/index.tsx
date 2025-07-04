import { Box, useTheme } from "@saleor/macaw-ui-next";
import React from "react";

export const EmptyImage = () => {
  const { theme } = useTheme();

  // Using these colors to match other grid-based lists
  const bgColor = theme === "defaultLight" ? "hsla(210, 15%, 87%, 1)" : "hsla(210, 32%, 25%, 1)";

  return <Box __width="31px" __height="31px" __backgroundColor={bgColor} borderRadius={2} />;
};
