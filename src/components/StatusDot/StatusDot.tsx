import { Box, Sprinkles } from "@saleor/macaw-ui/next";
import React from "react";

export interface StatusDotProps {
  status: "default" | "error";
}

const getStatusColor = (
  status: StatusDotProps["status"],
): Sprinkles["backgroundColor"] => {
  switch (status) {
    case "error":
      return "interactiveCriticalDefault";
    default:
      return "decorativeSurfacePlain2";
  }
};

export const StatusDot: React.FC<StatusDotProps> = ({ status }) => (
  <Box
    width={5}
    height={5}
    borderRadius="50%"
    backgroundColor={getStatusColor(status)}
  />
);
