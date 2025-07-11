import { Box, Button, CloseIcon, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";

import SortableHandle from "./SortableHandle";

export interface SortableChipProps extends SortableElementProps {
  className?: string;
  label: ReactNode;
  onClose?: () => void;
  loading?: boolean;
  url?: string;
}

const ChipLabel = ({ url, label }: { url?: string; label: ReactNode }) => {
  const labelContent = (
    <Text
      data-test-id="chip-label"
      color={url ? "info1" : undefined}
    >
      {label}
    </Text>
  );

  if (url) {
    return <Link to={url}>{labelContent}</Link>;
  }

  return labelContent;
};

const SortableChip = SortableElement(
  ({ className, label, onClose, loading, url }: SortableChipProps) => {
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (onClose) {
        onClose();
      }
    };

    return (
      <Box
        as="div"
        className={className}
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        borderRadius={4}
        display="inline-block"
        paddingY={1}
        paddingX={1.5}
        paddingRight={1}
        backgroundColor="default1"
      >
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            alignItems="baseline"
            __cursor={loading ? "not-allowed" : undefined}
            marginRight={1}
          >
            <SortableHandle data-test-id="button-drag-handle" />
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
  },
);

SortableChip.displayName = "SortableChip";
export default SortableChip;
