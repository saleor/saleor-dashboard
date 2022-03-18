import { ClickAwayListener, Grow, Popper } from "@material-ui/core";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { ColumnsIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import { toggle } from "@saleor/utils/lists";
import { score } from "fuzzaldrin";
import sortBy from "lodash/sortBy";
import React from "react";

import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";
import ColumnPickerContent, {
  ColumnPickerContentProps
} from "./ColumnPickerContent";

export interface ColumnPickerProps
  extends Omit<
    ColumnPickerContentProps,
    | "selectedColumns"
    | "onCancel"
    | "onColumnToggle"
    | "onReset"
    | "onSave"
    | "onChange"
    | "displayValues"
    | "choices"
  > {
  className?: string;
  availableColumns: MultiAutocompleteChoiceType[];
  defaultColumns: string[];
  initialColumns: string[];
  initialOpen?: boolean;
  query: string;
  onSave: (columns: string[]) => void;
}

const useStyles = makeStyles(
  theme => ({
    popper: {
      marginTop: theme.spacing(1),
      zIndex: 2
    }
  }),
  {
    name: "ColumnPicker"
  }
);

const ColumnPicker: React.FC<ColumnPickerProps> = props => {
  const {
    className,
    availableColumns,
    defaultColumns,
    hasMore,
    initialColumns,
    initialOpen = false,
    onSave,
    query,
    ...rest
  } = props;
  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement>();
  const [isExpanded, setExpansionState] = React.useState(false);
  const [selectedColumns, setSelectedColumns] = useStateFromProps(
    initialColumns
  );
  const [displayValues, setDisplayValues] = useStateFromProps<
    MultiAutocompleteChoiceType[]
  >(
    initialColumns.map(value => ({
      label: availableColumns.find(column => column.value === value)?.label,
      value
    }))
  );
  const onChange = createMultiAutocompleteSelectHandler(
    event =>
      setSelectedColumns(
        toggle(event.target.value, selectedColumns, (a, b) => a === b)
      ),
    setDisplayValues,
    displayValues,
    availableColumns
  );

  React.useEffect(() => {
    setTimeout(() => setExpansionState(initialOpen), 100);
  }, []);

  const handleCancel = () => {
    setExpansionState(false);
    setSelectedColumns(initialColumns);
  };

  const handleReset = () => setSelectedColumns(defaultColumns);

  const handleSave = () => {
    setExpansionState(false);
    onSave(selectedColumns);
  };

  const choices = sortBy(
    availableColumns.map(column => ({
      ...column,
      score: -score(column.label, query)
    })),
    "score"
  );

  return (
    <ClickAwayListener onClickAway={() => setExpansionState(false)}>
      <div ref={anchor} className={className}>
        <IconButton
          state={isExpanded ? "active" : "default"}
          onClick={() => setExpansionState(prevState => !prevState)}
        >
          <ColumnsIcon />
        </IconButton>
        <Popper
          className={classes.popper}
          open={isExpanded}
          anchorEl={anchor.current}
          transition
          disablePortal
          placement="bottom-end"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "right bottom" : "right top"
              }}
            >
              <ColumnPickerContent
                choices={choices}
                displayValues={displayValues}
                selectedColumns={selectedColumns}
                onCancel={handleCancel}
                onChange={onChange}
                onReset={handleReset}
                onSave={handleSave}
                {...rest}
              />
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default ColumnPicker;
