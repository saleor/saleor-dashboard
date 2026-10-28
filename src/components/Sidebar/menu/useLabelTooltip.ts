import { useState } from "react";

interface LabelTooltipOptions {
  /** Keeps the tooltip closed, e.g. while the control's own overlay is open. */
  hidden?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface LabelTooltip {
  rootProps: { open: boolean; onOpenChange: (open: boolean) => void };
  triggerProps: { onPointerLeave: () => void };
}

/**
 * For tooltips that are only a label. Radix keeps tooltip content hoverable and closes it on a
 * later pointer move outside, which never arrives when the pointer leaves over an app iframe.
 * Closing on leaving the trigger avoids the stuck tooltip.
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
    rootProps: { open: open && !hidden, onOpenChange: changeOpen },
    triggerProps: { onPointerLeave: () => changeOpen(false) },
  };
};
