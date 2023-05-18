import {
  Box,
  Button,
  Popover,
  sprinkles,
  TableEditIcon,
  Text,
  Toggle,
  vars,
} from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { AvailableColumn } from "../Datagrid/types";
import messages from "./messages";
import { NewColumnPickerCategories } from "./NewColumnPickerCategories";
import { NewColumnPickerDynamicColumns } from "./NewColumnPickerDynamicColumns";
import { ColumnCategory } from "./useColumns";
import { filterEmptyColumn, isLastEnabledColumn } from "./utils";

export interface NewColumnPickerProps {
  staticColumns: AvailableColumn[];
  dynamicColumns?: AvailableColumn[];
  selectedColumns: string[];
  columnCategories?: ColumnCategory[];
  columnPickerSettings: string[];
  onSave: (columns: string[]) => void;
  onDynamicColumnSelect: (columns: string[]) => void;
}

export const NewColumnPicker: React.FC<NewColumnPickerProps> = ({
  staticColumns,
  selectedColumns,
  columnCategories,
  dynamicColumns,
  columnPickerSettings,
  onDynamicColumnSelect,
  onSave,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (id: string) =>
    selectedColumns.includes(id)
      ? onSave(selectedColumns.filter(currentId => currentId !== id))
      : onSave([...selectedColumns, id]);

  return (
    <Popover
      open={pickerOpen}
      onOpenChange={() => {
        setExpanded(false);
        setPickerOpen(!pickerOpen);
      }}
    >
      <Popover.Trigger>
        <Button
          variant="tertiary"
          icon={<TableEditIcon />}
          __backgroundColor={
            pickerOpen
              ? vars.colors.background.interactiveNeutralSecondaryPressing
              : undefined
          }
          __borderColor={
            pickerOpen ? vars.colors.border.neutralSubdued : undefined
          }
        />
      </Popover.Trigger>
      <Popover.Content className={sprinkles({ margin: 4 })}>
        <Box
          display="grid"
          gridTemplateColumns={expanded ? 2 : 1}
          overflow="hidden"
        >
          {expanded && (
            <NewColumnPickerCategories
              columnCategories={columnCategories}
              columnPickerSettings={columnPickerSettings}
              onDynamicColumnSelect={onDynamicColumnSelect}
              onClose={() => setExpanded(false)}
            />
          )}
          <Box __minWidth="320px" backgroundColor="plain" padding={7}>
            <Box marginBottom={6}>
              <Text variant="caption" size="small" color="textNeutralSubdued">
                <FormattedMessage {...messages.column} />
              </Text>
            </Box>

            {staticColumns.filter(filterEmptyColumn).map(column => (
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
            ))}
            {columnCategories && (
              <NewColumnPickerDynamicColumns
                dynamicColumns={dynamicColumns}
                selectedColumns={selectedColumns}
                setExpanded={setExpanded}
                handleToggle={handleToggle}
              />
            )}
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
