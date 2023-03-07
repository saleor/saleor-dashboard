import "@glideapps/glide-data-grid/dist/index.css";

import { usePreventHistoryBack } from "@dashboard/hooks/usePreventHistoryBack";
import DataEditor, {
  DataEditorProps,
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridColumn,
  GridMouseEventArgs,
  GridSelection,
  HeaderClickedEventArgs,
  Item,
} from "@glideapps/glide-data-grid";
import { GetRowThemeCallback } from "@glideapps/glide-data-grid/dist/ts/data-grid/data-grid-render";
import { Card, CardContent, Typography } from "@material-ui/core";
import { themes, useTheme } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import range from "lodash/range";
import React, {
  MutableRefObject,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormattedMessage } from "react-intl";

import { CardMenuItem } from "../CardMenu";
import { ColumnPickerProps } from "../ColumnPicker";
import { FullScreenContainer } from "./components/FullScreenContainer";
import { Header } from "./components/Header";
import { RowActions } from "./components/RowActions";
import { TooltipContainer } from "./components/TooltipContainer";
import useCells from "./customCells/useCells";
import { headerIcons } from "./headerIcons";
import useDatagridChange, {
  DatagridChange,
  OnDatagridChange,
} from "./hooks/useDatagridChange";
import { useFullScreenMode } from "./hooks/useFullScreenMode";
import { usePortalClasses } from "./hooks/usePortalClasses";
import { useScrollRight } from "./hooks/useScrollRight";
import { useTooltipContainer } from "./hooks/useTooltipContainer";
import useStyles, {
  cellHeight,
  useDatagridTheme,
  useFullScreenStyles,
} from "./styles";
import { AvailableColumn } from "./types";
import { getDefultColumnPickerProps } from "./utils";

export interface GetCellContentOpts {
  changes: MutableRefObject<DatagridChange[]>;
  added: number[];
  removed: number[];
  getChangeIndex: (column: string, row: number) => number;
}

export interface MenuItemsActions {
  removeRows: (indexes: number[]) => void;
}

