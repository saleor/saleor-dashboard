import { Box, Button, PlusIcon, RemoveIcon, Text } from "@saleor/macaw-ui/next";
import React from "react";
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
        data-test-id="open-dynamic-search"
      />
    </Box>
    {dynamicColumns?.map(column => (
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        padding={1}
        key={column.id}
      >
        <Button
          onClick={() => onToggle(column.id)}
          data-test-id={`remove-dynamic-col-button-${column.title}`}
          variant="tertiary"
          size="small"
          icon={<RemoveIcon color="iconNeutralPlain" />}
          __width="20px"
          __height="20px"
        />
        <Text
          variant="body"
          size="small"
          color="textNeutralSubdued"
          whiteSpace="nowrap"
        >
          {`${column.metaGroup} /`}
        </Text>
        <Text
          variant="body"
          size="small"
          color="textNeutralDefault"
          ellipsis
          data-test-id={`column-name-${column.title}`}
        >
          {column.title}
        </Text>
      </Box>
    ))}
  </Box>
);
