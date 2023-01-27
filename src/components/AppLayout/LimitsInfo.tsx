import { Box } from "@saleor/macaw-ui/next";
import React from "react";

interface LimitsInfoProps {
  text: string;
}

export const LimitsInfo: React.FC<LimitsInfoProps> = ({ text }) => (
  <Box>{text}</Box>
);
