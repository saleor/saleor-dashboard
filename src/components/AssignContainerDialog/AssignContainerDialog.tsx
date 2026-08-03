import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { useAssignPickerListDisplayState } from "@dashboard/hooks/useAssignPickerListDisplayState";
import { usePickerBackfill } from "@dashboard/hooks/usePickerBackfill";
import { useStalePickerList } from "@dashboard/hooks/useStalePickerList";
import { type Container, type DialogProps, type FetchMoreProps } from "@dashboard/types";
import { TableBody, TextField } from "@material-ui/core";
import { type ChangeEvent, type ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";

import { AssignPickerBackfillExhaustedRow } from "../AssignPickerBackfillExhausted/AssignPickerBackfillExhausted";
import { AssignPickerListEmptyStateRow } from "../AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoadingRow } from "../AssignPickerListLoading/AssignPickerListLoading";
import BackButton from "../BackButton";
import { MultiSelectionRows, SingleSelectionRows } from "./AssignContainerRows";
import { messages } from "./messages";
import { useAssignContainerSearch } from "./useAssignContainerSearch";
import { useAssignDialogMultiSelection } from "./useAssignDialogMultiSelection";
import { useAssignDialogSingleSelection } from "./useAssignDialogSingleSelection";

type Labels = Record<"confirmBtn" | "title" | "label" | "placeholder", string>;

export interface AssignContainerDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  labels: Labels;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  emptyMessage?: string;
  /**
   * Hide rows the caller has already used up (assigned to the voucher, the product, the
   * attribute). Filtering here rather than before `containers` lets the dialog notice when a
   * page has been filtered down to nothing and pull in the next one.
   */
  excludeContainer?: (container: Container) => boolean;
  /** Bumped when a new search starts, so backfill gets its page budget back. */
  backfillResetKey?: string;
  /** Shown instead of `emptyMessage` when exclusion emptied every loaded page. */
  backfillExhaustedMessage?: string;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  filtersSlot?: ReactNode;
  search?: {
    query: string;
    onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
    resetQuery: () => void;
  };
  onResetFilters?: () => void;
}

const scrollableTargetId = "assignDialogScrollableTarget";

