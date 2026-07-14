import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button } from "@saleor/macaw-ui-next";
import { Unlink2 } from "lucide-react";
import type * as React from "react";
import { forwardRef } from "react";

interface BulkUnassignButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const BulkUnassignButton = forwardRef<HTMLButtonElement, BulkUnassignButtonProps>(
  ({ onClick, children, disabled }, ref) => (
    <Button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      icon={<Unlink2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
      variant="secondary"
      data-test-id="bulk-unassign-button"
    >
      {children}
    </Button>
  ),
);

BulkUnassignButton.displayName = "BulkUnassignButton";
