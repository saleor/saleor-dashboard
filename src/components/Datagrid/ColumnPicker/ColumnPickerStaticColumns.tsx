import { Box, Text, Toggle } from "@saleor/macaw-ui-next";
import React from "react";

import { AvailableColumn } from "../types";
import { filterEmptyColumn, isLastEnabledColumn } from "./utils";

export interface ColumnPickerStaticColumnsProps {
  staticColumns: AvailableColumn[];
  handleToggle: (id: string) => void;
  selectedColumns: string[];
}

export const ColumnPickerStaticColumns = ({
  staticColumns,
  handleToggle,
  selectedColumns,
}: ColumnPickerStaticColumnsProps) => (
  <Box data-test-id="static-col-container">
    {staticColumns.filter(filterEmptyColumn).map(column => (
      <Box padding={1} key={column.id}>
        <Toggle
          data-test-id={`stat-col-${column.id}`}
          onPressedChange={() => handleToggle(column.id)}
          pressed={selectedColumns.includes(column.id)}
          // One static column must always be enabled
          disabled={isLastEnabledColumn(column.id, staticColumns, selectedColumns)}
        >
          <Text size={3} color="default1">
            {column.title}
          </Text>
        </Toggle>
      </Box>
    ))}
  </Box>
);
