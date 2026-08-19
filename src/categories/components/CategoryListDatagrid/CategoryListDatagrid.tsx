import { CategoryListUrlSortField, categoryUrl } from "@dashboard/categories/urls";
import {
  type CategoryListRow,
  isCategoryListCategoryRow,
} from "@dashboard/categories/views/CategoryList/types";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { Datagrid } from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { DatagridPagination } from "@dashboard/components/TablePagination";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { type PageListProps, type SortPage } from "@dashboard/types";
import {
  CompactSelection,
  type GridSelection,
  type Item,
  type Theme,
} from "@glideapps/glide-data-grid";
import { useTheme } from "@saleor/macaw-ui-next";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import {
  categoryListExpandColumn,
  categoryListSidebarColumnsAdapter,
  categoryListStaticColumnsAdapter,
  createGetCellContent,
  type SidebarColumnWidths,
} from "./datagrid";
import { messages } from "./messages";

interface CategoryListDatagridProps
  extends PageListProps,
    Partial<SortPage<CategoryListUrlSortField>> {
  rows: CategoryListRow[];
  selectedCategoriesIds?: string[];
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  onSelectedCategoriesIdsChange?: (ids: string[]) => void;
  selectionActionButton?: ReactNode | null;
  hasRowHover?: boolean;
  isCategoryExpanded?: (categoryId: string) => boolean;
  onCategoryExpandToggle?: (categoryId: string) => void;
  isCategoryChildrenLoading?: (categoryId: string) => boolean;
  isLoadingMoreSubcategories?: (parentId: string) => boolean;
  getCategoryDepth?: (categoryId: string) => number;
  onLoadMoreSubcategories?: (parentId: string) => void;
  hidePagination?: boolean;
  variant?: "default" | "sidebar";
}

/**
 * Sidebar row-marker column. Glide centers its ~14px checkbox in this width,
 * so left inset ≈ (36 − 14) / 2 ≈ 11px while the grid stays full-bleed.
 */
const SIDEBAR_ROW_MARKER_WIDTH = 36;
/**
 * Compact row/header height for the sidebar. Paired with
 * `cellVerticalPadding: 11` so Glide draws min(18, 36 − 22) = 14px checkboxes
 * (closer to macaw `Checkbox` than the default ~18px).
 */
const SIDEBAR_ROW_HEIGHT = 36;
const SIDEBAR_NAME_MIN_WIDTH = 96;
const SIDEBAR_COUNT_COLUMN_MIN_WIDTH = 72;

const DEFAULT_SIDEBAR_COLUMN_WIDTHS: SidebarColumnWidths = {
  name: SIDEBAR_NAME_MIN_WIDTH,
  subcategories: SIDEBAR_COUNT_COLUMN_MIN_WIDTH,
  products: SIDEBAR_COUNT_COLUMN_MIN_WIDTH,
};

const SIDEBAR_SELECTED_COLUMNS = ["name", "subcategories", "products"] as const;

const measureSidebarColumnWidths = (
  containerWidth: number,
  chromeWidth: number,
): SidebarColumnWidths => {
  const available = Math.max(0, containerWidth - chromeWidth);
  const countColumnWidth = Math.min(SIDEBAR_COUNT_COLUMN_MIN_WIDTH, Math.floor(available * 0.22));
  const nameWidth = Math.max(SIDEBAR_NAME_MIN_WIDTH, available - countColumnWidth * 2);

  return {
    name: nameWidth,
    subcategories: countColumnWidth,
    products: countColumnWidth,
  };
};

