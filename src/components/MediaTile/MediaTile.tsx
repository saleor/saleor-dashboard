import { IconButton } from "@dashboard/components/IconButton";
import { DeleteIcon, EditIcon, makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";

import { SaleorThrobber } from "../Throbber";

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
      padding: vars.spacing[1],
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
    disableOverlay: {
      "&$mediaOverlay": {
        display: "none !important",
      },
    },
    mediaOverlayShadow: {
      $mediaOverlay: {
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
    alt: string | null;
    url: string;
    type?: string;
    oembedData?: string;
  };
  disableOverlay?: boolean;
  loading?: boolean;
  onDelete?: () => void;
  onEdit?: (event: React.ChangeEvent<any>) => void;
}

type MediaTileProps = MediaTileBaseProps &
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

const MediaTile = (props: MediaTileProps) => {
  const { loading, onDelete, onEdit, editHref, media, disableOverlay = false } = props;
  const classes = useStyles(props);
  const parsedMediaOembedData = media?.oembedData ? JSON.parse(media.oembedData) : null;
  const mediaUrl = parsedMediaOembedData?.thumbnail_url || media.url;

  return (
    <div className={classes.mediaContainer} data-test-id="product-image">
      <div
        className={clsx(classes.mediaOverlay, {
          [classes.mediaOverlayShadow]: loading,
          [classes.disableOverlay]: disableOverlay,
        })}
      >
        {loading ? (
          <SaleorThrobber size={32} />
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
                <EditIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                variant="secondary"
                hoverOutline={false}
                className={classes.controlButton}
                onClick={onDelete}
              >
                <DeleteIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              </IconButton>
            )}
          </div>
        )}
      </div>
      <img className={classes.media} src={mediaUrl} alt={media.alt!} />
    </div>
  );
};

MediaTile.displayName = "MediaTile";
export default MediaTile;
