import { IconButton } from "@dashboard/components/IconButton";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { MediaWithFallback } from "@dashboard/components/MediaWithFallback/MediaWithFallback";
import { parseOembedData } from "@dashboard/products/utils/parseOembedData";
import { makeStyles } from "@saleor/macaw-ui";
import { Checkbox, vars } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Pencil, Trash2 } from "lucide-react";
import type * as React from "react";

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
        "& $selectionCheckbox": {
          opacity: 1,
          pointerEvents: "auto",
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
    mediaContainerSelected: {
      borderColor: theme.palette.saleor.active[1],
      boxShadow: `0 0 0 1px ${theme.palette.saleor.active[1]}`,
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
    mediaOverlayLoading: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
    },
    mediaOverlayToolbar: {
      display: "flex",
      justifyContent: "flex-end",
    },
    selectionCheckbox: {
      position: "absolute",
      top: theme.spacing(2),
      left: theme.spacing(2),
      zIndex: 2,
      background: theme.palette.background.paper,
      borderRadius: theme.spacing(0.5),
      opacity: 0,
      pointerEvents: "none",
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shorter,
      }),
    },
    selectionCheckboxVisible: {
      opacity: 1,
      pointerEvents: "auto",
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
  selected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  placeholderSrc?: string | null;
  onPlaceholderUnused?: () => void;
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
  const {
    loading,
    onDelete,
    onEdit,
    editHref,
    media,
    disableOverlay = false,
    placeholderSrc,
    onPlaceholderUnused,
    selected = false,
    onSelectionChange,
  } = props;
  const classes = useStyles(props);
  const mediaUrl = parseOembedData(media.oembedData).thumbnail_url || media.url;

  return (
    <div
      className={clsx(classes.mediaContainer, {
        [classes.mediaContainerSelected]: selected,
      })}
      data-test-id="product-image"
      data-test-selected={selected ? "true" : "false"}
    >
      {onSelectionChange && !loading ? (
        <div
          className={clsx(classes.selectionCheckbox, {
            [classes.selectionCheckboxVisible]: selected,
          })}
          onClick={event => event.stopPropagation()}
          onMouseDown={event => event.stopPropagation()}
          data-test-id="product-media-select"
        >
          <Checkbox
            checked={selected}
            onCheckedChange={checked => onSelectionChange(checked === true)}
            tabIndex={-1}
          />
        </div>
      ) : null}
      <div
        className={clsx(classes.mediaOverlay, {
          [classes.mediaOverlayLoading]: loading,
          [classes.disableOverlay]: disableOverlay,
        })}
      >
        {loading ? (
          <SaleorThrobber size={32} data-test-id="media-tile-loading" />
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
      <MediaWithFallback
        key={mediaUrl}
        className={classes.media}
        src={mediaUrl}
        alt={media.alt}
        placeholderSrc={placeholderSrc}
        onPlaceholderUnused={onPlaceholderUnused}
      />
    </div>
  );
};

MediaTile.displayName = "MediaTile";
export default MediaTile;
