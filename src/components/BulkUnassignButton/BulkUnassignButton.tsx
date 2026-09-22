import { bulkActionWithCountMessages } from "@dashboard/components/BulkDeleteButton/messages";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button } from "@saleor/macaw-ui-next";
import { Unlink2 } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface BulkUnassignButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  count: number;
}

export const BulkUnassignButton = forwardRef<HTMLButtonElement, BulkUnassignButtonProps>(
  ({ onClick, children, disabled, count }, ref) => (
    <Button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      variant="secondary"
      data-test-id="bulk-unassign-button"
    >
      <Unlink2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      <FormattedMessage
        {...bulkActionWithCountMessages.actionWithCount}
        values={{ action: children, count }}
      />
    </Button>
  ),
);

BulkUnassignButton.displayName = "BulkUnassignButton";
