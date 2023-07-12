import { Button, Tooltip, TrashBinIcon } from "@saleor/macaw-ui/next";
import React, { forwardRef, useState } from "react";
import { FormattedMessage } from "react-intl";

interface ProductListDeleteButtonProps {
  onClick: () => void;
  show?: boolean;
}

export const ProductListDeleteButton = forwardRef<
  HTMLButtonElement,
  ProductListDeleteButtonProps
>(({ onClick, show = false }, ref) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (!show) {
    return null;
  }

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
