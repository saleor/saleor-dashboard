import { Box, Text } from "@saleor/macaw-ui-next";

import { ErrorLookup } from "./errors";

interface FilterErrorsProps {
  error: ErrorLookup[number];
  isAttribute: boolean;
  hasLabel: boolean;
}

export const FilterErrors = ({ error, isAttribute, hasLabel }: FilterErrorsProps) => {
  const hasErrorText = error.left.text || error.condition.text || error.right.text;

  if (!hasErrorText) {
    return null;
  }

  return (
    <>
      {/* Empty cell for label column */}
      {hasLabel && <Box />}

      {/* Error for left operator */}
      <Box paddingLeft={2} paddingTop={0.5}>
        {error.left.text && (
          <Text size={2} color="critical1">
            {error.left.text}
          </Text>
        )}
      </Box>

      {/* Empty cell for attribute column if present */}
      {isAttribute && <Box />}

      {/* Error for condition */}
      <Box paddingLeft={2} paddingTop={0.5}>
        {error.condition.text && (
          <Text size={2} color="critical1">
            {error.condition.text}
          </Text>
        )}
      </Box>

      {/* Error for right operator */}
      <Box paddingLeft={2} paddingTop={0.5}>
        {error.right.text && (
          <Text size={2} color="critical1">
            {error.right.text}
          </Text>
        )}
      </Box>

      {/* Empty cell for remove button column */}
      <Box />
    </>
  );
};
