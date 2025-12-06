import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, BoxProps, Button, Text } from "@saleor/macaw-ui-next";
import { GripVertical, X } from "lucide-react";
import { ReactNode } from "react";
import * as React from "react";
import { Link } from "react-router-dom";

const ChipLabel = ({ url, label }: { url?: string; label: ReactNode }) => {
  const labelContent = (
    <Text textDecoration={url ? { hover: "underline" } : undefined}>{label}</Text>
  );

  if (url) {
    return <Link to={url}>{labelContent}</Link>;
  }

  return labelContent;
};

type SortableChipProps = {
  label: ReactNode;
  onClose?: () => void;
  loading?: boolean;
  url?: string;
  /** Indicates that element is held by user and is dragged around screen */
  isDragged?: boolean;
  /** Indicates that element is being rendered as "overlay":
   * preview of list state after user stops dragging */
  isDraggedOverlay?: boolean;
} & BoxProps;

/** Chip which can be used within a list of sortable elements, should be used with
 * Draggable component which returns correct handlers from @dnd-kit */
export const SortableChip = React.forwardRef<HTMLDivElement, SortableChipProps>(
  (
    { label, onClose, loading, url, isDragged, isDraggedOverlay, className, style, ...props },
    ref,
  ) => {
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (onClose) {
        onClose();
      }
    };

    return (
      <Box
        ref={ref}
        style={style}
        as="div"
        className={className}
        borderWidth={1}
        borderStyle="solid"
        borderColor={isDraggedOverlay ? "transparent" : "default1"}
        borderRadius={4}
        paddingY={1}
        paddingX={1.5}
        paddingRight={1}
        backgroundColor={isDraggedOverlay ? "default3" : "default1"}
        opacity={isDraggedOverlay ? "0.2" : "1"}
        {...props}
      >
        <Box
          display="flex"
          alignItems="center"
          style={{ visibility: isDraggedOverlay ? "hidden" : "visible" }}
        >
          <Box
            display="flex"
            alignItems="center"
            __cursor={loading ? "not-allowed" : "grab"}
            marginRight={1}
          >
            <GripVertical
              size={iconSize.small}
              strokeWidth={iconStrokeWidthBySize.small}
              data-test-id="button-drag-handle"
              style={{ cursor: isDragged ? "grabbing" : "grab", outline: "none" }}
            />
          </Box>
          <ChipLabel label={label} url={url} />
          <Box marginLeft={1}>
            <Button
              variant="tertiary"
              size="small"
              onClick={handleClose}
              data-test-id="button-close"
              disabled={loading}
              type="button"
              icon={<X size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
            />
          </Box>
        </Box>
      </Box>
    );
  },
);
SortableChip.displayName = "SortableChip";
