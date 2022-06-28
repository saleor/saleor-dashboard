import DataEditor, {
  EditableGridCell,
  GridCell,
  GridSelection,
  Item,
  Theme
} from "@glideapps/glide-data-grid";
import { MoreHorizontalIcon, useTheme } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { ThemeProvider } from "styled-components";

import CardMenu, { CardMenuItem } from "../CardMenu";
import ColumnPicker from "../ColumnPicker";
import useStyles from "./styles";
import { AvailableColumn } from "./types";
import useCells from "./useCells";
import useColumns from "./useColumns";

export interface DatagridProps {
  availableColumns: readonly AvailableColumn[];
  getCellContent: (item: Item) => GridCell;
  menuItems: (index: number) => CardMenuItem[];
  rows: number;
  selectionActions: (selection: number[]) => React.ReactNode;
  onCellEdited: (item: Item, newValue: EditableGridCell) => void;
}

export const Datagrid: React.FC<DatagridProps> = ({
  availableColumns,
  getCellContent,
  menuItems,
  rows,
  selectionActions,
  onCellEdited
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
      editorFontSize: theme.typography.body1.fontSize as string
    }),
    [theme]
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
    picker
  } = useColumns(availableColumns);

  const getCellContentEnh = React.useCallback(
    ([column, row]: Item): GridCell =>
      getCellContent([
        availableColumns.findIndex(ac => ac.id === displayedColumns[column]),
        row
      ]),
    [getCellContent, availableColumns, displayedColumns]
  );

  const onCellEditedEnh = React.useCallback(
    ([column, row]: Item, newValue: EditableGridCell): void =>
      onCellEdited(
        [
          availableColumns.findIndex(ac => ac.id === displayedColumns[column]),
          row
        ],
        newValue
      ),
    [getCellContent, availableColumns, displayedColumns]
  );

  const [selection, setSelection] = React.useState<GridSelection>();

  const props = useCells();

  const selectionActionsComponent = React.useMemo(
    () =>
      selection?.rows.length > 0
        ? selectionActions(Array.from(selection.rows))
        : null,
    [selection, selectionActions]
  );

  return (
    <div className={classes.root}>
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
          rows={rows}
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
          rightElementSticky
          rightElement={
            <div className={classes.rowActionBar}>
              <div className={classes.columnPicker}>
                <ColumnPicker
                  IconButtonProps={{
                    className: classes.columnPickerBtn,
                    variant: "secondary",
                    hoverOutline: false
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
              {Array(rows)
                .fill(0)
                .map((_, index) => (
                  <div
                    className={classNames(classes.rowAction, {
                      [classes.rowActionSelected]: selection?.rows.hasIndex(
                        index
                      )
                    })}
                  >
                    <CardMenu
                      Icon={MoreHorizontalIcon}
                      IconButtonProps={{
                        className: classes.columnPickerBtn,
                        hoverOutline: false,
                        state: "default"
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
