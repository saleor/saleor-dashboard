import {
  Provider as RadixTooltipProvider,
  Root as RadixTooltipRoot,
} from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export interface TooltipProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  open?: boolean;
  delayDuration?: number;
  onOpenChange?: (open: boolean) => void;
}

export const TooltipRoot = ({
  children,
  delayDuration = 250,
  ...props
}: TooltipProps) => {
  return (
    <RadixTooltipProvider>
      <RadixTooltipRoot
        delayDuration={delayDuration}
        {...props}
        data-macaw-ui-component="Tooltip"
      >
        {children}
      </RadixTooltipRoot>
    </RadixTooltipProvider>
  );
};

TooltipRoot.displayName = "Tooltip";
