import { Box, type BoxProps } from "@saleor/macaw-ui-next";

/*
Why this works:
- Grid renders anchor on top of each row, that allows navigating by clicking on the row
- That anchor is rendered with position fixed, so it is taken out of the page flow and cannot
  stretch the scrollable area of this container
- When scrolling left/right, we actually scroll the page, not the grid container

overscroll-behavior-x keeps that horizontal scroll inside the grid so it does not turn into a
browser back/forward navigation gesture.
*/

export const PreventHistoryBack = ({ children, ...boxProps }: BoxProps) => (
  <Box position="relative" style={{ overscrollBehaviorX: "none" }} {...boxProps}>
    {children}
  </Box>
);
