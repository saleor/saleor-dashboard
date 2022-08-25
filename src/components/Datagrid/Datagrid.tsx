import DataEditor, {
  EditableGridCell,
  GridCell,
  GridSelection,
  Item,
  Theme,
} from "@glideapps/glide-data-grid";
import { Button, MoreHorizontalIcon, useTheme } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { ThemeProvider } from "styled-components";

import CardMenu, { CardMenuItem } from "../CardMenu";
import ColumnPicker from "../ColumnPicker";
import useStyles from "./styles";
import { AvailableColumn } from "./types";
import useCells from "./useCells";
import useColumns from "./useColumns";
import useDatagridChange, {
  DatagridChange,
  OnDatagridChange,
} from "./useDatagridChange";

export interface GetCellContentOpts {
  changes: React.MutableRefObject<DatagridChange[]>;
  added: number[];
  removed: number[];
  getChangeIndex: (column: string, row: number) => number;
}

export interface MenuItemsActions {
  removeRows: (indexes: number[]) => void;
}

export interface DatagridProps {
  availableColumns: readonly AvailableColumn[];
  getCellContent: (item: Item, opts: GetCellContentOpts) => GridCell;
  menuItems: (index: number) => CardMenuItem[];
  rows: number;
  selectionActions: (
    selection: number[],
    actions: MenuItemsActions,
  ) => React.ReactNode;
  onChange?: OnDatagridChange;
}

export const Datagrid: React.FC<DatagridProps> = ({
  availableColumns,
  getCellContent,
  menuItems,
  rows,
  selectionActions,
  onChange,
}): React.ReactElement => {
  const classes = useStyles();
  const theme = useTheme();
  const datagridTheme = React.useMemo(
    (): Partial<Theme> => ({
      accentColor: theme.palette.saleor.main[1],
      accentLight: theme.palette.divider,
      accentFg: theme.palette.divider,
      bgCell: theme.palette.background.default,
      bgHeader: theme.palette.background.default,
      bgHeaderHasFocus: theme.palette.background.default,
      bgHeaderHovered: theme.palette.background.default,
      bgBubbleSelected: theme.palette.background.default,
      textHeader: theme.palette.saleor.main[3],
      borderColor: theme.palette.divider,
      fontFamily: theme.typography.fontFamily,
      baseFontStyle: theme.typography.body1.fontSize as string,
      headerFontStyle: theme.typography.body2.fontSize as string,
      editorFontSize: theme.typography.body1.fontSize as string,
    }),
    [theme],
  );

  const {
    availableColumnsChoices,
    columns,
    columnChoices,
    defaultColumns,
    displayedColumns,
    onColumnMoved,
    onColumnResize,
    onColumnsChange,
    picker,
  } = useColumns(availableColumns);

  const {
    added,
    onCellEdited,
    onRowsRemoved,
    changes,
    removed,
    getChangeIndex,
    onRowAdded,
  } = useDatagridChange(availableColumns, rows, onChange);

  const getCellContentEnh = React.useCallback(
    ([column, row]: Item): GridCell =>
      getCellContent(
        [
          availableColumns.findIndex(ac => ac.id === displayedColumns[column]),
          row,
        ],
        { changes, added, removed, getChangeIndex },
      ),
    [getCellContent, availableColumns, displayedColumns, added, removed],
  );

  const onCellEditedEnh = React.useCallback(
    ([column, row]: Item, newValue: EditableGridCell): void =>
      onCellEdited(
        [
          availableColumns.findIndex(ac => ac.id === displayedColumns[column]),
          row,
        ],
        newValue,
      ),
    [onCellEdited, getCellContent, availableColumns, displayedColumns],
  );

  const [selection, setSelection] = React.useState<GridSelection>();

  const props = useCells();

  const removeRows = React.useCallback(
    (rows: number[]) => {
      if (selection?.rows) {
        onRowsRemoved(rows);
        setSelection(undefined);
      }
    },
    [selection, onRowsRemoved],
  );

  const selectionActionsComponent = React.useMemo(
    () =>
      selection?.rows.length > 0
        ? selectionActions(Array.from(selection.rows), { removeRows })
        : null,
    [selection, selectionActions, removeRows],
  );

  return (
    <div className={classes.root}>
      <Button variant="tertiary" onClick={onRowAdded}>
        Add
      </Button>
      <ThemeProvider theme={datagridTheme}>
        {selection?.rows.length > 0 && (
          <div className={classes.actionBtnBar}>
            {selectionActionsComponent}
          </div>
        )}
        <DataEditor
          {...props}
          getCellContent={getCellContentEnh}
          onCellEdited={onCellEditedEnh}
          columns={columns}
          rows={rows - removed.length + added.length}
          freezeColumns={0}
          smoothScrollX
          rowMarkers="checkbox"
          rowSelect="multi"
          rowSelectionMode="multi"
          rangeSelect="multi-rect"
          columnSelect="none"
          getCellsForSelection
          onColumnMoved={onColumnMoved}
          onColumnResize={onColumnResize}
          onGridSelectionChange={setSelection}
          gridSelection={selection}
          rowHeight={48}
          headerHeight={48}
          ref={undefined}
          rightElementSticky
          rightElement={
            <div className={classes.rowActionBar}>
              <div className={classes.columnPicker}>
                <ColumnPicker
                  IconButtonProps={{
                    className: classes.columnPickerBtn,
                    variant: "secondary",
                    hoverOutline: false,
                  }}
                  availableColumns={availableColumnsChoices}
                  initialColumns={columnChoices}
                  defaultColumns={defaultColumns}
                  onSave={onColumnsChange}
                  hasMore={false}
                  loading={false}
                  onFetchMore={() => undefined}
                  onQueryChange={picker.setQuery}
                  query={picker.query}
                />
              </div>
              {Array(rows - removed.length)
                .fill(0)
                .map((_, index) => (
                  <div
                    className={classNames(classes.rowAction, {
                      [classes.rowActionSelected]: selection?.rows.hasIndex(
                        index,
                      ),
                    })}
                  >
                    <CardMenu
                      Icon={MoreHorizontalIcon}
                      IconButtonProps={{
                        className: classes.columnPickerBtn,
                        hoverOutline: false,
                        state: "default",
                      }}
                      menuItems={menuItems(index)}
                    />
                  </div>
                ))}
            </div>
          }
        />
      </ThemeProvider>
      <div id="portal" className={classes.portal} />
    </div>
  );
};
Datagrid.displayName = "Datagrid";
export default Datagrid;
