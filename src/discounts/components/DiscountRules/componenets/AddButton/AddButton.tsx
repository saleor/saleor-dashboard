import { Button, PlusIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";

interface AddButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export const AddButton = ({ onClick, disabled = false }: AddButtonProps) => {
  const intl = useIntl();

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      variant="primary"
    >
      <PlusIcon />
      {intl.formatMessage(messages.addRule)}
    </Button>
  );
};
