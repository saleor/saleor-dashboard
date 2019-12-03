import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { buttonMessages } from "@saleor/intl";
import { ProductImage } from "../../types/ProductImage";

const useStyles = makeStyles(
  theme => ({
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    imageContainer: {
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      cursor: "pointer",
      height: theme.spacing(21.5),
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      transitionDuration: theme.transitions.duration.standard + "ms"
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      gridTemplateColumns: "repeat(3, 1fr)",
      maxWidth: "100%",
      width: theme.breakpoints.values.lg,
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(2, 1fr)"
      }
    },
    selectedImageContainer: {
      borderColor: theme.palette.primary.main
    }
  }),
  { name: "ProductVariantImageSelectDialog" }
);

interface ProductVariantImageSelectDialogProps {
  images?: ProductImage[];
  selectedImages?: string[];
  open: boolean;
  onClose();
  onImageSelect(id: string);
}

const ProductVariantImageSelectDialog: React.FC<
  ProductVariantImageSelectDialogProps
> = props => {
  const { images, open, selectedImages, onClose, onImageSelect } = props;

  const classes = useStyles(props);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Image Selection"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <div className={classes.root}>
          {images
            .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1))
            .map(tile => (
              <div
                className={classNames([
                  classes.imageContainer,
                  {
                    [classes.selectedImageContainer]:
                      selectedImages.indexOf(tile.id) !== -1
                  }
                ])}
                onClick={onImageSelect(tile.id)}
                key={tile.id}
              >
                <img className={classes.image} src={tile.url} />
              </div>
            ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
ProductVariantImageSelectDialog.displayName = "ProductVariantImageSelectDialog";
export default ProductVariantImageSelectDialog;
