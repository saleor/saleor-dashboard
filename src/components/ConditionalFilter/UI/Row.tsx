import { Box, Text } from "@saleor/macaw-ui-next";

import { ErrorLookup } from "./errors";
import { FilterEventEmitter } from "./EventEmitter";
import { FilterErrors } from "./FilterErrors";
import { FilterInputs } from "./FilterInputs";
import { ExperimentalFiltersProps } from "./Root";
import { Row } from "./types";

interface RowProps {
  item: Row;
  index: number;
  leftOptions: ExperimentalFiltersProps["leftOptions"];
  emitter: FilterEventEmitter;
  error: ErrorLookup[number];
  label: string;
}

/**
 * FilterRow - Main wrapper component for a filter row
 *
 * Structure:
 * - Grid with 2 rows:
 *   - Row 1: Label (where / and) + Input fields
 *   - Row 2: Empty label cell + Error messages (conditionally rendered)
 */
export const RowComponent = ({ item, index, leftOptions, emitter, error, label }: RowProps) => {
  const isAttribute = item.isAttribute;
  const hasErrorText = error.left.text || error.condition.text || error.right.text;

  // Define grid columns: label + input columns
  const gridColumns = isAttribute
    ? "60px 200px 200px 120px 200px 1fr" // label + attribute columns
    : "60px 200px 120px 200px 1fr"; // label + no attribute

  return (
    <Box
      display="grid"
      columnGap={0.5}
      rowGap={0.5}
      __gridTemplateColumns={gridColumns}
      __gridTemplateRows={hasErrorText ? "auto auto" : "auto"}
      placeItems="flex-start"
      alignItems="center"
    >
      {/* Row 1: Label (Where/And) - spans only first row */}
      <Text __gridRow="1" alignSelf="center">
        {label}
      </Text>

      {/* Row 1: Input fields */}
      <FilterInputs
        item={item}
        index={index}
        leftOptions={leftOptions}
        emitter={emitter}
        error={error}
      />

      {/* Row 2: Error messages (conditionally rendered) */}
      <FilterErrors error={error} isAttribute={isAttribute} hasLabel />
    </Box>
  );
};
