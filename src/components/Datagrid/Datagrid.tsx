import "@glideapps/glide-data-grid/dist/index.css";

import { useRowAnchorHandler } from "@dashboard/components/Datagrid/hooks/useRowAnchorHandler";
import { NavigatorOpts } from "@dashboard/hooks/useNavigator";
import { getCellAction } from "@dashboard/products/components/ProductListDatagrid/datagrid";
import DataEditor, {
  CellClickedEventArgs,
  DataEditorProps,
  DataEditorRef,
  DrawHeaderCallback,
  EditableGridCell,
  GridCell,
  GridColumn,
  GridSelection,
  HeaderClickedEventArgs,
  Item,
  Theme,
} from "@glideapps/glide-data-grid";
import { GetRowThemeCallback } from "@glideapps/glide-data-grid/dist/ts/data-grid/data-grid-render";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import range from "lodash/range";
import {
  MutableRefObject,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { DashboardCard } from "../Card";
import { CardMenuItem } from "../CardMenu";
import { SaleorThrobber } from "../Throbber";
import { FullScreenContainer } from "./components/FullScreenContainer";
import { PreventHistoryBack } from "./components/PreventHistoryBack";
import { RowActions } from "./components/RowActions";
import { TooltipContainer } from "./components/TooltipContainer";
import { useCustomCellRenderers } from "./customCells/useCustomCellRenderers";
import { headerIcons } from "./headerIcons";
import useDatagridChange, { DatagridChange, OnDatagridChange } from "./hooks/useDatagridChange";
import { useFullScreenMode } from "./hooks/useFullScreenMode";
import { usePortalClasses } from "./hooks/usePortalClasses";
import { useRowAnchor } from "./hooks/useRowAnchor";
import { useRowHover } from "./hooks/useRowHover";
import { useScrollRight } from "./hooks/useScrollRight";
import { useTooltipContainer } from "./hooks/useTooltipContainer";
import useStyles, { cellHeight, useDatagridTheme, useFullScreenStyles } from "./styles";
import { AvailableColumn } from "./types";
import { preventRowClickOnSelectionCheckbox } from "./utils";

export interface GetCellContentOpts {
  changes: MutableRefObject<DatagridChange[]>;
  added: number[];
  removed: number[];
  getChangeIndex: (column: string, row: number) => number;
}

interface MenuItemsActions {
  removeRows: (indexes: number[]) => void;
}

export interface DatagridRenderHeaderProps {
  isFullscreenOpen: boolean;
  toggleFullscreen: () => void;
  addRowOnDatagrid: () => void;
  isAnimationOpenFinished: boolean;
}

interface DatagridProps {
  fillHandle?: boolean;
  availableColumns: readonly AvailableColumn[];
  emptyText: string;
  getCellError: (item: Item, opts: GetCellContentOpts) => boolean;
  getCellContent: (item: Item, opts: GetCellContentOpts) => GridCell;
  getColumnTooltipContent?: (colIndex: number) => string;
  menuItems: (index: number) => CardMenuItem[];
  rows: number;
  loading?: boolean;
  selectionActions: (selection: number[], actions: MenuItemsActions) => ReactNode;
  onChange?: OnDatagridChange;
  onHeaderClicked?: (colIndex: number, event: HeaderClickedEventArgs) => void;
  renderColumnPicker?: () => ReactElement;
  renderRowActions?: (index: number) => ReactElement;
  rowActionBarWidth?: number;
  onRowClick?: (item: Item) => void;
  onColumnMoved?: (startIndex: number, endIndex: number) => void;
  onColumnResize?: (column: GridColumn, newSize: number) => void;
  onRowSelectionChange?: (rowsId: number[], clearSelection: () => void) => void;
  readonly?: boolean;
  hasRowHover?: boolean;
  rowMarkers?: DataEditorProps["rowMarkers"];
  freezeColumns?: DataEditorProps["freezeColumns"];
  verticalBorder?: DataEditorProps["verticalBorder"];
  columnSelect?: DataEditorProps["columnSelect"];
  showEmptyDatagrid?: boolean;
  rowAnchor?: (item: Item) => string;
  rowHeight?: number | ((index: number) => number);
  actionButtonPosition?: "left" | "right";
  recentlyAddedColumn?: string | null; // Enables scroll to recently added column
  onClearRecentlyAddedColumn?: () => void;
  renderHeader?: (props: DatagridRenderHeaderProps) => ReactNode;
  navigatorOpts?: NavigatorOpts;
  showTopBorder?: boolean;
  themeOverride?: Partial<Theme>;
}

const Datagrid = ({
  availableColumns,
  emptyText,
  getCellContent,
  getCellError,
  menuItems,
  rows,
  selectionActions,
  onHeaderClicked,
  onChange,
  renderColumnPicker,
  renderRowActions,
  rowActionBarWidth = 36,
  onRowClick,
  getColumnTooltipContent,
  readonly = false,
  rowMarkers = "checkbox",
  freezeColumns = 1,
  verticalBorder,
  columnSelect = "none",
  onColumnMoved,
  onColumnResize,
  showEmptyDatagrid = false,
  loading,
  rowAnchor,
  hasRowHover = false,
  onRowSelectionChange,
  actionButtonPosition = "left",
  recentlyAddedColumn,
  onClearRecentlyAddedColumn,
  rowHeight = cellHeight,
  renderHeader,
  navigatorOpts,
  showTopBorder = true,
  themeOverride,
  ...datagridProps
}: DatagridProps): ReactElement => {
  const classes = useStyles({ actionButtonPosition });
  const { themeValues, theme } = useTheme();
  const datagridTheme = useDatagridTheme(readonly, readonly);
  const finalTheme = useMemo(
    () => ({ ...datagridTheme, ...themeOverride }),
    [datagridTheme, themeOverride],
  );
  const rowMarkerTheme = useMemo(
    () => ({
      accentColor: themeValues.colors.text.default1,
    }),
    [themeValues],
  );
  const editor = useRef<DataEditorRef | null>(null);
  const customRenderers = useCustomCellRenderers();
  const { scrolledToRight } = useScrollRight();
  const fullScreenClasses = useFullScreenStyles(classes);
  const { isOpen, isAnimationOpenFinished, toggle } = useFullScreenMode();
  const { clearTooltip, tooltip, setTooltip } = useTooltipContainer();
  const [selection, setSelection] = useState<GridSelection>();
  const [areCellsDirty, setCellsDirty] = useState(true);

  const { rowAnchorRef, setRowAnchorRef, setAnchorPosition } = useRowAnchor({
    getRowAnchorUrl: rowAnchor,
    rowMarkers,
    availableColumns,
  });
  const rowAnchorHandler = useRowAnchorHandler(navigatorOpts);

  const { handleRowHover, hoverRow } = useRowHover({
    hasRowHover,
    onRowHover: setAnchorPosition,
  });

  // Allow to listen to which row is selected and notfiy parent component
  useEffect(() => {
    if (onRowSelectionChange && selection) {
      // Second parameter is callback to clear selection from parent component
      onRowSelectionChange(Array.from(selection.rows), () => {
        setSelection(undefined);
      });
    }
  }, [onRowSelectionChange, selection]);
  useEffect(() => {
    if (recentlyAddedColumn && editor.current) {
      const columnIndex = availableColumns.findIndex(column => column.id === recentlyAddedColumn);

      if (columnIndex === -1) {
        return;
      }

      const datagridScroll = editor.current.scrollTo;

      datagridScroll(columnIndex, 0, "horizontal", 0, 0, { hAlign: "start" });

      // This is required to disable scroll whenever availableColumns
      // change (e.g. columns resized, reordered, removed)
      if (typeof onClearRecentlyAddedColumn === "function") {
        onClearRecentlyAddedColumn();
      }
    }
  }, [recentlyAddedColumn, availableColumns, editor]);
  usePortalClasses({ className: classes.portal });

  const { added, onCellEdited, onRowsRemoved, changes, removed, getChangeIndex, onRowAdded } =
    useDatagridChange(availableColumns, rows, onChange, (areCellsDirty: boolean) =>
      setCellsDirty(areCellsDirty),
    );
  const rowsTotal = rows - removed.length + added.length;
  const hasMenuItem = !!menuItems(0).length;
  const hasColumnGroups = availableColumns.some(col => col.group);
  const handleGetCellContent = useCallback(
    ([column, row]: Item): GridCell => {
      const item = [column, row] as const;
      const opts = { changes, added, removed, getChangeIndex };
      const columnId = availableColumns[column]?.id;
      const changed = !!changes.current[getChangeIndex(columnId, row)]?.data;

      return {
        ...getCellContent(item, opts),
        ...(changed && areCellsDirty
          ? {
              themeOverride: {
                bgCell:
                  // Consider moving this to MacawUI if we need it in other places
                  theme === "defaultLight" ? "hsla(215, 100%, 96%, 1)" : "hsla(215, 100%, 21%, 1)",
              },
            }
          : {}),
        ...(getCellError(item, opts)
          ? {
              themeOverride: {
                bgCell: themeValues.colors.background.critical1,
              },
            }
          : {}),
      };
    },
    [
      changes,
      added,
      removed,
      getChangeIndex,
      availableColumns,
      getCellContent,
      areCellsDirty,
      themeValues.colors.background.accent1,
      themeValues.colors.background.critical1,
      getCellError,
    ],
  );
  const handleOnCellEdited = useCallback(
    ([column, row]: Item, newValue: EditableGridCell): void => {
      onCellEdited([column, row], newValue);

      if (!editor.current) {
        return;
      }

      editor.current.updateCells(
        range(availableColumns.length).map(offset => ({
          cell: [column + offset, row],
        })),
      );
    },
    [onCellEdited, availableColumns],
  );

  const handleCellClick = useCallback(
    (item: Item, args: CellClickedEventArgs) => {
      if (preventRowClickOnSelectionCheckbox(rowMarkers, item[0])) {
        return;
      }

      const intentToOpenInNewTab = args.metaKey || args.ctrlKey;

      /**
       * Assume rowClick is standard click, if ctrl/cmd is used, let it pass to anchor logic and allow to open in a new tab
       *
       * TODO: This can be refactored, but every Datagrid is used a little different way
       */
      if (onRowClick && !intentToOpenInNewTab) {
        onRowClick(item);

        return;
      }

      if (getCellAction(availableColumns, item[0])) {
        return;
      }

      handleRowHover(args);

      if (rowAnchorRef.current) {
        /**
         * Dispatch click event with modifier keys preserved
         * This allows CMD/CTRL+click to open in new tab
         */
        const clickEvent = new MouseEvent("click", {
          metaKey: args.metaKey,
          ctrlKey: args.ctrlKey,
          shiftKey: args.shiftKey,
          bubbles: true,
        });

        rowAnchorRef.current.dispatchEvent(clickEvent);
      }
    },
    [rowMarkers, onRowClick, handleRowHover, rowAnchorRef],
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

      const overrideTheme: Partial<Theme> = {
        /*
          Grid-specific colors. Transparency matters when we highlight entire row.
        */
        bgCell: theme === "defaultLight" ? "hsla(220, 18%, 97%, 1)" : "hsla(211, 32%, 19%, 1)",
        bgCellMedium: themeValues.colors.background.default1Hovered,
      };

      if (readonly) {
        overrideTheme.accentLight = themeValues.colors.background.default1;
      }

      return overrideTheme;
    },
    [hoverRow, readonly, themeValues],
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
  const drawHeader: DrawHeaderCallback = useCallback(args => {
    const { ctx, rect, isSelected, spriteManager, theme, column } = args;

    if (isSelected && column.id !== "empty") {
      const iconSize = 16;
      const padding = 8;
      const x = rect.x + rect.width - iconSize - padding;
      const y = rect.y + (rect.height - iconSize) / 2;

      spriteManager.drawSprite("gripVertical", "normal", ctx, x, y, iconSize, theme);
    }

    return false;
  }, []);
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

      if (!onColumnResize) {
        return;
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

      if (!onColumnMoved) {
        return;
      }

      onColumnMoved(startIndex, endIndex);
    },
    [clearTooltip, onColumnMoved, tooltip],
  );
  const selectionActionsComponent = useMemo(
    () =>
      selection?.rows && selection?.rows.length > 0
        ? selectionActions(Array.from(selection.rows), {
            removeRows: handleRemoveRows,
          })
        : null,
    [selection, selectionActions, handleRemoveRows],
  );
  // Hide the link when scrolling over it so that the scroll/wheel events go through to the Datagrid
  // Show the link quickly after the last scroll/wheel event
  const hideLinkAndShowAfterDelay = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout> | null = null;

      return () => {
        if (timer) {
          clearTimeout(timer);
        }

        if (rowAnchorRef.current) {
          rowAnchorRef.current.style.display = "none";
        }

        timer = setTimeout(() => {
          if (rowAnchorRef.current) {
            rowAnchorRef.current.style.display = "block";
          }
        }, 100);
      };
    })(),
    [rowAnchorRef],
  );

  if (loading) {
    return (
      <Box data-test-id="datagrid-loader" display="flex" justifyContent="center" marginY={9}>
        <SaleorThrobber />
      </Box>
    );
  }

  return (
    <FullScreenContainer open={isOpen} className={fullScreenClasses.fullScreenContainer}>
      <PreventHistoryBack __height={isOpen ? "100%" : "auto"}>
        <DashboardCard position="relative" __height={isOpen ? "100%" : "auto"} gap={0}>
          {renderHeader?.({
            toggleFullscreen: toggle,
            addRowOnDatagrid: onRowAdded,
            isFullscreenOpen: isOpen,
            isAnimationOpenFinished,
          })}
          <DashboardCard.Content
            height="100%"
            display="flex"
            flexDirection="column"
            paddingX={0}
            data-test-id="list"
          >
            {rowsTotal > 0 || showEmptyDatagrid ? (
              <>
                {selection?.rows && selection?.rows.length > 0 && selectionActionsComponent && (
                  <div className={classes.actionBtnBar}>{selectionActionsComponent}</div>
                )}
                <div className={classes.editorContainer}>
                  <Box
                    backgroundColor="default1"
                    borderTopWidth={showTopBorder ? 1 : 0}
                    borderTopStyle="solid"
                    borderColor="default1"
                  />
                  <DataEditor
                    {...datagridProps}
                    customRenderers={customRenderers}
                    verticalBorder={verticalBorder}
                    headerIcons={headerIcons}
                    drawHeader={drawHeader}
                    theme={finalTheme}
                    drawFocusRing={false}
                    rowMarkerTheme={rowMarkerTheme}
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
                    rowHeight={rowHeight}
                    headerHeight={cellHeight}
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
                        style={{ width: rowActionBarWidth }}
                      >
                        <div
                          className={clsx(classes.rowActionBarShadow, {
                            [classes.rowActionBarShadowActive]: !scrolledToRight && hasMenuItem,
                          })}
                        />
                        <div
                          className={clsx(classes.columnPicker, {
                            [classes.columnPickerBackground]: !hasMenuItem,
                          })}
                        >
                          {renderColumnPicker ? renderColumnPicker() : null}
                        </div>
                        {hasColumnGroups && (
                          <div
                            className={clsx(classes.rowAction, classes.rowColumnGroup, {
                              [classes.rowActionScrolledToRight]: scrolledToRight,
                            })}
                          />
                        )}
                        {hasMenuItem &&
                          Array(rowsTotal)
                            .fill(0)
                            .map((_, index) =>
                              renderRowActions ? (
                                renderRowActions(index)
                              ) : (
                                <RowActions
                                  key={`row-actions-${index}`}
                                  menuItems={menuItems(index)}
                                  disabled={index >= rowsTotal - added.length}
                                />
                              ),
                            )}
                      </div>
                    }
                    rowMarkerWidth={48}
                  />
                  {/* FIXME: https://github.com/glideapps/glide-data-grid/issues/505 */}
                  {hasColumnGroups && <div className={classes.columnGroupFixer} />}
                </div>
              </>
            ) : (
              <Box padding={6} textAlign="center">
                <Text data-test-id="empty-data-grid-text" size={3}>
                  {emptyText}
                </Text>
              </Box>
            )}
          </DashboardCard.Content>
        </DashboardCard>
        <TooltipContainer
          clearTooltip={clearTooltip}
          bounds={tooltip?.bounds}
          title={tooltip?.title}
        />
        {rowAnchor && (
          <a
            ref={setRowAnchorRef}
            style={{ position: "absolute", top: "-1000px", left: "-1000px" }}
            tabIndex={-1}
            aria-hidden={true}
            onWheelCapture={hideLinkAndShowAfterDelay}
            onClick={rowAnchorHandler}
          />
        )}
      </PreventHistoryBack>
    </FullScreenContainer>
  );
};

export default Datagrid;
