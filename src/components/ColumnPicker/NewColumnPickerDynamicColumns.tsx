import { Box, Button, PlusIcon, Text, Toggle } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AvailableColumn } from "../Datagrid/types";
import messages from "./messages";

export interface NewColumnPickerDynamicColumnsProps {
  dynamicColumns: AvailableColumn[];
  setExpanded: (value: React.SetStateAction<boolean>) => void;
  handleToggle: (id: string) => void;
  selectedColumns: string[];
}

export const NewColumnPickerDynamicColumns: React.FC<
  NewColumnPickerDynamicColumnsProps
> = ({ dynamicColumns, setExpanded, handleToggle, selectedColumns }) => (
  <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      marginTop={6}
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
      <Box padding={3} key={column.id}>
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
