import { useState } from "react";

interface LabelTooltipOptions {
  /** Keeps the tooltip closed, e.g. while the control's own overlay is open. */
  hidden?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface LabelTooltip {
  rootProps: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    disableHoverableContent: true;
  };
}

/**
 * For tooltips that are only a label. By default Radix keeps tooltip content hoverable and closes
 * it on a later pointer move outside, which never arrives when the pointer leaves over an app
 * iframe. Without hoverable content Radix closes as soon as the pointer leaves the trigger, and
 * since Radix does the closing it also restores the open delay for the next hover.
 */
export const useLabelTooltip = ({
  hidden = false,
  onOpenChange,
}: LabelTooltipOptions = {}): LabelTooltip => {
  const [open, setOpen] = useState(false);

  const changeOpen = (nextOpen: boolean): void => {
    if (hidden && nextOpen) {
      return;
    }

    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return {
    // Macaw's Tooltip forwards props it does not declare to the Radix root.
    rootProps: { open: open && !hidden, onOpenChange: changeOpen, disableHoverableContent: true },
  };
};
