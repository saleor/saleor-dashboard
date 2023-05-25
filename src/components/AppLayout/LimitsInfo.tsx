import { Box } from "@saleor/macaw-ui/next";
import React from "react";

interface LimitsInfoProps {
  text: string;
}

/**
 * @deprecated use `Text` instead
 */
export const LimitsInfo: React.FC<LimitsInfoProps> = ({ text }) => (
  <Box position="absolute" left="s7" bottom="s1">
    {text}
  </Box>
);
