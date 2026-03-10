import { ReactNode } from "react";
import {
  Portal as RadixTooltipPortal,
  Content as RadixTooltipContent,
} from "@radix-ui/react-tooltip";
import { Box } from "../Box";

export interface TooltipContentProps {
  children: ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  avoidCollisions?: boolean;
}

export const Content = ({
  children,
  className,
  sideOffset = 2,
  avoidCollisions = true,
  ...props
}: TooltipContentProps) => {
  return (
    <RadixTooltipPortal>
      <RadixTooltipContent
        asChild
        className={className}
        sideOffset={sideOffset}
        avoidCollisions={avoidCollisions}
        data-macaw-ui-component="Tooltip.Content"
        {...props}
      >
        <Box
          borderStyle={children ? "solid" : "none"}
          borderWidth={1}
          borderRadius={3}
          borderColor="default1"
          padding={children ? 4 : 0}
          fontSize={1}
          lineHeight={1}
          color="default1"
          backgroundColor="default1"
          boxShadow="defaultOverlay"
        >
          {children}
        </Box>
      </RadixTooltipContent>
    </RadixTooltipPortal>
  );
};

Content.displayName = "Tooltip.Content";
