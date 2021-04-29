import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";
import CarouselTile from "@saleor/components/CarouselTile";
import ImageUpload from "@saleor/components/ImageUpload";
import { PageCarouselFragment } from "@saleor/fragments/types/PageCarouselFragment";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/theme";
import createMultiFileUploadHandler from "@saleor/utils/handlers/multiFileUploadHandler";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

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
  { name: "PageCarousel" }
);
interface SortableCarouselProps {
  carousel: {
    id: string;
    alt?: string;
    url: string;
  };
  onDelete: () => void;
}

const SortableCarousel = SortableElement<SortableCarouselProps>(
  ({ carousel, onDelete }) => (
    <CarouselTile carousel={carousel} onDelete={onDelete} />
  )
);

interface CarouselListContainerProps {
  className: string;
  carousel: PageCarouselFragment[];
  preview: PageCarouselFragment[];
  onDelete: (id: string) => void;
}
const CarouselListContainer = SortableContainer<CarouselListContainerProps>(
  ({ carousel, preview, onDelete, ...props }) => (
    <div {...props}>
      {carousel.map((carouselObj, index) => (
        <SortableCarousel
          key={`item-${index}`}
          index={index}
          carousel={carouselObj}
          onDelete={onDelete(carouselObj.id)}
        />
      ))}
      {preview
        .sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
        .map((carouselObj, index) => (
          <CarouselTile loading={true} carousel={carouselObj} key={index} />
        ))}
    </div>
  )
);

interface PageCarouselProps {
  placeholderImage?: string;
  carousel: PageCarouselFragment[];
  onImageDelete: (id: string) => void;
  onImageUpload: (file: File) => any;
}

const PageCarousel: React.FC<PageCarouselProps> = props => {
  const { onImageDelete, onImageUpload, carousel, placeholderImage } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const imagesUpload = React.useRef<HTMLInputElement>(null);
  const [imagesToUpload, setImagesToUpload] = React.useState<
    PageCarouselFragment[]
  >([]);

  const handleImageUploadButtonClick = () => imagesUpload.current.click();

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
              __typename: "PageMedia",
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
          defaultMessage: "Carousel Images",
          description: "section header"
        })}
        toolbar={
          <>
            <Button
              variant="text"
              color="primary"
              onClick={handleImageUploadButtonClick}
            >
              <FormattedMessage {...commonMessages.uploadImage} />
            </Button>
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
        {carousel === undefined ? (
          <CardContent>
            <div className={classes.root}>
              <div className={classes.imageContainer}>
                <img className={classes.image} src={placeholderImage} />
              </div>
            </div>
          </CardContent>
        ) : carousel.length > 0 ? (
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
                  <CarouselListContainer
                    distance={20}
                    helperClass="dragged"
                    axis="xy"
                    carousel={carousel}
                    preview={imagesToUpload}
                    className={classNames({
                      [classes.root]: true,
                      [classes.rootDragActive]: isDragActive
                    })}
                    onDelete={onImageDelete}
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
PageCarousel.displayName = "PageCarousel";
export default PageCarousel;
