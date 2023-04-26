import { Button, Tooltip, TrashBinIcon } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ProductListDeleteButtonProps {
  onClick: () => void;
  show?: boolean;
}

export const ProductListDeleteButton = ({
  onClick,
  show = false,
}: ProductListDeleteButtonProps) => {
  if (!show) {
    return null;
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button
          onClick={onClick}
          icon={<TrashBinIcon />}
          variant="secondary"
        ></Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        <FormattedMessage defaultMessage="Bulk product delete" id="jrBxCQ" />
      </Tooltip.Content>
    </Tooltip>
  );
};
