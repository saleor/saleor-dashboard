import { Box, Sprinkles } from "@saleor/macaw-ui/next";
import React from "react";

interface ContentProps {
  children: React.ReactNode;
  padding?: Sprinkles["padding"];
  paddingLeft?: Sprinkles["paddingLeft"];
  paddingRight?: Sprinkles["paddingRight"];
  paddingTop?: Sprinkles["paddingTop"];
}

export const Content: React.FC<ContentProps> = ({
  children,
  paddingLeft = 10,
  paddingTop = 10,
  paddingRight = 7,
}) => (
  <Box
    paddingLeft={paddingLeft}
    __gridArea="content"
    paddingTop={paddingTop}
    paddingRight={paddingRight}
  >
    {children}
  </Box>
);
