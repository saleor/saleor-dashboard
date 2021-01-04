import { makeStyles } from "@material-ui/core/styles";
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
    }
  }),
  {
    name: "SortableChipsField"
  }
);

interface SortableChipsFieldValueType {
  label: string;
  value: any;
}

export interface SortableChipsFieldProps extends SortableContainerProps {
  loading?: boolean;
  values: SortableChipsFieldValueType[];
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
}

const SortableChipsField: React.FC<SortableChipsFieldProps> = props => {
  const { loading, values, onValueDelete, onValueReorder } = props;
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
      </div>
    </SortableContainer>
  );
};

SortableChipsField.displayName = "SortableChipsField";
export default SortableChipsField;
