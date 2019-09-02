import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import { Theme } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";

import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { toggle } from "@saleor/utils/lists";
import ColumnPickerButton from "./ColumnPickerButton";
import ColumnPickerContent, {
  ColumnPickerContentProps
} from "./ColumnPickerContent";

export interface ColumnPickerProps
  extends Omit<
    ColumnPickerContentProps,
    "selectedColumns" | "onCancel" | "onColumnToggle" | "onReset" | "onSave"
  > {
  className?: string;
  defaultColumns: string[];
  initialColumns: string[];
  initialOpen?: boolean;
  onSave: (columns: string[]) => void;
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    popper: {
      boxShadow: `0px 5px 10px 0 ${fade(theme.palette.common.black, 0.05)}`,
      marginTop: theme.spacing.unit * 2,
      zIndex: 1
    }
  }),
  {
    name: "ColumnPicker"
  }
);

const ColumnPicker: React.FC<ColumnPickerProps> = props => {
  const {
    className,
    columns,
    defaultColumns,
    hasMore,
    initialColumns,
    initialOpen = false,
    loading,
    total,
    onFetchMore,
    onSave
  } = props;
  const classes = useStyles(props);
  const anchor = React.useRef<HTMLDivElement>();
  const [isExpanded, setExpansionState] = React.useState(false);
  const [selectedColumns, setSelectedColumns] = useStateFromProps(
    initialColumns
  );

  React.useEffect(() => {
    setTimeout(() => setExpansionState(initialOpen), 100);
  }, []);

  const handleCancel = () => {
    setExpansionState(false);
    setSelectedColumns(initialColumns);
  };

  const handleColumnToggle = (column: string) =>
    setSelectedColumns(toggle(column, selectedColumns, (a, b) => a === b));

  const handleReset = () => setSelectedColumns(defaultColumns);

  const handleSave = () => {
    setExpansionState(false);
    onSave(selectedColumns);
  };

  return (
    <div ref={anchor} className={className}>
      <ColumnPickerButton
        active={isExpanded}
        onClick={() => setExpansionState(prevState => !prevState)}
      />
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
            <ClickAwayListener
              onClickAway={() => setExpansionState(false)}
              mouseEvent="onClick"
            >
              <ColumnPickerContent
                columns={columns}
                hasMore={hasMore}
                loading={loading}
                selectedColumns={selectedColumns}
                total={total}
                onCancel={handleCancel}
                onColumnToggle={handleColumnToggle}
                onFetchMore={onFetchMore}
                onReset={handleReset}
                onSave={handleSave}
              />
            </ClickAwayListener>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default ColumnPicker;
