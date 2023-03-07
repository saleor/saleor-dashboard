import { Box } from "@saleor/macaw-ui/next";
import React from "react";

export interface StatusDotProps {
  status: "default" | "error";
}

export const StatusDot: React.FC<StatusDotProps> = ({ status }) => (
  <Box
    width={4}
    height={4}
    borderRadius="50%"
    backgroundColor={
      status === "default"
        ? "decorativeSurfacePlain2"
        : "interactiveCriticalDefault"
    }
  />
);
