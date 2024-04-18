import { Button, Tooltip, TrashBinIcon } from "@saleor/macaw-ui-next";
import React, { forwardRef, useState } from "react";

interface ProductListDeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const BulkDeleteButton = forwardRef<HTMLButtonElement, ProductListDeleteButtonProps>(
  ({ onClick, children, disabled }, ref) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    return (
      <Tooltip open={isTooltipOpen}>
        <Tooltip.Trigger>
          <Button
            ref={ref}
            disabled={disabled}
            onMouseOver={() => {
              setIsTooltipOpen(true);
            }}
            onMouseLeave={() => {
              setIsTooltipOpen(false);
            }}
            onClick={onClick}
            icon={<TrashBinIcon />}
            variant="secondary"
            data-test-id="bulk-delete-button"
          />
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">
          <Tooltip.Arrow />
          {children}
        </Tooltip.Content>
      </Tooltip>
    );
  },
);

BulkDeleteButton.displayName = "BulkDeleteButton";
