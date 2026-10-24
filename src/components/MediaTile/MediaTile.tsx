import { IconButton } from "@dashboard/components/IconButton/IconButton";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { MediaWithFallback } from "@dashboard/components/MediaWithFallback/MediaWithFallback";
import { parseOembedData } from "@dashboard/products/utils/parseOembedData";
import { makeStyles } from "@saleor/macaw-ui";
import { Checkbox, vars } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Pencil, Trash2 } from "lucide-react";
import type * as React from "react";

import { SaleorThrobber } from "../Throbber/SaleorThrobber";

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
        "& $mediaOverlayToolbar": {
          display: "flex",
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
      opacity: 0.35,
      cursor: "move",
      display: "none",
      inset: 0,
      position: "absolute",
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
    tileControls: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      left: theme.spacing(2),
      pointerEvents: "none",
      position: "absolute",
      right: theme.spacing(2),
      top: theme.spacing(2),
      zIndex: 2,
    },
    mediaOverlayToolbar: {
      display: "none",
      gap: vars.spacing[1],
      marginLeft: "auto",
      pointerEvents: "auto",
    },
    selectionCheckbox: {
      borderRadius: theme.spacing(0.5),
      opacity: 0,
      pointerEvents: "none",
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shorter,
      }),
      // Unchecked uses the theme surface, which disappears on a dark photo.
      "& button[data-state='unchecked'], & button[data-state='unchecked']:hover, & button[data-state='unchecked']:active, & button[data-state='unchecked']:focus-visible":
        {
          backgroundColor: "#fff",
          borderColor: "rgba(0, 0, 0, 0.55)",
        },
      "& button[data-state='unchecked']:hover:after, & button[data-state='unchecked']:active:after, & button[data-state='unchecked']:focus-visible:after":
        {
          backgroundColor: "transparent",
        },
    },
    selectionCheckboxVisible: {
      opacity: 1,
      pointerEvents: "auto",
    },
    controlButton: {
      color: theme.palette.saleor.main[1],
      backgroundColor: `color-mix(in srgb, ${theme.palette.background.paper} 72%, transparent)`,
      border: "none",
      borderRadius: theme.spacing(0.5),
      cursor: "pointer",
      margin: 0,
      padding: theme.spacing(0.5),

      "&:hover": {
        color: theme.palette.saleor.active[1],
        backgroundColor: theme.palette.background.paper,
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
      {(onSelectionChange || onEdit || editHref || onDelete) && !loading ? (
        <div className={classes.tileControls}>
          {onSelectionChange ? (
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
          {!disableOverlay && (onEdit || editHref || onDelete) ? (
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
          ) : null}
        </div>
      ) : null}
      <div
        className={clsx(classes.mediaOverlay, {
          [classes.mediaOverlayLoading]: loading,
          [classes.disableOverlay]: disableOverlay,
        })}
      >
        {loading ? <SaleorThrobber size={32} data-test-id="media-tile-loading" /> : null}
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
