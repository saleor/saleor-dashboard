import { IconButton } from "@dashboard/components/IconButton";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@macaw-ui";
import clsx from "clsx";
import { Pencil, Trash2 } from "lucide-react";
import type * as React from "react";

import { SaleorThrobber } from "../Throbber";

// @ts-expect-error - vanilla-extract vars type incompatible with MUI makeStyles
const useStyles = makeStyles(() => ({
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
    background: vars.colors.background.default1,
    border: `1px solid ${vars.colors.border.default1}`,
    borderRadius: vars.borderRadius[1],
    height: 148,
    overflow: "hidden",
    padding: vars.spacing[1],
    position: "relative",
    width: 148,
  },
  mediaOverlay: {
    background: vars.colors.background.default1,
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
    color: vars.colors.buttonDefaultPrimary,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    margin: vars.spacing[0.5],
    padding: 0,
    "&:hover": {
      color: vars.colors.buttonDefaultPrimaryHovered,
    },
    "&:first-child": {
      marginRight: 0,
    },
  },
}), { name: "MediaTile" });

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
                <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                variant="secondary"
                hoverOutline={false}
                className={classes.controlButton}
                onClick={onDelete}
              >
                <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
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
