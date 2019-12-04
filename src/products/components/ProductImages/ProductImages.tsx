import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import CardTitle from "@saleor/components/CardTitle";
import ImageTile from "@saleor/components/ImageTile";
import ImageUpload from "@saleor/components/ImageUpload";
import { commonMessages } from "@saleor/intl";
import { ReorderAction } from "@saleor/types";
import createMultiFileUploadHandler from "@saleor/utils/handlers/multiFileUploadHandler";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { ProductDetails_product_images } from "../../types/ProductDetails";

const useStyles = makeStyles(
  theme => ({
    card: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        marginTop: 0
      }
    },
    fileField: {
      display: "none"
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)"
    },
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    imageContainer: {
      "&:hover, &.dragged": {
        "& $imageOverlay": {
          display: "block"
        }
      },
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      height: 140,
      margin: "auto",
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      width: 140
    },
    imageGridContainer: {
      position: "relative"
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
      width: 140
    },
    imageOverlayToolbar: {
      alignContent: "flex-end",
      display: "flex",
      position: "relative",
      right: -theme.spacing(3),
      top: -theme.spacing(2)
    },
    imageUpload: {
      height: "100%",
      left: 0,
      outline: 0,
      position: "absolute",
      top: 0,
      width: "100%"
    },
    imageUploadActive: {
      zIndex: 1
    },
    imageUploadIcon: {
      display: "none"
    },
    imageUploadIconActive: {
      display: "block"
    },
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      gridTemplateColumns: "repeat(4, 1fr)",
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(3, 1fr)"
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "repeat(2, 1fr)"
      }
    },
    rootDragActive: {
      opacity: 0.2
    }
  }),
  { name: "ProductImages" }
);

interface ProductImagesProps {
  placeholderImage?: string;
  images: ProductDetails_product_images[];
  loading?: boolean;
  onImageDelete: (id: string) => () => void;
  onImageEdit: (id: string) => () => void;
  onImageReorder?: ReorderAction;
  onImageUpload(file: File);
}

interface SortableImageProps {
  image: {
    id: string;
    alt?: string;
    url: string;
  };
  onImageEdit: (id: string) => void;
  onImageDelete: () => void;
}

const SortableImage = SortableElement<SortableImageProps>(
  ({ image, onImageEdit, onImageDelete }) => (
    <ImageTile
      image={image}
      onImageEdit={onImageEdit ? () => onImageEdit(image.id) : undefined}
      onImageDelete={onImageDelete}
    />
  )
);

interface ImageListContainerProps {
  className: string;
  items: ProductDetails_product_images[];
  preview: ProductDetails_product_images[];
  onImageDelete: (id: string) => () => void;
  onImageEdit: (id: string) => () => void;
}

const ImageListContainer = SortableContainer<ImageListContainerProps>(
  ({ items, preview, onImageDelete, onImageEdit, ...props }) => (
    <div {...props}>
      {items.map((image, index) => (
        <SortableImage
          key={`item-${index}`}
          index={index}
          image={image}
          onImageEdit={onImageEdit ? onImageEdit(image.id) : null}
          onImageDelete={onImageDelete(image.id)}
        />
      ))}
      {preview
        .sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
        .map(image => (
          <ImageTile loading={true} image={image} />
        ))}
    </div>
  )
);

const ProductImages: React.FC<ProductImagesProps> = props => {
  const {
    images,
    placeholderImage,
    loading,
    onImageEdit,
    onImageDelete,
    onImageReorder,
    onImageUpload
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const upload = React.useRef(null);
  const [imagesToUpload, setImagesToUpload] = React.useState<
    ProductDetails_product_images[]
  >([]);

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
              __typename: "ProductImage",
              alt: "",
              id: "",
              sortOrder: fileIndex,
              url: event.target.result as string
            }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  });

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Images",
          description: "section header"
        })}
        toolbar={
          <>
            <Button
              onClick={() => upload.current.click()}
              disabled={loading}
              variant="text"
              color="primary"
              data-tc="button-upload-image"
            >
              {intl.formatMessage(commonMessages.uploadImage)}
            </Button>
            <input
              className={classes.fileField}
              id="fileUpload"
              onChange={event => handleImageUpload(event.target.files)}
              multiple
              type="file"
              ref={upload}
              accept="image/*"
            />
          </>
        }
      />
      <div className={classes.imageGridContainer}>
        {images === undefined ? (
          <CardContent>
            <div className={classes.root}>
              <div className={classes.imageContainer}>
                <img className={classes.image} src={placeholderImage} />
              </div>
            </div>
          </CardContent>
        ) : images.length > 0 ? (
          <>
            <ImageUpload
              className={classes.imageUpload}
              isActiveClassName={classes.imageUploadActive}
              disableClick={true}
              iconContainerClassName={classes.imageUploadIcon}
              iconContainerActiveClassName={classes.imageUploadIconActive}
              onImageUpload={handleImageUpload}
            >
              {({ isDragActive }) => (
                <CardContent>
                  <ImageListContainer
                    distance={20}
                    helperClass="dragged"
                    axis="xy"
                    items={images}
                    preview={imagesToUpload}
                    onSortEnd={onImageReorder}
                    className={classNames({
                      [classes.root]: true,
                      [classes.rootDragActive]: isDragActive
                    })}
                    onImageDelete={onImageDelete}
                    onImageEdit={onImageEdit}
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
ProductImages.displayName = "ProductImages";
export default ProductImages;
