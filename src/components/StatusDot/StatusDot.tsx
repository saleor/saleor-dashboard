import { getStatusColor } from "@dashboard/misc";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import React from "react";

export type DotStatus = "success" | "error" | "warning";
export interface StatusDotProps {
  status: DotStatus;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status }) => {
  const { theme: currentTheme } = useTheme();
  const color = getStatusColor({ status, currentTheme });
  return (
    <Box
      width={2}
      height={2}
      borderRadius="50%"
      __backgroundColor={color.base}
    />
  );
};
