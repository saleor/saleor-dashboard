import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  }),
  {
    name: "CategoryDeleteDialog"
  }
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
          defaultMessage="Delete category"
          description="dialog title"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {categoryName}?"
            description="delete category"
            values={{
              categoryName: <strong>{name}</strong>
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <Button
          className={classes.deleteButton}
          variant="contained"
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
