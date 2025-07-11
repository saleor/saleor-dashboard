import { ReorderAction, ReorderEvent } from "@dashboard/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { SortableContainerProps } from "react-sortable-hoc";

import SortableChip from "../SortableChip";
import styles from "./SortableChipsField.module.css";
import SortableContainer from "./SortableContainer";

export interface SortableChipsFieldValueType {
  label: string;
  value: string;
  url?: string;
}

export interface SortableChipsFieldProps extends SortableContainerProps {
  loading?: boolean;
  values: SortableChipsFieldValueType[];
  error?: boolean;
  helperText?: string;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
}

const SortableChipsField: React.FC<SortableChipsFieldProps> = ({
  loading,
  values,
  error,
  helperText,
  onValueDelete,
  onValueReorder,
}: SortableChipsFieldProps) => {
  const handleSortStart = () => {
    document.body.style.cursor = "grabbing";
  };
  const handleSortEnd = (event: ReorderEvent) => {
    document.body.style.cursor = "";
    onValueReorder(event);
  };

  return (
    <SortableContainer
      axis="xy"
      lockAxis="xy"
      useDragHandle
      onSortStart={handleSortStart}
      onSortEnd={handleSortEnd}
      // We need this class to avoid layout shifts when dragging elements
      // in order to override default styles from react-sortable-hoc
      helperClass={styles.sortableChipHelper}
    >
      <div>
        {values.map((value, valueIndex) => {
          return (
            <Box key={valueIndex} marginBottom={1}>
              <SortableChip
                loading={loading}
                disabled={loading}
                index={valueIndex}
                label={value.label}
                onClose={() => onValueDelete(value.value)}
                url={value.url}
              />
            </Box>
          );
        })}
        {error && (
          <Text size={2} color="critical1">
            {helperText}
          </Text>
        )}
      </div>
    </SortableContainer>
  );
};

SortableChipsField.displayName = "SortableChipsField";
export default SortableChipsField;
