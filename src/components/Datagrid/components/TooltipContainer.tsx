import { Box, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";

interface TooltipContainerProps {
  clearTooltip: () => void;
  title?: string;
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const TooltipContainer = ({ title, bounds, clearTooltip }: TooltipContainerProps) => {
  if (!bounds || !title) {
    return null;
  }

  const { x, y, width, height } = bounds;

  return (
    <>
      {/* This box fill all space base on bound props, serves for container to clear tooltip onMouseLeave */}
      <Box
        position="absolute"
        as="div"
        __width={width}
        __height={height}
        __top={y}
        __left={x}
        zIndex="3"
        onMouseLeave={clearTooltip}
      />

      {/* This box is used for positioning tootip in middle  */}
      <Box
        position="absolute"
        as="div"
        __width={1}
        __height={1}
        __top={y}
        __left={x + width / 2}
        zIndex="2"
      >
        <Tooltip open={true}>
          <Tooltip.Trigger>
            <span></span>
          </Tooltip.Trigger>
          <Tooltip.Content side="top">
            <Tooltip.Arrow />
            {title}
          </Tooltip.Content>
        </Tooltip>
      </Box>
    </>
  );
};
