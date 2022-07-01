import { Card, CardContent } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import ImageUpload from "@saleor/components/ImageUpload";
import MediaTile from "@saleor/components/MediaTile";
import { ProductMediaFragment, ProductMediaType } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { ProductMediaPopper } from "@saleor/products/components/ProductMediaPopper/ProductMediaPopper";
import { ReorderAction } from "@saleor/types";
import createMultiFileUploadHandler from "@saleor/utils/handlers/multiFileUploadHandler";
import classNames from "classnames";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const messages = defineMessages({
  media: {
    id: "/Mcvt4",
    defaultMessage: "Media",
    description: "section header",
  },
  upload: {
    id: "mGiA6q",
    defaultMessage: "Upload",
    description: "modal button upload",
  },
});

const useStyles = makeStyles(
  theme => ({
    card: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        marginTop: 0,
      },
    },
    fileField: {
      display: "none",
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)",
    },
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%",
    },
    imageContainer: {
      "&:hover, &.dragged": {
        "& $imageOverlay": {
          display: "block",
        },
      },
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      height: 140,
      margin: "auto",
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      width: 140,
    },
    imageGridContainer: {
      position: "relative",
    },
    imageOverlay: {
      background: "rgba(0, 0, 0, 0.6)",
      cursor: "move",
      display: "none",
      height: 140,
      left: 0,
      padding: theme.spacing(2),
      position: "absolute",
      top: 0,
      width: 140,
    },
    imageOverlayToolbar: {
      alignContent: "flex-end",
      display: "flex",
      position: "relative",
      right: theme.spacing(-3),
      top: theme.spacing(-2),
    },
    imageUpload: {
      height: "100%",
      left: 0,
      outline: 0,
      position: "absolute",
      top: 0,
      width: "100%",
    },
    imageUploadActive: {
      zIndex: 1,
    },
    imageUploadIconActive: {
      display: "block",
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      gridTemplateColumns: "repeat(4, 1fr)",
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(3, 1fr)",
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "repeat(2, 1fr)",
      },
    },
    rootDragActive: {
      opacity: 0.2,
    },
  }),
  { name: "ProductMedia" },
);

interface SortableMediaProps {
  media: {
    id: string;
    alt?: string;
    url: string;
  };
  editHref: string;
  onDelete: () => void;
}

const SortableMedia = SortableElement<SortableMediaProps>(
  ({ media, editHref, onDelete }) => (
    <MediaTile media={media} editHref={editHref} onDelete={onDelete} />
  ),
);

interface MediaListContainerProps {
  className: string;
  media: ProductMediaFragment[];
  preview: ProductMediaFragment[];
  onDelete: (id: string) => () => void;
  getEditHref: (id: string) => string;
}

const MediaListContainer = SortableContainer<MediaListContainerProps>(
  ({ media, preview, onDelete, getEditHref, ...props }) => (
    <div {...props}>
      {media.map((mediaObj, index) => (
        <SortableMedia
          key={`item-${index}`}
          index={index}
          media={mediaObj}
          editHref={getEditHref(mediaObj.id)}
          onDelete={onDelete(mediaObj.id)}
        />
      ))}
      {preview
        .sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
        .map((mediaObj, index) => (
          <MediaTile loading={true} media={mediaObj} key={index} />
        ))}
    </div>
  ),
);

interface ProductMediaProps {
  placeholderImage?: string;
  media: ProductMediaFragment[];
  loading?: boolean;
  getImageEditUrl: (id: string) => string;
  onImageDelete: (id: string) => () => void;
  onImageReorder?: ReorderAction;
  onImageUpload(file: File);
  openMediaUrlModal();
}

const ProductMedia: React.FC<ProductMediaProps> = props => {
  const {
    media,
    placeholderImage,
    getImageEditUrl,
    onImageDelete,
    onImageReorder,
    onImageUpload,
    openMediaUrlModal,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const imagesUpload = React.useRef<HTMLInputElement>(null);
  const anchor = React.useRef<HTMLButtonElement>();
  const [imagesToUpload, setImagesToUpload] = React.useState<
    ProductMediaFragment[]
  >([]);
  const [popperOpenStatus, setPopperOpenStatus] = React.useState(false);

  const handleImageUpload = createMultiFileUploadHandler(onImageUpload, {
    onAfterUpload: () =>
      setImagesToUpload(prevImagesToUpload => prevImagesToUpload.slice(1)),
    onStart: files => {
      Array.from(files).forEach((file, fileIndex) => {
        const reader = new FileReader();
        reader.onload = event => {
          setImagesToUpload(prevImagesToUpload => [
            ...prevImagesToUpload,
            {
              __typename: "ProductMedia",
              alt: "",
              id: "",
              sortOrder: fileIndex,
              type: ProductMediaType.IMAGE,
              url: event.target.result as string,
              oembedData: null,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
  });

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage(messages.media)}
        toolbar={
          <>
            <Button
              onClick={() => setPopperOpenStatus(true)}
              variant="tertiary"
              data-test-id="button-upload-image"
              ref={anchor}
            >
              {intl.formatMessage(messages.upload)}
            </Button>

            <ProductMediaPopper
              anchorRef={anchor.current}
              imagesUploadRef={imagesUpload.current}
              setPopperStatus={setPopperOpenStatus}
              popperStatus={popperOpenStatus}
              openMediaUrlModal={openMediaUrlModal}
            />

            <input
              className={classes.fileField}
              id="fileUpload"
              onChange={event => handleImageUpload(event.target.files)}
              multiple
              type="file"
              ref={imagesUpload}
              accept="image/*"
            />
          </>
        }
      />
      <div className={classes.imageGridContainer}>
        {media === undefined ? (
          <CardContent>
            <div className={classes.root}>
              <div className={classes.imageContainer}>
                <img className={classes.image} src={placeholderImage} />
              </div>
            </div>
          </CardContent>
        ) : media.length > 0 ? (
          <>
            <ImageUpload
              className={classes.imageUpload}
              isActiveClassName={classes.imageUploadActive}
              disableClick={true}
              hideUploadIcon={true}
              iconContainerActiveClassName={classes.imageUploadIconActive}
              onImageUpload={handleImageUpload}
            >
              {({ isDragActive }) => (
                <CardContent>
                  <MediaListContainer
                    distance={20}
                    helperClass="dragged"
                    axis="xy"
                    media={media}
                    preview={imagesToUpload}
                    onSortEnd={onImageReorder}
                    className={classNames({
                      [classes.root]: true,
                      [classes.rootDragActive]: isDragActive,
                    })}
                    onDelete={onImageDelete}
                    getEditHref={getImageEditUrl}
                  />
                </CardContent>
              )}
            </ImageUpload>
          </>
        ) : (
          <ImageUpload onImageUpload={handleImageUpload} />
        )}
      </div>
    </Card>
  );
};
ProductMedia.displayName = "ProductMedia";
export default ProductMedia;
