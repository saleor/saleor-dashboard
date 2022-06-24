import { ClickAwayListener, Grow, Popper } from "@material-ui/core";
import { FormChange } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { Choice, ColumnsIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { FetchMoreProps } from "@saleor/types";
import { score } from "fuzzaldrin";
import sortBy from "lodash/sortBy";
import React from "react";

import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";
import ColumnPickerContent, {
  ColumnPickerContentProps,
} from "./ColumnPickerContent";

export interface ColumnPickerProps
  extends FetchMoreProps,
    Pick<ColumnPickerContentProps, "onQueryChange"> {
  className?: string;
  availableColumns: MultiAutocompleteChoiceType[];
  defaultColumns: string[];
  initialColumns: Choice[];
  initialOpen?: boolean;
  query: string;
  onSave: (columns: string[]) => void;
}

const useStyles = makeStyles(
  theme => ({
    popper: {
      marginTop: theme.spacing(1),
    },
  }),
  {
    name: "ColumnPicker",
  },
);

const ColumnPicker: React.FC<ColumnPickerProps> = props => {
  const {
    className,
    availableColumns,
    defaultColumns,
    initialColumns,
    initialOpen = false,
    onSave,
    query,
    ...rest
  } = props;
  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement>();
  const selectedColumns = React.useRef(
    initialColumns.map(({ value }) => value),
  );
  const [isExpanded, setExpansionState] = React.useState(false);

  // Component is uncontrolled but we need to reset it somehow, so we change
  // initial prop after reset callback to force value refreshing
  const [initialColumnsChoices, setInitialColumnsChoices] = useStateFromProps(
    initialColumns,
  );

  const onChange: FormChange<string[]> = event => {
    selectedColumns.current = event.target.value;
  };

  React.useEffect(() => {
    setTimeout(() => setExpansionState(initialOpen), 100);
  }, []);

  const handleCancel = () => {
    setExpansionState(false);
    selectedColumns.current = initialColumns.map(({ value }) => value);
  };

  const handleReset = () => {
    selectedColumns.current = defaultColumns;
    const defaultColumnsChoices = defaultColumns.map(value => ({
      label: availableColumns.find(column => column.value === value)?.label,
      value,
    }));
    setInitialColumnsChoices(defaultColumnsChoices);
    onChange({ target: { name: "", value: defaultColumns } });
  };

  const handleSave = () => {
    setExpansionState(false);
    onSave(selectedColumns.current);
  };

  const choices = sortBy(
    availableColumns.map(column => ({
      ...column,
      score: -score(column.label, query),
    })),
    "score",
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
          placement="bottom-end"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "right bottom" : "right top",
              }}
            >
              <ColumnPickerContent
                choices={choices}
                initialValues={initialColumnsChoices}
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
