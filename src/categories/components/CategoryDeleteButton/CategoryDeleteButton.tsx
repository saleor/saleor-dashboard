import { Button, Tooltip, TrashBinIcon } from "@saleor/macaw-ui/next";
import React, { forwardRef, ReactNode } from "react";

interface CategoryDeleteButtonProps {
  onClick: () => void;
  children: ReactNode;
}

export const CategoryDeleteButton = forwardRef<
  HTMLButtonElement,
  CategoryDeleteButtonProps
>(({ onClick, children }, ref) => (
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
      {children}
    </Tooltip.Content>
  </Tooltip>
));
