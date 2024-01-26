import { Button, PlusIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { useDiscountRulesContext } from "../../context";
import { messages } from "../../messages";

interface AddButtonProps {
  onClick: () => void;
}

export const AddButton = ({ onClick }: AddButtonProps) => {
  const intl = useIntl();
  const { disabled = false } = useDiscountRulesContext();

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
