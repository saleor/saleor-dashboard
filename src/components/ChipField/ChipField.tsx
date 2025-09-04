import { Box, BoxProps, Button, CloseIcon, GripIcon, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
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

export type ChipFieldProps = {
  label: ReactNode;
  onClose?: () => void;
  loading?: boolean;
  url?: string;
} & BoxProps;

export const ChipField = React.forwardRef<HTMLDivElement, ChipFieldProps>(
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
          paddingLeft={2}
        >
          <ChipLabel label={label} url={url}/>
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
ChipField.displayName = "ChipField";
export default ChipField;
