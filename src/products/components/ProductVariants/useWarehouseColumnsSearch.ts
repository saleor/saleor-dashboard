import {
  useWarehouseListQuery,
  type WarehouseFragment,
  type WarehouseListQueryVariables,
} from "@dashboard/graphql";
import { getColumnStock } from "@dashboard/products/utils/datagrid";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo, useState } from "react";

const WAREHOUSE_COLUMNS_PAGE_SIZE = 10;

// The API caps a single page at 100 nodes.
const SELECTED_WAREHOUSES_PAGE_SIZE = 100;

export interface WarehouseColumnsSearch {
  /** Warehouses on the current column picker page. */
  availableWarehouses: WarehouseFragment[] | undefined;
  /** Warehouses behind the selected warehouse columns, or undefined while they are still being resolved. */
  selectedWarehouses: WarehouseFragment[] | undefined;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onSearch: (query: string) => void;
  onNextPage: (query: string) => void;
  onPreviousPage: (query: string) => void;
}

interface UseWarehouseColumnsSearchProps {
  /** Warehouses already loaded for the default columns. */
  warehouses: WarehouseFragment[] | undefined;
  selectedColumns: string[] | undefined;
}

const getSelectedWarehouseIds = (selectedColumns: string[] | undefined): string[] =>
  (selectedColumns ?? []).map(getColumnStock).filter((id): id is string => id !== null);

const uniqueById = (warehouses: WarehouseFragment[]): WarehouseFragment[] => {
  const seen = new Set<string>();

  return warehouses.filter(warehouse => {
    if (seen.has(warehouse.id)) {
      return false;
    }

    seen.add(warehouse.id);

    return true;
  });
};

/**
 * Backs the warehouse category of the variants column picker with the API.
 *
 * The picker page is searched and paginated server side, so every warehouse can
 * be added as a column, not only the ones loaded for the default columns.
 * Selected warehouses that are not part of that default list are fetched by id
 * so their column headers resolve to a name.
 */
export const useWarehouseColumnsSearch = ({
  warehouses,
  selectedColumns,
}: UseWarehouseColumnsSearchProps): WarehouseColumnsSearch => {
  const [pickerVariables, setPickerVariables] = useState<WarehouseListQueryVariables>({
    first: WAREHOUSE_COLUMNS_PAGE_SIZE,
    filter: { search: "" },
  });
  const { data: pickerData } = useWarehouseListQuery({ variables: pickerVariables });
  const pageInfo = pickerData?.warehouses?.pageInfo;
  const availableWarehouses = useMemo(() => mapEdgesToItems(pickerData?.warehouses), [pickerData]);

  const selectedIds = useMemo(() => getSelectedWarehouseIds(selectedColumns), [selectedColumns]);
  const missingIds = useMemo(
    () => selectedIds.filter(id => !warehouses?.some(warehouse => warehouse.id === id)),
    [selectedIds, warehouses],
  );
  const { data: missingData, loading: missingLoading } = useWarehouseListQuery({
    variables: { first: SELECTED_WAREHOUSES_PAGE_SIZE, filter: { ids: missingIds } },
    skip: missingIds.length === 0,
  });

  const selectedWarehouses = useMemo(() => {
    if (!selectedColumns || !warehouses || (missingIds.length > 0 && missingLoading)) {
      return undefined;
    }

    const known = uniqueById([
      ...warehouses,
      ...(availableWarehouses ?? []),
      ...(mapEdgesToItems(missingData?.warehouses) ?? []),
    ]);

    return selectedIds
      .map(id => known.find(warehouse => warehouse.id === id))
      .filter((warehouse): warehouse is WarehouseFragment => warehouse !== undefined);
  }, [
    selectedColumns,
    warehouses,
    missingIds,
    missingLoading,
    availableWarehouses,
    missingData,
    selectedIds,
  ]);

  return {
    availableWarehouses,
    selectedWarehouses,
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPreviousPage: pageInfo?.hasPreviousPage ?? false,
    onSearch: (query: string) =>
      setPickerVariables({
        first: WAREHOUSE_COLUMNS_PAGE_SIZE,
        filter: { search: query },
      }),
    onNextPage: (query: string) =>
      setPickerVariables({
        first: WAREHOUSE_COLUMNS_PAGE_SIZE,
        after: pageInfo?.endCursor,
        filter: { search: query },
      }),
    onPreviousPage: (query: string) =>
      setPickerVariables({
        last: WAREHOUSE_COLUMNS_PAGE_SIZE,
        before: pageInfo?.startCursor,
        filter: { search: query },
      }),
  };
};
