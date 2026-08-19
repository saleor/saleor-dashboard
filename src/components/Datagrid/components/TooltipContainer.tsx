import { Box, Tooltip } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { type TooltipAlign, type TooltipSide } from "../hooks/useTooltipContainer";
import styles from "./TooltipContainer.module.css";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TooltipContainerProps {
  align?: TooltipAlign;
  content?: ReactNode;
  bounds?: Bounds;
  side?: TooltipSide;
}

/**
 * Glide reports cell bounds in viewport coordinates. Anchor accordingly with
 * `position: fixed`. For `side="left"`, open from the cell's left edge; for
 * `side="right"`, from the right edge.
 */
export const getTooltipAnchor = (bounds: Bounds, side: TooltipSide = "top") => {
  const { x, y, width, height } = bounds;

  switch (side) {
    case "left":
      return { left: x, top: y + height / 2 };
    case "right":
      return { left: x + width, top: y + height / 2 };
    case "bottom":
      return { left: x + width / 2, top: y + height };
    case "top":
    default:
      return { left: x + width / 2, top: y };
  }
};

export const TooltipContainer = ({
  align = "center",
  content,
  bounds,
  side = "top",
}: TooltipContainerProps) => {
  if (!bounds || content === undefined || content === null || content === "") {
    return null;
  }

  const anchor = getTooltipAnchor(bounds, side);

  return (
    <Box
      position="fixed"
      as="div"
      __width={1}
      __height={1}
      __top={anchor.top}
      __left={anchor.left}
      zIndex="3"
      pointerEvents="none"
    >
      <Tooltip open={true}>
        <Tooltip.Trigger>
          <span />
        </Tooltip.Trigger>
        {/*
          Portaled content must also be non-interactive — parent pointer-events
          does not apply across the portal. Otherwise the panel steals hover from
          Glide and freezes the tooltip on the previous cell.
        */}
        <Tooltip.Content
          side={side}
          align={align}
          sideOffset={0}
          avoidCollisions={false}
          className={styles.tooltipContent}
        >
          <Tooltip.Arrow />
          <Box __whiteSpace={typeof content === "string" ? "pre-line" : undefined}>{content}</Box>
        </Tooltip.Content>
      </Tooltip>
    </Box>
  );
};
