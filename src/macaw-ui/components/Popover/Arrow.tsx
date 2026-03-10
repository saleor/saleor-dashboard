import { Arrow as RadixPopoverArrow } from "@radix-ui/react-popover";
import { Sprinkles, sprinkles } from "~/theme";
import { classNames } from "~/utils";
import { arrow } from "./Popover.css";

export type PopoverArrowProps = {
  fill?: Sprinkles["fill"];
  stroke?: Sprinkles["stroke"];
  className?: string;
};

export const Arrow = ({
  className,
  fill = "default2",
  stroke = "default1",
}: PopoverArrowProps) => {
  return (
    <RadixPopoverArrow className={classNames(arrow, className)} asChild>
      <svg
        width="20"
        height="9"
        viewBox="0 0 20 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-macaw-ui-component="Popover.Arrow"
      >
        <path
          d="M8.08579 7.08579L0.5 -0.5H18.5L10.9142 7.08579C10.1332 7.86683 8.86684 7.86684 8.08579 7.08579Z"
          strokeLinejoin="round"
          className={sprinkles({ fill, stroke })}
        />
      </svg>
    </RadixPopoverArrow>
  );
};

Arrow.displayName = "Popover.Arrow";
