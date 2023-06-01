import { Box, Text, Toggle } from "@saleor/macaw-ui/next";
import React from "react";

import { filterEmptyColumn, isLastEnabledColumn } from "./utils";

export const ColumnPickerStaticColumns = ({
  staticColumns,
  handleToggle,
  selectedColumns,
}) =>
  staticColumns.filter(filterEmptyColumn).map(column => (
    <Box padding={3} key={column.id}>
      <Toggle
        onPressedChange={() => handleToggle(column.id)}
        pressed={selectedColumns.includes(column.id)}
        // One static column must always be enabled
        disabled={isLastEnabledColumn(
          column.id,
          staticColumns,
          selectedColumns,
        )}
      >
        <Text variant="body" size="small" color="textNeutralDefault">
          {column.title}
        </Text>
      </Toggle>
    </Box>
  ));
