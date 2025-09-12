import { Box, BoxProps, Button, CloseIcon, Text } from "@saleor/macaw-ui-next";
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

export type SingleReferenceChipProps = {
  label: ReactNode;
  onClear?: () => void;
  loading?: boolean;
  url?: string;
} & BoxProps;

export const SingleReferenceChip = React.forwardRef<HTMLDivElement, SingleReferenceChipProps>(
  ({ label, onClear, loading, url, className, style, ...props }, ref) => {
    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (onClear) {
        onClear();
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
        borderColor="default1"
        borderRadius={4}
        paddingY={1}
        paddingX={1.5}
        paddingRight={1}
        backgroundColor="default1"
        display="inline-flex"
        alignItems="center"
        {...props}
      >
        <ChipLabel label={label} url={url} />
        {onClear && (
          <Box marginLeft={1}>
            <Button
              variant="tertiary"
              size="small"
              onClick={handleClear}
              data-test-id="button-clear"
              disabled={loading}
              type="button"
              icon={<CloseIcon size="small" />}
            />
          </Box>
        )}
      </Box>
    );
  },
);
SingleReferenceChip.displayName = "SingleReferenceChip";