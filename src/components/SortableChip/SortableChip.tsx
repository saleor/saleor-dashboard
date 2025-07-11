import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, CloseIcon, GripIcon, Text } from "@saleor/macaw-ui-next";
import React, { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

export interface SortableChipProps {
  id: string;
  className?: string;
  label: ReactNode;
  onClose?: () => void;
  loading?: boolean;
  url?: string;
}

const ChipLabel = ({ url, label }: { url?: string; label: ReactNode }) => {
  const labelContent = (
    <Text data-test-id="chip-label" color={url ? "info1" : undefined}>
      {label}
    </Text>
  );

  if (url) {
    return <Link to={url}>{labelContent}</Link>;
  }

  return labelContent;
};

const SortableChip: React.FC<SortableChipProps> = ({
  id,
  className,
  label,
  onClose,
  loading,
  url,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (onClose) {
      onClose();
    }
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      as="div"
      className={className}
      borderWidth={1}
      borderStyle="solid"
      borderColor={isDragging ? "transparent" : "default1"}
      borderRadius={4}
      display="inline-block"
      paddingY={1}
      paddingX={1.5}
      paddingRight={1}
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
            className={className}
            color="default2"
            size="small"
            data-test-id="button-drag-handle"
            tabIndex={0}
            // @ts-expect-error - style is not a valid prop for GripIcon
            style={{ cursor: "grab", outline: "none" }}
            {...attributes}
            {...listeners}
          />
        </Box>
        <ChipLabel label={label} url={url} />
        {onClose && (
          <Box marginLeft={1}>
            <Button
              variant="tertiary"
              size="small"
              onClick={handleClose}
              data-test-id="button-close"
              disabled={loading}
              type="button"
              icon={<CloseIcon size="small" />}
            ></Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

SortableChip.displayName = "SortableChip";
export default SortableChip;
