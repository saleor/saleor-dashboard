import { ReorderAction, ReorderEvent } from "@dashboard/types";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { SortableContainerProps } from "react-sortable-hoc";

import DraggableChip from "../SortableChip";
import SortableContainer from "./SortableContainer";

const useStyles = makeStyles(
  theme => ({
    chip: {
      background: theme.palette.background.paper,
      color: theme.palette.primary.dark,
      marginBottom: theme.spacing(1),
    },
    chipHelper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 0,
    },
    grabbing: {
      cursor: "grabbing",
    },
    errorText: {
      color: theme.palette.error.light,
    },
  }),
  {
    name: "SortableChipsField",
  },
);

export interface SortableChipsFieldValueType {
  label: string;
  value: string;
}

export interface SortableChipsFieldProps extends SortableContainerProps {
  loading?: boolean;
  values: SortableChipsFieldValueType[];
  error?: boolean;
  helperText?: string;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
}

const SortableChipsField: React.FC<SortableChipsFieldProps> = props => {
  const { loading, values, error, helperText, onValueDelete, onValueReorder } = props;
  const classes = useStyles(props);
  const handleSortStart = () => {
    document.body.classList.add(classes.grabbing);
  };
  const handleSortEnd = (event: ReorderEvent) => {
    document.body.classList.remove(classes.grabbing);
    onValueReorder(event);
  };

  return (
    <SortableContainer
      axis="xy"
      lockAxis="xy"
      useDragHandle
      onSortStart={handleSortStart}
      onSortEnd={handleSortEnd}
      helperClass={classes.chipHelper}
    >
      <div>
        {values.map((value, valueIndex) => (
          <DraggableChip
            className={classes.chip}
            loading={loading}
            disabled={loading}
            key={valueIndex}
            index={valueIndex}
            label={value.label}
            onClose={() => onValueDelete(value.value)}
          />
        ))}
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
