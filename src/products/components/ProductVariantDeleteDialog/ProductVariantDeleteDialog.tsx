import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
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
  { name: "ProductVariantDeleteDialog" },
);

export interface ProductVariantDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  onClose?();
  onConfirm?();
}

const ProductVariantDeleteDialog: React.FC<ProductVariantDeleteDialogProps> = props => {
  const { confirmButtonState, name, open, onConfirm, onClose } = props;

  const classes = useStyles(props);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          id="GFJabu"
          defaultMessage="Delete Variant"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            id="WwNtFn"
            defaultMessage="Are you sure you want to delete {name}?"
            description="delete product variant"
            values={{
              name,
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          transitionState={confirmButtonState}
          className={classes.deleteButton}
          onClick={onConfirm}
        >
          <FormattedMessage
            id="rbkmfG"
            defaultMessage="Delete variant"
            description="button"
          />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
ProductVariantDeleteDialog.displayName = "ProductVariantDeleteDialog";
export default ProductVariantDeleteDialog;
