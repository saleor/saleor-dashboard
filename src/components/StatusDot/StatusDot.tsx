import { Box, ThemeTokensValues } from "@saleor/macaw-ui-next";
import React from "react";

export type DotStatus = "success" | "error" | "warning";
export interface StatusDotProps {
  status: DotStatus;
}

export const getStatusDotColor = (
  status: DotStatus,
): keyof ThemeTokensValues["colors"]["background"] => {
  switch (status) {
    case "error":
      return "critical1";
    case "warning":
      return "warning1"; // TODO: warning token needs to be in macaw
    default:
      return "success1";
  }
};

export const StatusDot: React.FC<StatusDotProps> = ({ status }) => (
  <Box
    width={2}
    height={2}
    borderRadius="50%"
    backgroundColor={getStatusDotColor(status)}
  />
);
