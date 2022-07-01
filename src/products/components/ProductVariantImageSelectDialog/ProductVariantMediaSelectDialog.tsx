import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import { ProductMediaFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%",
    },
    imageContainer: {
      background: "transparent",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      cursor: "pointer",
      height: theme.spacing(21.5),
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      transitionDuration: theme.transitions.duration.standard + "ms",
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      gridTemplateColumns: "repeat(3, 1fr)",
      maxWidth: "100%",
      width: theme.breakpoints.values.lg,
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(2, 1fr)",
      },
    },
    selectedImageContainer: {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
  }),
  { name: "ProductVariantImageSelectDialog" },
);

interface ProductVariantImageSelectDialogProps {
  media?: ProductMediaFragment[];
  selectedMedia?: string[];
  open: boolean;
  onClose();
  onMediaSelect(id: string);
}

const ProductVariantMediaSelectDialog: React.FC<ProductVariantImageSelectDialogProps> = props => {
  const { media, open, selectedMedia, onClose, onMediaSelect } = props;
  const classes = useStyles(props);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          id="iPk640"
          defaultMessage="Media Selection"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <div className={classes.root}>
          {media
            .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1))
            .map(mediaObj => {
              const parsedMediaOembedData = JSON.parse(mediaObj?.oembedData);
              const mediaUrl =
                parsedMediaOembedData?.thumbnail_url || mediaObj.url;
              return (
                <div
                  className={classNames([
                    classes.imageContainer,
                    {
                      [classes.selectedImageContainer]:
                        selectedMedia.indexOf(mediaObj.id) !== -1,
                    },
                  ])}
                  onClick={onMediaSelect(mediaObj.id)}
                  key={mediaObj.id}
                >
                  <img
                    className={classes.image}
                    src={mediaUrl}
                    alt={mediaObj.alt}
                  />
                </div>
              );
            })}
        </div>
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};

ProductVariantMediaSelectDialog.displayName = "ProductVariantMediaSelectDialog";
export default ProductVariantMediaSelectDialog;
