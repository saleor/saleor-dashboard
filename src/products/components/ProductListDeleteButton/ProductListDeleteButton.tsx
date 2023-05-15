import { Button, Tooltip, TrashBinIcon } from "@saleor/macaw-ui/next";
import React, { forwardRef } from "react";
import { FormattedMessage } from "react-intl";

interface ProductListDeleteButtonProps {
  onClick: () => void;
  show?: boolean;
}

export const ProductListDeleteButton = forwardRef<
  HTMLButtonElement,
  ProductListDeleteButtonProps
>(({ onClick, show = false }, ref) => {
  if (!show) {
    return null;
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button
          ref={ref}
          onClick={onClick}
          icon={<TrashBinIcon />}
          variant="secondary"
          data-test-id="delete-products-button"
        />
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        <FormattedMessage defaultMessage="Bulk product delete" id="jrBxCQ" />
      </Tooltip.Content>
    </Tooltip>
  );
});
