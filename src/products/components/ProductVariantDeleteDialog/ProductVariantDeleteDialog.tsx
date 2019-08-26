import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import { buttonMessages } from "@saleor/intl";

const styles = (theme: Theme) =>
  createStyles({
    deleteButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  });

export interface ProductVariantDeleteDialogProps
  extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose?();
  onConfirm?();
}

const ProductVariantDeleteDialog = withStyles(styles, {
  name: "ProductVariantDeleteDialog"
})(
  ({
    classes,
    confirmButtonState,
    name,
    open,
    onConfirm,
    onClose
  }: ProductVariantDeleteDialogProps) => (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Delete Variant"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {name}?"
            description="delete product variant"
            values={{
              name
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.cancel} />
        </Button>
        <ConfirmButton
          transitionState={confirmButtonState}
          className={classes.deleteButton}
          variant="contained"
          onClick={onConfirm}
        >
          <FormattedMessage
            defaultMessage="Delete variant"
            description="button"
          />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  )
);
ProductVariantDeleteDialog.displayName = "ProductVariantDeleteDialog";
export default ProductVariantDeleteDialog;