export const CategoryListDatagrid = ({
  sort,
  onSort,
  rows,
  selectedCategoriesIds = [],
  disabled,
  onSelectCategoriesIds,
  onSelectedCategoriesIdsChange,
  settings,
  onUpdateListSettings,
  selectionActionButton = null,
  hasRowHover = true,
  isCategoryExpanded,
  onCategoryExpandToggle,
  isCategoryChildrenLoading,
  isLoadingMoreSubcategories,
  getCategoryDepth,
  onLoadMoreSubcategories,
  hidePagination = false,
  variant = "default",
}: CategoryListDatagridProps): JSX.Element => {
  const isSidebar = variant === "sidebar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [sidebarColumnWidths, setSidebarColumnWidths] = useState(DEFAULT_SIDEBAR_COLUMN_WIDTHS);
  const navigate = useNavigator();
  const location = useLocation();
  const { themeValues } = useTheme();
  const datagridState = useDatagridChangeState();
  const intl = useIntl();
  const sidebarRowMarkerTheme = useMemo(
    (): Partial<Theme> => ({
      // Glide: checkboxSize = min(18, rowHeight − 2 * cellVerticalPadding)
      cellVerticalPadding: 11,
      cellHorizontalPadding: 4,
    }),
    [],
  );
  const sidebarDatagridTheme = useMemo(
    (): Partial<Theme> => ({
      bgHeader: themeValues.colors.background.default1,
      bgHeaderHasFocus: themeValues.colors.background.default1,
      bgHeaderHovered: themeValues.colors.background.default1,
      textHeader: themeValues.colors.text.default2,
      textHeaderSelected: themeValues.colors.text.default2,
      headerFontStyle: `${themeValues.fontWeight.regular} ${themeValues.fontSize[2]}`,
    }),
    [themeValues],
  );
  const memoizedStaticColumns = useMemo(
    () =>
      isSidebar
        ? categoryListSidebarColumnsAdapter(intl, sidebarColumnWidths)
        : categoryListStaticColumnsAdapter(intl, sort),
    [intl, isSidebar, sidebarColumnWidths, sort],
  );
  const isSelectionControlled = !!onSelectedCategoriesIdsChange;
  const controlledSelection = useMemo<GridSelection>(() => {
    const rowIndexByCategoryId = rows.reduce<Record<string, number>>((acc, row, index) => {
      if (isCategoryListCategoryRow(row)) {
        acc[row.category.id] = index;
      }

      return acc;
    }, {});
    const selectedRows = selectedCategoriesIds.reduce((selection, categoryId) => {
      const rowIndex = rowIndexByCategoryId[categoryId];

      if (rowIndex === undefined) {
        return selection;
      }

      return selection.add(rowIndex);
    }, CompactSelection.empty());

    return {
      columns: CompactSelection.empty(),
      rows: selectedRows,
    };
  }, [rows, selectedCategoriesIds]);
  const handleControlledSelectionChange = useCallback(
    (selection: GridSelection | undefined) => {
      if (!onSelectedCategoriesIdsChange) {
        return;
      }

      const selectedIds = (selection?.rows.toArray() ?? [])
        .map(rowIndex => {
          const row = rows[rowIndex];

          return isCategoryListCategoryRow(row) ? row.category.id : undefined;
        })
        .filter((id): id is string => !!id);

      onSelectedCategoriesIdsChange(selectedIds);
    },
    [rows, onSelectedCategoriesIdsChange],
  );
  const handleColumnChange = useCallback(
    (picked: string[]) => {
      if (onUpdateListSettings) {
        onUpdateListSettings("columns", picked.filter(Boolean));
      }
    },
    [onUpdateListSettings],
  );
  const {
    handlers,
    selectedColumns,
    staticColumns,
    visibleColumns: persistedVisibleColumns,
  } = useColumns({
    gridName: isSidebar ? "category_list_sidebar_v2" : "category_list",
    staticColumns: memoizedStaticColumns,
    selectedColumns: isSidebar ? [...SIDEBAR_SELECTED_COLUMNS] : (settings?.columns ?? []),
    onSave: handleColumnChange,
  });
  const shouldShowExpandColumn = Boolean(isCategoryExpanded && onCategoryExpandToggle);
  const sidebarChromeWidth = useMemo(
    () => SIDEBAR_ROW_MARKER_WIDTH + (shouldShowExpandColumn ? categoryListExpandColumn.width : 0),
    [shouldShowExpandColumn],
  );
  const visibleColumns = useMemo(() => {
    if (!isSidebar) {
      return persistedVisibleColumns;
    }

    return persistedVisibleColumns.map(column => {
      if (!column) {
        return column;
      }

      if (column.id === "name") {
        return { ...column, width: sidebarColumnWidths.name };
      }

      if (column.id === "subcategories") {
        return { ...column, width: sidebarColumnWidths.subcategories };
      }

      if (column.id === "products") {
        return { ...column, width: sidebarColumnWidths.products };
      }

      return column;
    });
  }, [isSidebar, persistedVisibleColumns, sidebarColumnWidths]);
  const availableColumns = useMemo(
    () => (shouldShowExpandColumn ? [categoryListExpandColumn, ...visibleColumns] : visibleColumns),
    [shouldShowExpandColumn, visibleColumns],
  );
  const formatLoadMoreLabel = useCallback(
    (remainingCount: number) =>
      intl.formatMessage(messages.loadMoreSubcategories, { count: remainingCount }),
    [intl],
  );
  const loadMoreCellThemeOverride = useMemo(
    () => ({
      baseFontStyle: `${themeValues.fontWeight.regular} ${themeValues.fontSize[2]}`,
      textDark: themeValues.colors.text.accent1,
    }),
    [themeValues],
  );
  const countCellThemeOverride = useMemo(
    () =>
      isSidebar
        ? {
            textDark: themeValues.colors.text.default2,
          }
        : undefined,
    [isSidebar, themeValues.colors.text.default2],
  );
  const getRowThemeOverride = useCallback(
    (row: number) => {
      if (rows[row]?.type !== "load-more") {
        return undefined;
      }

      const background = themeValues.colors.background.default1;

      return {
        bgCell: background,
        accentColor: background,
        accentLight: background,
        accentFg: background,
      };
    },
    [rows, themeValues.colors.background.default1],
  );
  const getCellContent = useMemo(
    () =>
      createGetCellContent(rows, availableColumns, {
        isCategoryExpanded,
        isCategoryChildrenLoading,
        isLoadingMoreSubcategories,
        getCategoryDepth,
        formatLoadMoreLabel,
        loadMoreCellThemeOverride,
        countCellThemeOverride,
      }),
    [
      rows,
      availableColumns,
      isCategoryExpanded,
      isCategoryChildrenLoading,
      isLoadingMoreSubcategories,
      getCategoryDepth,
      formatLoadMoreLabel,
      countCellThemeOverride,
      loadMoreCellThemeOverride,
    ],
  );
  const handleRowSelectionChange = useCallback(
    (selectedRows: number[], clearSelection: () => void) => {
      const categoryRowIndices = selectedRows.filter(rowIndex =>
        isCategoryListCategoryRow(rows[rowIndex]),
      );

      onSelectCategoriesIds(categoryRowIndices, clearSelection);
    },
    [onSelectCategoriesIds, rows],
  );
  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      const rowData = rows[row];

      if (!isCategoryListCategoryRow(rowData)) {
        return "";
      }

      return categoryUrl(rowData.category.id);
    },
    [rows],
  );
  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnId = availableColumns[col]?.id;

      if (sort === undefined || !onSort || !columnId) {
        return;
      }

      switch (columnId) {
        case CategoryListUrlSortField.name:
        case CategoryListUrlSortField.productCount:
        case CategoryListUrlSortField.subcategoryCount:
          onSort(columnId);
          break;
      }
    },
    [availableColumns, onSort, sort],
  );
  const handleRowClick = useCallback(
    ([col, row]: Item) => {
      const rowData = rows[row];

      if (!rowData) {
        return;
      }

      if (rowData.type === "load-more") {
        const isLoadingMore = isLoadingMoreSubcategories?.(rowData.parentId) ?? false;

        if (availableColumns[col]?.id === "name" && onLoadMoreSubcategories && !isLoadingMore) {
          onLoadMoreSubcategories(rowData.parentId);
        }

        return;
      }

      const clickedColumnId = availableColumns[col]?.id;

      if (clickedColumnId === "expand") {
        const hasSubcategories = (rowData.category.children?.totalCount ?? 0) > 0;
        const isLoading = isCategoryChildrenLoading?.(rowData.category.id) ?? false;

        if (hasSubcategories && !isLoading && onCategoryExpandToggle) {
          onCategoryExpandToggle(rowData.category.id);
        }

        return;
      }

      navigate(categoryUrl(rowData.category.id));
    },
    [
      availableColumns,
      rows,
      navigate,
      onCategoryExpandToggle,
      isCategoryChildrenLoading,
      isLoadingMoreSubcategories,
      onLoadMoreSubcategories,
    ],
  );
  const handleColumnMove = useCallback(
    (startIndex: number, endIndex: number) => {
      if (!shouldShowExpandColumn) {
        handlers.onMove(startIndex, endIndex);

        return;
      }

      if (startIndex === 0 || endIndex === 0) {
        return;
      }

      handlers.onMove(startIndex - 1, endIndex - 1);
    },
    [handlers, shouldShowExpandColumn],
  );
  const handleColumnResize = useCallback(
    (...args: Parameters<typeof handlers.onResize>) => {
      if (isSidebar) {
        return;
      }

      const [column] = args;

      if (column.id === "expand") {
        return;
      }

      handlers.onResize(...args);
    },
    [handlers, isSidebar],
  );

  useEffect(
    function measureSidebarNameColumnWidth() {
      if (!isSidebar || !containerRef.current) {
        return undefined;
      }

      const measureSidebarWidth = (): void => {
        const width = containerRef.current?.clientWidth ?? 0;

        setSidebarColumnWidths(measureSidebarColumnWidths(width, sidebarChromeWidth));
      };

      measureSidebarWidth();

      const observer = new ResizeObserver(measureSidebarWidth);

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    },
    [isSidebar, sidebarChromeWidth],
  );

  return (
    <div ref={containerRef}>
      <DatagridChangeStateContext.Provider value={datagridState}>
        <Datagrid
          readonly
          hasRowHover={hasRowHover}
          loading={disabled}
          columnSelect={sort !== undefined ? "single" : undefined}
          verticalBorder={false}
          rowMarkers="checkbox-visible"
          rowMarkerWidth={isSidebar ? SIDEBAR_ROW_MARKER_WIDTH : undefined}
          rowMarkerTheme={isSidebar ? sidebarRowMarkerTheme : undefined}
          headerHeight={isSidebar ? SIDEBAR_ROW_HEIGHT : undefined}
          rowHeight={isSidebar ? SIDEBAR_ROW_HEIGHT : undefined}
          availableColumns={availableColumns}
          rows={rows?.length ?? 0}
          getCellContent={getCellContent}
          getCellError={() => false}
          emptyText={intl.formatMessage(messages.noData)}
          onHeaderClicked={handleHeaderClick}
          rowAnchor={handleRowAnchor}
          menuItems={() => []}
          onRowClick={handleRowClick}
          actionButtonPosition="right"
          selectionActions={() => selectionActionButton}
          onColumnResize={handleColumnResize}
          onColumnMoved={handleColumnMove}
          onRowSelectionChange={handleRowSelectionChange}
          getRowThemeOverride={getRowThemeOverride}
          controlledSelection={isSelectionControlled ? controlledSelection : undefined}
          onControlledSelectionChange={
            isSelectionControlled ? handleControlledSelectionChange : undefined
          }
          rowActionBarWidth={isSidebar ? 0 : undefined}
          showTopBorder={!isSidebar}
          smoothScrollX={!isSidebar}
          themeOverride={isSidebar ? sidebarDatagridTheme : undefined}
          renderColumnPicker={
            isSidebar
              ? undefined
              : () => (
                  <ColumnPicker
                    onToggle={handlers.onToggle}
                    selectedColumns={selectedColumns}
                    staticColumns={staticColumns}
                  />
                )
          }
          navigatorOpts={{ state: getPrevLocationState(location) }}
        />

        {!hidePagination ? (
          <DatagridPagination
            component="div"
            colSpan={1}
            settings={settings}
            disabled={disabled}
            onUpdateListSettings={onUpdateListSettings}
          />
        ) : null}
      </DatagridChangeStateContext.Provider>
    </div>
  );
};
