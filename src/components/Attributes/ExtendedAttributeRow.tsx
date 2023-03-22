import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";

interface ExtendedAttributeRowProps {
  label: string;
  selectLabel: string;
  disabled: boolean;
  onSelect: () => void;
}

const ExtendedAttributeRow: React.FC<ExtendedAttributeRowProps> = props => {
  const { label, selectLabel, disabled, onSelect, children } = props;

  return (
    <>
      <Box
        as="li"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingY={3}
      >
        <Text data-test-id="attribute-label">{label}</Text>
        <Button
          disabled={disabled}
          variant="secondary"
          data-test-id="button-attribute-selector"
          onClick={onSelect}
          type="button"
        >
          {selectLabel}
        </Button>
      </Box>
      <Box data-test-id="attribute-value">{children}</Box>
    </>
  );
};

ExtendedAttributeRow.displayName = "ExtendedAttributeRow";
export default ExtendedAttributeRow;
