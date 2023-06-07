import { Box, Button, PlusIcon, Text, Toggle } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AvailableColumn } from "../types";
import messages from "./messages";

export interface ColumnPickerDynamicColumnsProps {
  dynamicColumns: AvailableColumn[];
  setExpanded: (value: React.SetStateAction<boolean>) => void;
  handleToggle: (id: string) => void;
  selectedColumns: string[];
}

export const ColumnPickerDynamicColumns = ({
  dynamicColumns,
  setExpanded,
  handleToggle,
  selectedColumns,
}: ColumnPickerDynamicColumnsProps) => (
  <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      marginTop={3}
    >
      <Text variant="caption" size="small" color="textNeutralSubdued">
        <FormattedMessage {...messages.custom} />
      </Text>
      <Button
        variant="secondary"
        size="small"
        icon={<PlusIcon size="small" />}
        onClick={() => setExpanded(true)}
      />
    </Box>
    {dynamicColumns?.map(column => (
      <Box padding={1} key={column.id}>
        <Toggle
          onPressedChange={() => handleToggle(column.id)}
          pressed={selectedColumns.includes(column.id)}
        >
          <Text variant="body" size="small" color="textNeutralSubdued">
            {`${column.metaGroup} /`}
          </Text>
          <Text variant="body" size="small" color="textNeutralDefault">
            {column.title}
          </Text>
        </Toggle>
      </Box>
    ))}
  </>
);
