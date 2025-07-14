import { Box, Button, CloseIcon, GripIcon, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

import { SortableChipProps } from "../SortableChip/SortableChip";

const ChipLabel = ({ url, label }: { url?: string; label: ReactNode }) => {
  const labelContent = (
    <Text textDecoration={url ? { hover: "underline" } : undefined}>{label}</Text>
  );

  if (url) {
    return <Link to={url}>{labelContent}</Link>;
  }

  return labelContent;
};

export interface DraggableChipProps extends Omit<SortableChipProps, "id"> {
  isDragging?: boolean;
  style?: React.CSSProperties;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  listeners?: React.HTMLAttributes<HTMLDivElement>;
}

export const DraggableChip = React.forwardRef<HTMLDivElement, DraggableChipProps>(
  ({ label, onClose, loading, url, isDragging, className, style, attributes, listeners }, ref) => {
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (onClose) {
        onClose();
      }
    };
    const borderColor: "transparent" | "default1" = isDragging ? "transparent" : "default1";

    return (
      <Box
        ref={ref}
        style={style}
        as="div"
        className={className}
        borderWidth={1}
        borderStyle="solid"
        borderColor={borderColor}
        borderRadius={4}
        paddingY={1}
        paddingX={1.5}
        paddingRight={1}
        // backgroundColor="default1"
        backgroundColor={isDragging ? "default3" : "default1"}
        opacity={isDragging ? "0.2" : "1"}
      >
        <Box
          display="flex"
          alignItems="center"
          style={{ visibility: isDragging ? "hidden" : "visible" }}
        >
          <Box
            display="flex"
            alignItems="center"
            __cursor={loading ? "not-allowed" : "grab"}
            marginRight={1}
          >
            <GripIcon
              color="default2"
              size="small"
              data-test-id="button-drag-handle"
              style={{ cursor: "grab", outline: "none" }}
              {...attributes}
              {...listeners}
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
              icon={<CloseIcon size="small" />}
            />
          </Box>
        </Box>
      </Box>
    );
  },
);
DraggableChip.displayName = "DraggableChip";
