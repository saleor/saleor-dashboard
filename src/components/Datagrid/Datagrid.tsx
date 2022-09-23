import DataEditor, {
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridSelection,
  Item,
} from "@glideapps/glide-data-grid";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Button, MoreHorizontalIcon, PlusSmallIcon } from "@saleor/macaw-ui";
import classNames from "classnames";
import range from "lodash/range";
import React from "react";
import { ThemeProvider } from "styled-components";

import CardMenu, { CardMenuItem } from "../CardMenu";
import CardTitle from "../CardTitle";
import ColumnPicker from "../ColumnPicker";
import useStyles, { useDatagridTheme } from "./styles";
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
  addButtonLabel: string;
  availableColumns: readonly AvailableColumn[];
  emptyText: string;
  getCellError: (item: Item, opts: GetCellContentOpts) => boolean;
  getCellContent: (item: Item, opts: GetCellContentOpts) => GridCell;
  menuItems: (index: number) => CardMenuItem[];
  rows: number;
  title: string;
  selectionActions: (
    selection: number[],
    actions: MenuItemsActions,
  ) => React.ReactNode;
  onChange?: OnDatagridChange;
}

export const Datagrid: React.FC<DatagridProps> = ({
  addButtonLabel,
  availableColumns,
  emptyText,
  getCellContent,
  getCellError,
  menuItems,
  rows,
  selectionActions,
  title,
  onChange,
}): React.ReactElement => {
  const classes = useStyles();
  const datagridTheme = useDatagridTheme();
  const editor = React.useRef<DataEditorRef>();

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
    ([column, row]: Item): GridCell => {
      const item = [
        availableColumns.findIndex(ac => ac.id === displayedColumns[column]),
        row,
      ] as const;
      const opts = { changes, added, removed, getChangeIndex };

      return {
        ...getCellContent(item, opts),
        ...(getCellError(item, opts)
          ? { themeOverride: { bgCell: "#F4DDBA" } }
          : {}),
      };
    },
    [getCellContent, availableColumns, displayedColumns, added, removed],
  );

  const onCellEditedEnh = React.useCallback(
    ([column, row]: Item, newValue: EditableGridCell): void => {
      onCellEdited(
        [
          availableColumns.findIndex(ac => ac.id === displayedColumns[column]),
          row,
        ],
        newValue,
      );
      editor.current.updateCells(
        range(displayedColumns.length).map(offset => ({
          cell: [column + offset, row],
        })),
      );
    },
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

  const rowsTotal = rows - removed.length + added.length;

  return (
    <Card className={classes.root}>
      <CardTitle
        title={title}
        toolbar={
          <div className={classes.btnContainer}>
            <Button
              className={classes.addBtn}
              variant="tertiary"
              onClick={onRowAdded}
            >
              <PlusSmallIcon />
              {addButtonLabel}
            </Button>
          </div>
        }
      />
      <CardContent>
        {rowsTotal > 0 ? (
          <>
            <ThemeProvider theme={datagridTheme}>
              {selection?.rows.length > 0 && (
                <div className={classes.actionBtnBar}>
                  {selectionActionsComponent}
                </div>
              )}
              <DataEditor
                {...props}
                className={classes.datagrid}
                getCellContent={getCellContentEnh}
                onCellEdited={onCellEditedEnh}
                columns={columns}
                rows={rowsTotal}
                freezeColumns={1}
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
                ref={editor}
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
                    {columns.some(col => col.group) && (
                      <div className={classes.rowAction} />
                    )}
                    {Array(rowsTotal)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          className={classNames(classes.rowAction, {
                            [classes.rowActionSelected]: selection?.rows.hasIndex(
                              index,
                            ),
                          })}
                          key={index}
                        >
                          <CardMenu
                            disabled={index >= rowsTotal - added.length}
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
                overscrollX={1}
                rowMarkerWidth={48}
              />
            </ThemeProvider>
          </>
        ) : (
          <Typography align="center">{emptyText}</Typography>
        )}
      </CardContent>
      <div id="portal" className={classes.portal} />
    </Card>
  );
};
Datagrid.displayName = "Datagrid";
export default Datagrid;
