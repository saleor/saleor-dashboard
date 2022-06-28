import DataEditor, {
  EditableGridCell,
  GridCell,
  GridSelection,
  Item,
  Theme
} from "@glideapps/glide-data-grid";
import {
  Button,
  IconButton,
  MoreHorizontalIcon,
  useTheme
} from "@saleor/macaw-ui";
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
  onCellEdited: (item: Item, newValue: EditableGridCell) => void;
}

export const Datagrid: React.FC<DatagridProps> = ({
  availableColumns,
  getCellContent,
  menuItems,
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

  // return (
  //   <div className={classes.wrapper}>
  //     <div className={classes.scrollable}>
  //       <Spreadsheet
  //         data={data}
  //         columnLabels={columns.map(c => c.label)}
  //         className={classes.spreadsheet}
  //         Table={({ children }) => (
  //           <table className={classes.table}>
  //             <colgroup>
  //               <col className={classes.rowIndicatorCol} />
  //               {columns.map(({ value, width }) => (
  //                 <col key={value} style={{ width }} />
  //               ))}
  //               <col className={classes.actionCol} />
  //             </colgroup>
  //             <tbody>{children}</tbody>
  //           </table>
  //         )}
  //         ColumnIndicator={({ column, label, onSelect }) =>
  //           selected.length === 0 ? (
  //             <Column
  //               onClick={() => onSelect(column, true)}
  //               draggable
  //               data-column={column}
  //               onDrop={e => {
  //                 const targetIndex = parseInt(
  //                   e.dataTransfer.getData("text/plain"),
  //                   10
  //                 );
  //                 onColumnMove(column, targetIndex);
  //               }}
  //             >
  //               {label}
  //             </Column>
  //           ) : column === 0 ? (
  //             <th colSpan={columns.length}>toolbar</th>
  //           ) : null
  //         }
  //         RowIndicator={({ row }) => (
  //           <td className={classes.rowIndicator}>
  //             <Checkbox
  //               checked={selected.includes(data[row][0].id)}
  //               onChange={() =>
  //                 setSelected(
  //                   toggle(data[row][0].id, selected, (a, b) => a === b)
  //                 )
  //               }
  //             />
  //           </td>
  //         )}
  //         CornerIndicator={() => (
  //           <th className={classes.cornerIndicator}>
  //             <Checkbox
  //               checked={selected.length === data.length}
  //               indeterminate={
  //                 selected.length > 0 && selected.length !== data.length
  //               }
  //               onChange={() =>
  //                 setSelected(prevSelected =>
  //                   prevSelected.length === data.length
  //                     ? []
  //                     : hookOpts.data.map(d => d.id)
  //                 )
  //               }
  //             />
  //           </th>
  //         )}
  //         onCellCommit={onCellCommit}
  //       />
  //       {/* Skip the last element */}
  //       {columns.slice(0, -1).map((column, index) => (
  //         <ColumnResize
  //           key={`${column.value}-${column.width}`}
  //           offset={
  //             rowIndicatorWidth +
  //             columns.slice(0, index + 1).reduce((acc, v) => acc + v.width, 0) -
  //             Math.ceil(columnResizerWidth / 2)
  //           }
  //           onDrop={(_, data) => onColumnResize(column, data.x)}
  //         />
  //       ))}
  //     </div>
  //     <table className={classes.actions}>
  //       <tbody>
  //         <tr className={classes.actionRow}>
  //           <th>
  //             {selected.length === 0 ? (
  //
  //             ) : (
  //               <div
  //                 style={{
  //                   display: "flex",
  //                   gap: 8,
  //                   position: "absolute",
  //                   top: 0,
  //                   right: 0
  //                 }}
  //               >
  //                 {children(selected)}
  //               </div>
  //             )}
  //           </th>
  //         </tr>
  //         {data.map((_, rowIndex) => (
  //           <tr key={rows[rowIndex]} className={classes.actionRow}>
  //             <td>
  //               <CardMenu
  //                 Icon={MoreHorizontalIcon}
  //                 menuItems={menuItems(rows[rowIndex])}
  //               />
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );

  return (
    <div className={classes.root}>
      <ThemeProvider theme={datagridTheme}>
        {selection?.rows.length > 0 && (
          <div className={classes.actionBtnBar}>
            <Button
              variant="tertiary"
              // onClick={() => {
              //   const selected = Array.from(selection.rows);
              //   console.log(selected);
              // }}
            >
              Do it
            </Button>
          </div>
        )}
        <DataEditor
          {...props}
          getCellContent={getCellContentEnh}
          onCellEdited={onCellEditedEnh}
          columns={columns}
          rows={10}
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
          onGridSelectionChange={data => {
            setSelection(data);
          }}
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
              {Array(10)
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
    </div>
  );
};
Datagrid.displayName = "Datagrid";
export default Datagrid;
