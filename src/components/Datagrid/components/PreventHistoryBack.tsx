import { Box, BoxProps } from "@saleor/macaw-ui-next";

/*
Why this works:
- Grid renders anchor on top of each row, that allows navigating by clicking on the row
- That anchor is rendered with position absolute
- When scrolling left/right, we actually scroll the page, not the grid container

Wrapping the grid in the relative container (position: relative) gives the anchor boundaries,
which prevents overscrolling the page.
*/

export const PreventHistoryBack = ({ children, ...boxProps }: BoxProps) => (
  <Box position="relative" style={{ overscrollBehaviorX: "none" }} {...boxProps}>
    {children}
  </Box>
);
