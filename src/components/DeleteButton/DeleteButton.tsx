import { Button } from "@material-ui/core";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/theme";
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
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  label,
  disabled = false
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Button
      variant="contained"
      onClick={onClick}
      className={classes.button}
      data-test="button-bar-delete"
      disabled={disabled}
    >
      {label || intl.formatMessage(buttonMessages.delete)}
    </Button>
  );
};

export default DeleteButton;