const AssignContainerDialog = ({
  confirmButtonState,
  containers,
  hasMore,
  loading,
  labels,
  onClose,
  onFetch,
  onFetchMore,
  onSubmit,
  open,
  emptyMessage = "No objects found",
  excludeContainer,
  backfillResetKey,
  backfillExhaustedMessage,
  selectionMode = "multiple",
  selectedId,
  filtersSlot,
  search: externalSearch,
  onResetFilters,
}: AssignContainerDialogProps) => {
  const intl = useIntl();
  const { query, onQueryChange, handleClose } = useAssignContainerSearch({
    onFetch,
    externalSearch,
    onClose,
    onResetFilters,
  });

  // Single selection resolves the submitted item by id, so it needs the unfiltered list:
  // the current assignment is usually the very row exclusion would drop.
  const singleSelection = useAssignDialogSingleSelection({
    items: containers,
    selectedId,
    open,
    onSubmit,
  });

  const assignableContainers = useMemo(
    () =>
      excludeContainer ? containers.filter(container => !excludeContainer(container)) : containers,
    [containers, excludeContainer],
  );

  const backfill = usePickerBackfill({
    enabled: Boolean(excludeContainer),
    open,
    loading,
    hasMore: Boolean(hasMore),
    rawItemCount: containers.length,
    filteredItemCount: assignableContainers.length,
    onFetchMore,
    resetKey: backfillResetKey,
  });

  const displayedContainers = useStalePickerList(assignableContainers, loading, open);
  const itemCount = displayedContainers.length;
  const { showEmptyState: hasNothingToShow, showListLoading } = useAssignPickerListDisplayState(
    loading,
    itemCount,
  );

  // A page filtered down to nothing is not an empty backend. Claiming "nothing found" while
  // pages are still coming in — or while the user could ask for more — is the dead end that
  // makes a picker look empty once enough rows have been assigned.
  const showBackfillExhausted = hasNothingToShow && backfill.isExhausted;
  const showEmptyState = hasNothingToShow && !backfill.isBackfilling && !showBackfillExhausted;
  const showBackfillLoading = showListLoading || (hasNothingToShow && backfill.isBackfilling);

  // An empty list cannot be scrolled, so InfiniteScroll would call `next` in a loop. While
  // backfill owns that empty state, keep hasMore false so those fetches stay on the budgeted
  // path instead of storming the API.
  const allowScrollFetch = Boolean(hasMore) && itemCount > 0;

  const multiSelection = useAssignDialogMultiSelection({
    open,
    onSubmit,
  });

  const handleSubmit =
    selectionMode === "single" ? singleSelection.handleSubmit : multiSelection.handleSubmit;

  // Multi-selection always starts empty (already-assigned items are filtered
  // out of the list), so any selection counts as a change. Single-selection
  // starts at the current assignment, so only a different pick is a change.
  const selectedCount = multiSelection.selectedItems.length;
  const hasSelectionChanged =
    selectionMode === "single"
      ? singleSelection.selectedItemId !== (selectedId ?? "")
      : selectedCount > 0;
  const confirmLabel =
    selectionMode === "multiple" && selectedCount > 0
      ? intl.formatMessage(messages.assignCountedButton, {
          label: labels.confirmBtn,
          count: selectedCount,
        })
      : labels.confirmBtn;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="picker">
        <DashboardModal.PickerHeader
          toolbar={
            <>
              <TextField
                name="query"
                value={query}
                onChange={onQueryChange}
                label={labels.label}
                placeholder={labels.placeholder}
                fullWidth
                InputProps={{
                  autoComplete: "off",
                  endAdornment: loading && <SaleorThrobber size={16} />,
                }}
              />

              {filtersSlot}
            </>
          }
        >
          {labels.title}
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill id={scrollableTargetId}>
          <InfiniteScroll
            flush
            dataLength={itemCount}
            next={onFetchMore}
            hasMore={allowScrollFetch}
            scrollThreshold="100px"
            scrollableTarget={scrollableTargetId}
          >
            <ResponsiveTable bleed fillHeight>
              <TableBody>
                {showBackfillLoading ? (
                  <AssignPickerListLoadingRow colSpan={2} />
                ) : showBackfillExhausted ? (
                  <AssignPickerBackfillExhaustedRow
                    colSpan={2}
                    loading={loading}
                    message={
                      backfillExhaustedMessage ??
                      intl.formatMessage(messages.allLoadedItemsFilteredOut)
                    }
                    buttonLabel={intl.formatMessage(messages.loadMore)}
                    onLoadMore={backfill.resumeBackfill}
                  />
                ) : (
                  <>
                    {showEmptyState && (
                      <AssignPickerListEmptyStateRow colSpan={2}>
                        {emptyMessage}
                      </AssignPickerListEmptyStateRow>
                    )}
                    {selectionMode === "single" ? (
                      <SingleSelectionRows
                        containers={displayedContainers}
                        selectedItemId={singleSelection.selectedItemId}
                        onSelect={singleSelection.handleSelect}
                      />
                    ) : (
                      <MultiSelectionRows
                        containers={displayedContainers}
                        isSelected={multiSelection.isSelected}
                        onToggle={multiSelection.handleToggle}
                      />
                    )}
                  </>
                )}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} />
          <ConfirmButton
            data-test-id="assign-and-save-button"
            disabled={!hasSelectionChanged}
            transitionState={confirmButtonState}
            type="submit"
            onClick={handleSubmit}
          >
            {confirmLabel}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignContainerDialog.displayName = "AssignContainerDialog";

export default AssignContainerDialog;
