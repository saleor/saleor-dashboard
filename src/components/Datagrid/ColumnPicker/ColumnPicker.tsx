import {
  Box,
  Button,
  Popover,
  PopoverContentProps,
  sprinkles,
  TableEditIcon,
  Text,
  vars,
} from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { AvailableColumn } from "../types";
import { ColumnPickerCategories } from "./ColumnPickerCategories";
import { ColumnPickerDynamicColumns } from "./ColumnPickerDynamicColumns";
import { ColumnPickerStaticColumns } from "./ColumnPickerStaticColumns";
import messages from "./messages";
import { ColumnCategory } from "./useColumns";

export interface ColumnPickerProps {
  staticColumns: AvailableColumn[];
  dynamicColumns?: AvailableColumn[] | null | undefined;
  selectedColumns: string[];
  columnCategories?: ColumnCategory[];
  onToggle: (columnId: string) => void;
  side?: PopoverContentProps["side"];
  align?: PopoverContentProps["align"];
}

export const ColumnPicker = ({
  staticColumns,
  selectedColumns,
  columnCategories,
  dynamicColumns,
  onToggle,
  side,
  align,
}: ColumnPickerProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <Popover
      modal
      open={pickerOpen}
      onOpenChange={() => {
        setExpanded(false);
        setPickerOpen(isPickerOpen => !isPickerOpen);
      }}
    >
      <Popover.Trigger>
        <Button
          data-test-id="open-column-picker-button"
          variant="tertiary"
          icon={<TableEditIcon />}
          pointerEvents={pickerOpen ? "none" : undefined}
          __backgroundColor={
            pickerOpen ? vars.colors.background.default1Pressed : undefined
          }
          __borderColor={pickerOpen ? vars.colors.border.default2 : undefined}
        />
      </Popover.Trigger>
      <Popover.Content
        className={sprinkles({ margin: 1.5 })}
        align={align}
        side={side}
      >
        <Box
          display="grid"
          gridTemplateColumns={expanded ? 2 : 1}
          overflow="hidden"
        >
          {expanded && columnCategories && (
            <ColumnPickerCategories
              columnCategories={columnCategories}
              selectedColumns={selectedColumns}
              onToggle={onToggle}
              onClose={() => setExpanded(false)}
            />
          )}
          <Box
            __width="320px"
            __maxHeight="50vh"
            __minHeight={expanded ? "502px" : undefined}
            backgroundColor="default1"
            padding={4}
            overflow="scroll"
          >
            <Box marginBottom={3}>
              <Text typeSize={1} color="default2">
                <FormattedMessage {...messages.column} />
              </Text>
            </Box>
            <ColumnPickerStaticColumns
              staticColumns={staticColumns}
              handleToggle={onToggle}
              selectedColumns={selectedColumns}
            />
            {columnCategories && (
              <ColumnPickerDynamicColumns
                dynamicColumns={dynamicColumns}
                setExpanded={setExpanded}
                onToggle={onToggle}
              />
            )}
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