export interface DatagridProps {
  addButtonLabel?: string;
  availableColumns: readonly AvailableColumn[];
  emptyText: string;
  getCellError: (item: Item, opts: GetCellContentOpts) => boolean;
  getCellContent: (item: Item, opts: GetCellContentOpts) => GridCell;
  getColumnTooltipContent?: (colIndex: number) => string;
  menuItems: (index: number) => CardMenuItem[];
  rows: number;
  title?: string;
  fullScreenTitle?: string;
  selectionActions: (
    selection: number[],
    actions: MenuItemsActions,
  ) => ReactNode;
  onChange?: OnDatagridChange;
  onHeaderClicked?: (colIndex: number, event: HeaderClickedEventArgs) => void;
  renderColumnPicker?: (
    defaultProps: Partial<ColumnPickerProps>,
  ) => ReactElement;
  onRowClick?: (item: Item) => void;
  onColumnMoved?: (startIndex: number, endIndex: number) => void;
  onColumnResize?: (column: GridColumn, newSize: number) => void;
  readonly?: boolean;
  rowMarkers?: DataEditorProps["rowMarkers"];
  freezeColumns?: DataEditorProps["freezeColumns"];
  verticalBorder?: DataEditorProps["verticalBorder"];
  columnSelect?: DataEditorProps["columnSelect"];
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
  fullScreenTitle,
  onHeaderClicked,
  onChange,
  renderColumnPicker,
  onRowClick,
  getColumnTooltipContent,
  readonly = false,
  rowMarkers = "checkbox",
  freezeColumns = 1,
  verticalBorder,
  columnSelect = "none",
  onColumnMoved,
  onColumnResize,
  ...datagridProps
}): ReactElement => {
  const classes = useStyles();
  const { theme: currentTheme } = useTheme();
  const datagridTheme = useDatagridTheme(readonly);
  const theme = themes[currentTheme];
  const editor = useRef<DataEditorRef>();
  const cellProps = useCells();
  const { scrolledToRight, scroller } = useScrollRight();

  const defualtColumnPickerProps = getDefultColumnPickerProps(
    classes.ghostIcon,
  );

  const fullScreenClasses = useFullScreenStyles(classes);
  const { isOpen, isAnimationOpenFinished, toggle } = useFullScreenMode();

  const { clearTooltip, tooltip, setTooltip } = useTooltipContainer();

  const [selection, setSelection] = useState<GridSelection>();
  const [hoverRow, setHoverRow] = useState<number | undefined>(undefined);

  usePortalClasses({ className: classes.portal });
  usePreventHistoryBack(scroller);

  const {
    added,
    onCellEdited,
    onRowsRemoved,
    changes,
    removed,
    getChangeIndex,
    onRowAdded,
  } = useDatagridChange(availableColumns, rows, onChange);

  const rowsTotal = rows - removed.length + added.length;
  const hasMenuItem = !!menuItems(0).length;
  const hasColumnGroups = availableColumns.some(col => col.group);
  const headerTitle = isAnimationOpenFinished
    ? fullScreenTitle ?? title
    : title;

  const handleGetCellContent = useCallback(
    ([column, row]: Item): GridCell => {
      const item = [column, row] as const;
      const opts = { changes, added, removed, getChangeIndex };

      const columnId = availableColumns[column]?.id;
      const changed = !!changes.current[getChangeIndex(columnId, row)]?.data;

      return {
        ...getCellContent(item, opts),
        ...(changed
          ? {
              themeOverride: {
                bgCell: theme.colors.background.surfaceBrandHighlight,
              },
            }
          : {}),
        ...(getCellError(item, opts)
          ? {
              themeOverride: {
                bgCell: theme.colors.background.interactiveCriticalHovering,
              },
            }
          : {}),
      };
    },
    [
      availableColumns,
      changes,
      added,
      removed,
      getChangeIndex,
      getCellContent,
      theme,
      getCellError,
    ],
  );

  const handleOnCellEdited = useCallback(
    ([column, row]: Item, newValue: EditableGridCell): void => {
      onCellEdited([column, row], newValue);
      editor.current.updateCells(
        range(availableColumns.length).map(offset => ({
          cell: [column + offset, row],
        })),
      );
    },
    [onCellEdited, availableColumns],
  );

  const handleCellClick = useCallback(
    (item: Item) => {
      if (onRowClick && item[0] !== -1) {
        onRowClick(item);
      }
    },
    [onRowClick],
  );

  const handleRowHover = useCallback(
    (args: GridMouseEventArgs) => {
      if (readonly) {
        setHoverRow(args.kind !== "cell" ? undefined : args.location[1]);
      }
    },
    [readonly],
  );

  const handleGridSelectionChange = (gridSelection: GridSelection) => {
    // In readonly we not allow selecting cells, but we allow selcting column
    if (readonly && !gridSelection.current) {
      setSelection(gridSelection);
    }
    if (!readonly) {
      setSelection(gridSelection);
    }
  };

  const handleGetThemeOverride = useCallback<GetRowThemeCallback>(
    (row: number) => {
      if (row !== hoverRow) {
        return undefined;
      }

      const overrideTheme = {
        bgCell: theme.colors.background.surfaceNeutralHighlight,
        bgCellMedium: theme.colors.background.surfaceNeutralHighlight,
        accentLight: undefined,
      };

      if (readonly) {
        overrideTheme.accentLight =
          theme.colors.background.surfaceNeutralHighlight;
      }

      return overrideTheme;
    },
    [hoverRow, readonly, theme],
  );

  const handleHeaderClicked = useCallback(
    (colIndex: number, event: HeaderClickedEventArgs) => {
      if (getColumnTooltipContent) {
        const content = getColumnTooltipContent(colIndex);

        if (content) {
          setTooltip(content, event.bounds);
        }
      }

      if (onHeaderClicked) {
        onHeaderClicked(colIndex, event);
      }
    },
    [getColumnTooltipContent, onHeaderClicked, setTooltip],
  );

  const handleRemoveRows = useCallback(
    (rows: number[]) => {
      if (selection?.rows) {
        onRowsRemoved(rows);
        setSelection(undefined);
      }
    },
    [selection, onRowsRemoved],
  );

  const handleColumnResize = useCallback(
    (column: GridColumn, newSize: number) => {
      if (tooltip) {
        clearTooltip();
      }

      onColumnResize(column, newSize);
    },
    [clearTooltip, onColumnResize, tooltip],
  );

  const handleColumnMoved = useCallback(
    (startIndex: number, endIndex: number) => {
      if (tooltip) {
        clearTooltip();
      }
      onColumnMoved(startIndex, endIndex);
    },
    [clearTooltip, onColumnMoved, tooltip],
  );

  const selectionActionsComponent = useMemo(
    () =>
      selection?.rows.length > 0
        ? selectionActions(Array.from(selection.rows), {
            removeRows: handleRemoveRows,
          })
        : null,
    [selection, selectionActions, handleRemoveRows],
  );

  return (
    <FullScreenContainer
      open={isOpen}
      className={fullScreenClasses.fullScreenContainer}
    >
      <Card className={classes.root}>
        {headerTitle && (
          <Header title={headerTitle}>
            <Header.ButtonFullScreen isOpen={isOpen} onToggle={toggle}>
              {isOpen ? (
                <FormattedMessage
                  id="QjPJ78"
                  defaultMessage="Close"
                  description="close full-screen"
                />
              ) : (
                <FormattedMessage
                  id="483Xnh"
                  defaultMessage="Open"
                  description="open full-screen"
                />
              )}
            </Header.ButtonFullScreen>
            {addButtonLabel && (
              <Header.ButtonAddRow onAddRow={onRowAdded}>
                {addButtonLabel}
              </Header.ButtonAddRow>
            )}
          </Header>
        )}
        <CardContent classes={{ root: classes.cardContentRoot }}>
          {rowsTotal > 0 ? (
            <>
              {selection?.rows.length > 0 && (
                <div className={classes.actionBtnBar}>
                  {selectionActionsComponent}
                </div>
              )}
              <div className={classes.editorContainer}>
                <DataEditor
                  {...cellProps}
                  {...datagridProps}
                  verticalBorder={verticalBorder}
                  headerIcons={headerIcons}
                  theme={datagridTheme}
                  className={classes.datagrid}
                  getCellContent={handleGetCellContent}
                  onCellEdited={handleOnCellEdited}
                  columns={availableColumns}
                  rows={rowsTotal}
                  freezeColumns={freezeColumns}
                  smoothScrollX
                  rowMarkers={rowMarkers}
                  rowSelect="multi"
                  rowSelectionMode="multi"
                  rangeSelect="multi-rect"
                  columnSelect={columnSelect}
                  getCellsForSelection
                  onColumnMoved={handleColumnMoved}
                  onColumnResize={handleColumnResize}
                  onHeaderClicked={handleHeaderClicked}
                  onCellClicked={handleCellClick}
                  onGridSelectionChange={handleGridSelectionChange}
                  onItemHovered={handleRowHover}
                  getRowThemeOverride={handleGetThemeOverride}
                  gridSelection={selection}
                  rowHeight={cellHeight}
                  headerHeight={cellHeight + 16}
                  ref={editor}
                  onPaste
                  rightElementProps={{
                    sticky: true,
                  }}
                  rightElement={
                    <div
                      className={clsx(classes.rowActionBar, {
                        [classes.rowActionBarScrolledToRight]: scrolledToRight,
                        [classes.rowActionvBarWithItems]: hasMenuItem,
                      })}
                    >
                      <div
                        className={clsx(classes.rowActionBarShadow, {
                          [classes.rowActionBarShadowActive]:
                            !scrolledToRight && hasMenuItem,
                        })}
                      />
                      <div
                        className={clsx(classes.columnPicker, {
                          [classes.columnPickerBackground]: !hasMenuItem,
                        })}
                      >
                        {renderColumnPicker
                          ? renderColumnPicker(defualtColumnPickerProps)
                          : null}
                      </div>
                      {hasColumnGroups && (
                        <div
                          className={clsx(
                            classes.rowAction,
                            classes.rowColumnGroup,
                            {
                              [classes.rowActionScrolledToRight]:
                                scrolledToRight,
                            },
                          )}
                        />
                      )}
                      {hasMenuItem &&
                        Array(rowsTotal)
                          .fill(0)
                          .map((_, index) => (
                            <RowActions
                              menuItems={menuItems(index)}
                              disabled={index >= rowsTotal - added.length}
                            />
                          ))}
                    </div>
                  }
                  rowMarkerWidth={48}
                />
                {/* FIXME: https://github.com/glideapps/glide-data-grid/issues/505 */}
                {hasColumnGroups && (
                  <div className={classes.columnGroupFixer} />
                )}
              </div>
            </>
          ) : (
            <Typography align="center">{emptyText}</Typography>
          )}
        </CardContent>
      </Card>
      <TooltipContainer
        clearTooltip={clearTooltip}
        bounds={tooltip?.bounds}
        title={tooltip?.title}
      />
    </FullScreenContainer>
  );
};

Datagrid.displayName = "Datagrid";
export default Datagrid;
