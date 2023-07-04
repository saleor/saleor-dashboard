import { Button, Tooltip, TrashBinIcon } from "@saleor/macaw-ui/next";
import React, { forwardRef, ReactNode, useState } from "react";

interface OrderDraftListDeleteButtonProps {
  onClick: () => void;
  children: ReactNode;
}

export const OrderDraftListDeleteButton = forwardRef<
  HTMLButtonElement,
  OrderDraftListDeleteButtonProps
>(({ onClick, children }, ref) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <Tooltip open={isTooltipOpen}>
      <Tooltip.Trigger>
        <Button
          ref={ref}
          onMouseOver={() => {
            setIsTooltipOpen(true);
          }}
          onMouseLeave={() => {
            setIsTooltipOpen(false);
          }}
          onClick={onClick}
          icon={<TrashBinIcon />}
          variant="secondary"
          data-test-id="delete-categories-button"
        />
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        {children}
      </Tooltip.Content>
    </Tooltip>
  );
});
