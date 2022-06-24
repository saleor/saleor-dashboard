import { Button } from "@saleor/components/Button";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

interface DeleteButtonProps {
  onClick: () => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
  testId?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  label,
  testId,
  disabled = false,
}) => {
  const intl = useIntl();

  return (
    <Button
      error
      variant="primary"
      onClick={onClick}
      data-test-id={testId ? "confirm-delete" : "button-bar-delete"}
      disabled={disabled}
    >
      {label || intl.formatMessage(buttonMessages.delete)}
    </Button>
  );
};

export default DeleteButton;
