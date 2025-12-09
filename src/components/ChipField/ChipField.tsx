import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, BoxProps, Button, Text } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";
import { forwardRef, ReactNode } from "react";
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

type ChipFieldProps = {
  label: ReactNode;
  onClose?: () => void;
  loading?: boolean;
  url?: string;
} & BoxProps;

export const ChipField = forwardRef<HTMLDivElement, ChipFieldProps>(
  ({ label, onClose, loading, url, className, style, ...props }, ref) => {
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
        borderColor={"default1"}
        borderRadius={4}
        paddingY={1}
        paddingX={1.5}
        paddingRight={1}
        backgroundColor={"default1"}
        opacity={"1"}
        {...props}
      >
        <Box display="flex" alignItems="center" paddingLeft={2}>
          <ChipLabel label={label} url={url} />
          <Box marginLeft={1}>
            <Button
              variant="tertiary"
              size="small"
              onClick={handleClose}
              data-test-id="button-close"
              disabled={loading}
              type="button"
              icon={<X size={iconSize.small} strokeWidth={iconStrokeWidth} />}
            />
          </Box>
        </Box>
      </Box>
    );
  },
);
ChipField.displayName = "ChipField";
