import { Box, Button, PlusIcon, RemoveIcon, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { AvailableColumn } from "../types";
import messages from "./messages";

export interface ColumnPickerDynamicColumnsProps {
  dynamicColumns?: AvailableColumn[] | null | undefined;
  setExpanded: (value: React.SetStateAction<boolean>) => void;
  onToggle: (id: string) => void;
}

export const ColumnPickerDynamicColumns = ({
  dynamicColumns,
  setExpanded,
  onToggle,
}: ColumnPickerDynamicColumnsProps) => (
  <Box data-test-id="dynamic-col-container">
    <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={3}>
      <Text size={1} color="default2">
        <FormattedMessage {...messages.custom} />
      </Text>
      <Button
        variant="secondary"
        size="small"
        icon={<PlusIcon size="small" />}
        onClick={() => setExpanded(true)}
        data-test-id="open-dynamic-search"
      />
    </Box>
    {dynamicColumns
      ?.filter(column => !!column.metaGroup)
      .map(column => (
        <Box display="flex" alignItems="center" gap={2} padding={1} key={column.id}>
          <Button
            onClick={() => onToggle(column.id)}
            data-test-id={`remove-dynamic-col-button-${column.title}`}
            variant="tertiary"
            size="small"
            icon={<RemoveIcon color="default1" />}
            __width="20px"
            __height="20px"
          />
          <Text size={3} color="default2" whiteSpace="nowrap">
            {`${column.metaGroup} /`}
          </Text>
          <Text size={3} color="default1" ellipsis data-test-id={`column-name-${column.title}`}>
            {column.pickerTitle ?? column.title}
          </Text>
        </Box>
      ))}
  </Box>
);
