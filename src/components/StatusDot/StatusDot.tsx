import { getDotColor } from "@dashboard/misc";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React from "react";

export type DotStatus = "success" | "error" | "warning";
export interface StatusDotProps {
  status: DotStatus;
}

export const StatusDot = ({ status }: StatusDotProps) => {
  const { themeValues } = useTheme();
  const color = getDotColor(status, themeValues);

  return <Box width={2} height={2} borderRadius="50%" __backgroundColor={color} />;
};
