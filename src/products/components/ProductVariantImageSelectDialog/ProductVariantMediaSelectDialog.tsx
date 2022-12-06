import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import { ProductMediaFragment } from "@saleor/graphql";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import { buttonMessages } from "@saleor/intl";
import clsx from "clsx";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

interface ProductVariantImageSelectDialogProps {
  media?: ProductMediaFragment[];
  selectedMedia?: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

const ProductVariantMediaSelectDialog: React.FC<ProductVariantImageSelectDialogProps> = props => {
  const {
    media,
    open,
    selectedMedia: initialMedia,
    onClose,
    onConfirm,
  } = props;
  const classes = useStyles(props);

  const [selectedMedia, setSelectedMedia] = useState(initialMedia);

  useModalDialogOpen(open, {
    onOpen: () => setSelectedMedia(initialMedia),
    onClose: () => setSelectedMedia(initialMedia),
  });

  const handleMediaSelect = (id: string) => {
    const isMediaAssigned = selectedMedia.includes(id);

    if (isMediaAssigned) {
      setSelectedMedia(selectedMedia =>
        selectedMedia.filter(mediaId => mediaId !== id),
      );
    } else {
      setSelectedMedia(selectedMedia => [...selectedMedia, id]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedMedia);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage
          id="iPk640"
          defaultMessage="Media Selection"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent className={classes.content}>
        <div className={classes.root}>
          {media
            .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1))
            .map(mediaObj => {
              const parsedMediaOembedData = JSON.parse(mediaObj?.oembedData);
              const mediaUrl =
                parsedMediaOembedData?.thumbnail_url || mediaObj.url;
              return (
                <div
                  className={clsx([
                    classes.imageContainer,
                    {
                      [classes.selectedImageContainer]:
                        selectedMedia.indexOf(mediaObj.id) !== -1,
                    },
                  ])}
                  onClick={() => handleMediaSelect(mediaObj.id)}
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
        <ConfirmButton
          transitionState="default"
          onClick={handleConfirm}
          data-test-id="submit"
        >
          <FormattedMessage {...buttonMessages.confirm} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};

ProductVariantMediaSelectDialog.displayName = "ProductVariantMediaSelectDialog";
export default ProductVariantMediaSelectDialog;
