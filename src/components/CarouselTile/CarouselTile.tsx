import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    carousel: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    carouselContainer: {
      "&:hover, &.dragged": {
        "& $carouselOverlay": {
          display: "block"
        }
      },
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.spacing(),
      height: 148,
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      width: 148
    },
    carouselOverlay: {
      background: "rgba(0, 0, 0, 0.6)",
      cursor: "move",
      display: "none",
      height: 148,
      left: 0,
      position: "absolute",
      top: 0,
      width: 148
    },
    carouselOverlayShadow: {
      "&carouselOverlay": {
        alignItems: "center",
        display: "flex",
        justifyContent: "center"
      }
    },
    carouselOverlayToolbar: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }),
  { name: "CarouselTile" }
);

interface CarouselTileProps {
  carousel: {
    alt: string;
    url: string;
    type?: string;
    oembedData?: string;
  };
  loading?: boolean;
  onDelete?: () => void;
}

const CarouselTile: React.FC<CarouselTileProps> = props => {
  const { loading, onDelete, carousel } = props;
  const classes = useStyles(props);
  const parsedCarouselOembedData = carousel?.oembedData
    ? JSON.parse(carousel.oembedData)
    : null;
  const carouselUrl = parsedCarouselOembedData?.thumbnail_url || carousel.url;

  return (
    <div className={classes.carouselContainer} data-test="product-image">
      <div
        className={classNames(classes.carouselOverlay, {
          [classes.carouselOverlayShadow]: loading
        })}
      >
        {loading ? (
          <CircularProgress size={32} />
        ) : (
          <div className={classes.carouselOverlayToolbar}>
            {onDelete && (
              <IconButton color="primary" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        )}
      </div>
      <img className={classes.carousel} src={carouselUrl} alt={carousel.alt} />
    </div>
  );
};
CarouselTile.displayName = "CarouselTile";
export default CarouselTile;
