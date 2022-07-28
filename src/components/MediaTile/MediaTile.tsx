import { CircularProgress } from "@material-ui/core";
import { IconButton } from "@saleor/components/IconButton";
import { DeleteIcon, EditIcon, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    media: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%",
    },
    mediaContainer: {
      "&:hover, &.dragged": {
        "& $mediaOverlay": {
          display: "block",
        },
      },
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.spacing(),
      height: 148,
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      width: 148,
    },
    mediaOverlay: {
      background: theme.palette.background.default,
      opacity: 0.8,
      cursor: "move",
      display: "none",
      height: 148,
      left: 0,
      position: "absolute",
      top: 0,
      width: 148,
    },
    mediaOverlayShadow: {
      "&mediaOverlay": {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      },
    },
    mediaOverlayToolbar: {
      display: "flex",
      justifyContent: "flex-end",
    },
    controlButton: {
      color: theme.palette.saleor.main[1],
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      margin: theme.spacing(2),
      padding: 0,

      "&:hover": {
        color: theme.palette.saleor.active[1],
      },
      "&:first-child": {
        marginRight: 0,
      },
    },
  }),
  { name: "MediaTile" },
);

interface MediaTileBaseProps {
  media: {
    alt: string;
    url: string;
    type?: string;
    oembedData?: string;
  };
  loading?: boolean;
  onDelete?: () => void;
  onEdit?: (event: React.ChangeEvent<any>) => void;
}

export type MediaTileProps = MediaTileBaseProps &
  (
    | {
        onEdit?: React.MouseEventHandler<HTMLButtonElement>;
        editHref?: never;
      }
    | {
        onEdit?: never;
        editHref?: string;
      }
  );

const MediaTile: React.FC<MediaTileProps> = props => {
  const { loading, onDelete, onEdit, editHref, media } = props;
  const classes = useStyles(props);
  const parsedMediaOembedData = media?.oembedData
    ? JSON.parse(media.oembedData)
    : null;
  const mediaUrl = parsedMediaOembedData?.thumbnail_url || media.url;

  return (
    <div className={classes.mediaContainer} data-test-id="product-image">
      <div
        className={classNames(classes.mediaOverlay, {
          [classes.mediaOverlayShadow]: loading,
        })}
      >
        {loading ? (
          <CircularProgress size={32} />
        ) : (
          <div className={classes.mediaOverlayToolbar}>
            {(onEdit || editHref) && (
              <IconButton
                href={editHref}
                hoverOutline={false}
                variant="secondary"
                className={classes.controlButton}
                onClick={onEdit}
              >
                <EditIcon />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                variant="secondary"
                hoverOutline={false}
                className={classes.controlButton}
                onClick={onDelete}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        )}
      </div>
      <img className={classes.media} src={mediaUrl} alt={media.alt} />
    </div>
  );
};
MediaTile.displayName = "MediaTile";
export default MediaTile;
