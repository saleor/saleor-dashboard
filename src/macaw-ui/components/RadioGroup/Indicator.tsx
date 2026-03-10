import * as RadioGroup from "@radix-ui/react-radio-group";
import { forwardRef } from "react";
import { indicator } from "./Item.css";

export interface RadioGroupIndicatorProps {
  disabled?: boolean;
  asChild?: boolean;
}

export const RadioGroupIndicator = forwardRef<
  HTMLDivElement,
  RadioGroupIndicatorProps
>(({ disabled, asChild }, ref) => {
  return (
    <RadioGroup.Indicator
      className={indicator({ disabled })}
      asChild={asChild}
      ref={ref}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="6"
        height="6"
        fill="currentColor"
      >
        <circle cx="3" cy="3" r="3" fill="currentColor" />
      </svg>
    </RadioGroup.Indicator>
  );
});

RadioGroupIndicator.displayName = "RadioGroupIndicator";
