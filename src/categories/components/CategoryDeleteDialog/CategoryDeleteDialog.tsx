import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import { Button } from "@saleor/components/Button";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main,
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }),
  {
    name: "CategoryDeleteDialog",
  },
);

export interface CategoryDeleteDialogProps {
  open: boolean;
  name: string;
  onClose();
  onConfirm();
}

const CategoryDeleteDialog: React.FC<CategoryDeleteDialogProps> = props => {
  const { name, open, onConfirm, onClose } = props;

  const classes = useStyles(props);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          id="xo5UIb"
          defaultMessage="Delete category"
          description="dialog title"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            id="dJQxHt"
            defaultMessage="Are you sure you want to delete {categoryName}?"
            description="delete category"
            values={{
              categoryName: <strong>{name}</strong>,
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <Button
          className={classes.deleteButton}
          variant="primary"
          onClick={onConfirm}
        >
          <FormattedMessage {...buttonMessages.save} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CategoryDeleteDialog.displayName = "CategoryDeleteDialog";
export default CategoryDeleteDialog;
