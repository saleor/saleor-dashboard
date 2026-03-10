import { Arrow as RadixTooltipArrow } from "@radix-ui/react-tooltip";
import { vars } from "~/theme";
import { classNames } from "~/utils";
import { arrow } from "./Tooltip.css";

export interface TooltipArrowProps {
  className?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export const Arrow = ({
  className,
  backgroundColor = vars.colors.background.default1,
  borderColor = vars.colors.border.default1,
}: TooltipArrowProps) => {
  return (
    <RadixTooltipArrow asChild className={classNames(arrow, className)}>
      <svg
        width="20"
        height="9"
        viewBox="0 0 20 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-macaw-ui-component="Tooltip.Arrow"
      >
        <path
          fill={backgroundColor}
          stroke={borderColor}
          d="M8.086 7.086.5-.5h18l-7.586 7.586a2 2 0 0 1-2.828 0Z"
        />
      </svg>
    </RadixTooltipArrow>
  );
};

Arrow.displayName = "Tooltip.Arrow";
