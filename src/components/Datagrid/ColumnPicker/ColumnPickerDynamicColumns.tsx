import { Box, Button, PlusIcon, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AvailableColumn } from "../types";
import messages from "./messages";

export interface ColumnPickerDynamicColumnsProps {
  dynamicColumns: AvailableColumn[] | undefined;
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
          data-test-id={`dynamic-col-${column.id}`}
          variant="secondary"
          size="small"
          // hacky for now, this icon should probably come from macaw
          // although it's 8x8
          icon={
            <svg
              viewBox="0 0 8 2"
              width="8"
              height="2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1C8 1.55228 7.55228 2 7 2H1C0.447715 2 0 1.55228 0 1Z"
                fill="currentColor"
              />
            </svg>
          }
          // hacky again, because macaw button classes have high specificity
          // and it's diffcult to override sizes
          __height="16px"
          __width="16px"
        />
        <Text
          variant="body"
          size="small"
          color="textNeutralSubdued"
          whiteSpace="nowrap"
        >
          {`${column.metaGroup} /`}
        </Text>
        <Text variant="body" size="small" color="textNeutralDefault" ellipsis>
          {column.title}
        </Text>
      </Box>
    ))}
  </Box>
);
