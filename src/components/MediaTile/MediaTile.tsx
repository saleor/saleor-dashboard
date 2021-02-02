import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { ProductMediaType } from "@saleor/types/globalTypes";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    media: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    mediaContainer: {
      "&:hover, &.dragged": {
        "& $mediaOverlay": {
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
    mediaOverlay: {
      background: "rgba(0, 0, 0, 0.6)",
      cursor: "move",
      display: "none",
      height: 148,
      left: 0,
      position: "absolute",
      top: 0,
      width: 148
    },
    mediaOverlayShadow: {
      "&mediaOverlay": {
        alignItems: "center",
        display: "flex",
        justifyContent: "center"
      }
    },
    mediaOverlayToolbar: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }),
  { name: "MediaTile" }
);

interface MediaTileProps {
  media: {
    alt?: string;
    type?: string;
    url: string;
  };
  loading?: boolean;
  onDelete?: () => void;
  onEdit?: (event: React.ChangeEvent<any>) => void;
}

const MediaTile: React.FC<MediaTileProps> = props => {
  const { loading, onDelete, onEdit, media } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.mediaContainer} data-test="product-image">
      <div
        className={classNames(classes.mediaOverlay, {
          [classes.mediaOverlayShadow]: loading
        })}
      >
        {loading ? (
          <CircularProgress size={32} />
        ) : (
          <div className={classes.mediaOverlayToolbar}>
            {onEdit && (
              <IconButton color="primary" onClick={onEdit}>
                <EditIcon />
              </IconButton>
            )}
            {onDelete && (
              <IconButton color="primary" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        )}
      </div>
      {media.type === ProductMediaType.VIDEO_YOUTUBE ? (
        <iframe
          className={classes.media}
          title={media.alt}
          src={media.url.replace("/watch?v=", "/embed/")}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <img className={classes.media} src={media.url} alt={media.alt} />
      )}
    </div>
  );
};
MediaTile.displayName = "MediaTile";
export default MediaTile;
