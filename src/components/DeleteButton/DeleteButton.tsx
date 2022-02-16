import { buttonMessages } from "@saleor/intl";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    button: {
      "&:hover": {
        backgroundColor: theme.palette.error.dark
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  }),
  { name: "DeleteButton" }
);

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
  disabled = false
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Button
      variant="primary"
      onClick={onClick}
      className={classes.button}
      data-test-id={testId ? testId : "button-bar-delete"}
      disabled={disabled}
    >
      {label || intl.formatMessage(buttonMessages.delete)}
    </Button>
  );
};

export default DeleteButton;
