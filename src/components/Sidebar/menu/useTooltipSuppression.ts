import { type FocusEvent, useState } from "react";

interface TooltipSuppression {
  isSuppressed: boolean;
  suppress: () => void;
  triggerProps: {
    onPointerEnter: () => void;
    onBlur: (event: FocusEvent<HTMLElement>) => void;
  };
}

/**
 * For a control that opens an overlay: closing it returns focus to the control, and focus alone
 * would pop the control's tooltip over the page. Once suppressed, the tooltip stays hidden until
 * the next hover or until focus moves elsewhere.
 */
export const useTooltipSuppression = (): TooltipSuppression => {
  const [isSuppressed, setSuppressed] = useState(false);
  const release = (): void => setSuppressed(false);

  return {
    isSuppressed,
    suppress: () => setSuppressed(true),
    triggerProps: {
      onPointerEnter: release,
      onBlur: event => {
        // Radix marks the trigger open while focus sits inside its overlay; that blur is temporary.
        if (event.currentTarget.dataset.state !== "open") {
          release();
        }
      },
    },
  };
};
