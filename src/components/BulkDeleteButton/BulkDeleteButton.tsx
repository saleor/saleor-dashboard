import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { bulkActionWithCountMessages } from "./messages";

interface BulkDeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  count: number;
  size?: "small" | "medium";
}

export const BulkDeleteButton = forwardRef<HTMLButtonElement, BulkDeleteButtonProps>(
  ({ onClick, children, disabled, count, size = "medium" }, ref) => (
    <Button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      type="button"
      size={size}
      variant="secondary"
      data-test-id="bulk-delete-button"
    >
      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      <FormattedMessage
        {...bulkActionWithCountMessages.actionWithCount}
        values={{ action: children, count }}
      />
    </Button>
  ),
);

BulkDeleteButton.displayName = "BulkDeleteButton";
