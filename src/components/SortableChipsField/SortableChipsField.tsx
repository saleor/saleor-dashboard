import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ReorderAction } from "@saleor/types";
import React from "react";
import { SortableContainerProps } from "react-sortable-hoc";

import Skeleton from "../Skeleton";
import DraggableChip from "../SortableChip";
import SortableContainer from "./SortableContainer";

const useStyles = makeStyles(
  theme => ({
    chip: {
      background: "#fff",
      color: theme.palette.primary.dark,
      marginBottom: theme.spacing(1)
    },
    errorText: {
      color: theme.palette.error.light
    }
  }),
  {
    name: "SortableChipsField"
  }
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
  const {
    loading,
    values,
    error,
    helperText,
    onValueDelete,
    onValueReorder
  } = props;
  const classes = useStyles(props);

  return (
    <SortableContainer
      axis="xy"
      lockAxis="xy"
      useDragHandle
      onSortEnd={onValueReorder}
    >
      <div>
        {loading ? (
          <Skeleton />
        ) : (
          values.map((value, valueIndex) => (
            <DraggableChip
              className={classes.chip}
              key={valueIndex}
              index={valueIndex}
              label={value.label}
              onClose={() => onValueDelete(value.value)}
            />
          ))
        )}
        {error && (
          <Typography variant="caption" className={classes.errorText}>
            {helperText}
          </Typography>
        )}
      </div>
    </SortableContainer>
  );
};

SortableChipsField.displayName = "SortableChipsField";
export default SortableChipsField;
