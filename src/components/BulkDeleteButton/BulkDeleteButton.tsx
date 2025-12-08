import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { forwardRef, useState } from "react";
import * as React from "react";

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
            icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
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
