import { type ChannelData } from "@dashboard/channels/utils";
import { Datagrid, type GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import {
  type DatagridChangeOpts,
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type ProductVariantBulkCreateInput, type WarehouseFragment } from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { type ReactElement, useCallback, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "../messages";
import {
  applyStagedCreatesDatagridOpts,
  buildStagedCreatesColumns,
  getStagedCreateCellContent,
} from "./stagedCreatesDatagrid";
import { stagedVariantCreatesDraftMessages as draftMessages } from "./StagedVariantCreatesDraft.messages";

interface StagedVariantCreatesDatagridProps {
  creates: ProductVariantBulkCreateInput[];
  channels: ChannelData[];
  warehouses: WarehouseFragment[];
  onReplaceCreates: (creates: ProductVariantBulkCreateInput[]) => void;
  onRemoveIndexes: (indexes: number[]) => void;
  onClearAll: () => void;
}

export const StagedVariantCreatesDatagrid = ({
  creates,
  channels,
  warehouses,
  onReplaceCreates,
  onRemoveIndexes,
  onClearAll,
}: StagedVariantCreatesDatagridProps): ReactElement | null => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();
  const [selectedCount, setSelectedCount] = useState(0);
  const selectedIndexesRef = useRef<number[]>([]);
  const clearSelectionRef = useRef<(() => void) | null>(null);
  // Keep latest creates for rapid edits before the parent re-renders.
  const createsRef = useRef(creates);

  createsRef.current = creates;

  const columns = useMemo(
    () => buildStagedCreatesColumns({ intl, channels, warehouses }),
    [channels, intl, warehouses],
  );

  const getCellContent = useCallback(
    ([column, row]: readonly [number, number], opts: GetCellContentOpts) =>
      getStagedCreateCellContent({
        creates: createsRef.current,
        columns,
        channels,
        changes: opts.changes,
        getChangeIndex: opts.getChangeIndex,
      })([column, row]),
    [channels, columns],
  );

  const getCellError = useCallback(() => false, []);
  const menuItems = useCallback(() => [], []);
  const selectionActions = useCallback(() => null, []);

  const handleChange = useCallback(
    (opts: DatagridChangeOpts) => {
      const next = applyStagedCreatesDatagridOpts(createsRef.current, opts);

      createsRef.current = next;
      onReplaceCreates(next);
    },
    [onReplaceCreates],
  );

  const resetSelection = useCallback(() => {
    clearSelectionRef.current?.();
    setSelectedCount(0);
    selectedIndexesRef.current = [];
  }, []);

  const handleClearAll = useCallback(() => {
    resetSelection();
    datagrid.clear();
    onClearAll();
  }, [datagrid, onClearAll, resetSelection]);

  const handleRowSelectionChange = useCallback((rows: number[], clearSelection: () => void) => {
    selectedIndexesRef.current = rows;
    clearSelectionRef.current = clearSelection;
    setSelectedCount(rows.length);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    onRemoveIndexes(selectedIndexesRef.current);
    resetSelection();
    datagrid.clear();
  }, [datagrid, onRemoveIndexes, resetSelection]);

  const renderHeader = useCallback(
    () => (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingX={6}
        paddingY={5}
      >
        <Text size={6} fontWeight="medium">
          <FormattedMessage {...draftMessages.title} values={{ count: creates.length }} />
        </Text>
        <Box display="flex" alignItems="center" gap={2}>
          {selectedCount > 0 && (
            <Button
              variant="secondary"
              size="small"
              onClick={handleDeleteSelected}
              data-test-id="staged-variant-creates-remove-selected"
            >
              <FormattedMessage {...messages.deleteSelected} values={{ count: selectedCount }} />
            </Button>
          )}
          <Button
            variant="secondary"
            size="small"
            onClick={handleClearAll}
            data-test-id="staged-variant-creates-clear-all"
          >
            <FormattedMessage {...draftMessages.clearAll} />
          </Button>
        </Box>
      </Box>
    ),
    [creates.length, handleClearAll, handleDeleteSelected, selectedCount],
  );

  if (creates.length === 0) {
    return null;
  }

  return (
    <Box marginTop={4} data-test-id="staged-variant-creates-draft">
      <DatagridChangeStateContext.Provider value={datagrid}>
        <Datagrid
          availableColumns={columns}
          emptyText=""
          getCellContent={getCellContent}
          getCellError={getCellError}
          menuItems={menuItems}
          rows={creates.length}
          selectionActions={selectionActions}
          onChange={handleChange}
          onRowSelectionChange={handleRowSelectionChange}
          rowMarkers="checkbox"
          freezeColumns={1}
          rowActionBarWidth={0}
          renderHeader={renderHeader}
        />
      </DatagridChangeStateContext.Provider>
    </Box>
  );
};
