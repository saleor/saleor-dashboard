import {
  Box,
  Button,
  PlusIcon,
  Popover,
  TableEditIcon,
  Text,
  Toggle,
} from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { AvailableColumn } from "../Datagrid/types";
import messages from "./messages";
import { NewColumnPickerCategories } from "./NewColumnPickerCategories";
import { ColumnCategory } from "./useColumns";
import { filterEmptyColumn } from "./utils";

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
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (id: string) =>
    selectedColumns.includes(id)
      ? onSave(selectedColumns.filter(currentId => currentId !== id))
      : onSave([...selectedColumns, id]);

  return (
    <Popover>
      <Popover.Trigger>
        <Button variant="tertiary" icon={<TableEditIcon />} />
      </Popover.Trigger>
      <Popover.Content sideOffset={4}>
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
          <Box __width="320px" backgroundColor="plain" padding={7}>
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
                >
                  <Text variant="body" size="small" color="textNeutralDefault">
                    {column.title}
                  </Text>
                </Toggle>
              </Box>
            ))}
            {columnCategories && (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  marginTop={6}
                >
                  <Text
                    variant="caption"
                    size="small"
                    color="textNeutralSubdued"
                  >
                    <FormattedMessage {...messages.custom} />
                  </Text>
                  <Button
                    variant="secondary"
                    size="small"
                    icon={<PlusIcon size="small" />}
                    onClick={() => setExpanded(true)}
                  />
                </Box>
                {dynamicColumns.map(column => (
                  <Box padding={3} key={column.id}>
                    <Toggle
                      onPressedChange={() => handleToggle(column.id)}
                      pressed={selectedColumns.includes(column.id)}
                    >
                      <Text
                        variant="body"
                        size="small"
                        color="textNeutralSubdued"
                      >
                        {`${column.metaGroup} /`}
                      </Text>
                      <Text
                        variant="body"
                        size="small"
                        color="textNeutralDefault"
                      >
                        {column.title}
                      </Text>
                    </Toggle>
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
