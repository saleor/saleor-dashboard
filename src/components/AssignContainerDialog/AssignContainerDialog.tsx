import { ConfirmButton, type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type Container, type DialogProps, type FetchMoreProps } from "@dashboard/types";
import { Box, Input, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { type ChangeEvent, type ReactNode } from "react";

import BackButton from "../BackButton";
import { MultiSelectionRows, SingleSelectionRows } from "./AssignContainerRows";
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
  selectionMode = "multiple",
  selectedId,
  filtersSlot,
  search: externalSearch,
  onResetFilters,
}: AssignContainerDialogProps) => {
  const { query, onQueryChange, handleClose } = useAssignContainerSearch({
    onFetch,
    externalSearch,
    onClose,
    onResetFilters,
  });

  const singleSelection = useAssignDialogSingleSelection({
    items: containers,
    selectedId,
    open,
    onSubmit,
  });

  const multiSelection = useAssignDialogMultiSelection({
    open,
    onSubmit,
  });

  const handleSubmit =
    selectionMode === "single" ? singleSelection.handleSubmit : multiSelection.handleSubmit;

  const itemCount = containers?.length ?? 0;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Header>{labels.title}</DashboardModal.Header>

        <Input
          name="query"
          value={query}
          onChange={onQueryChange}
          label={labels.label}
          placeholder={labels.placeholder}
          width="100%"
          endAdornment={loading ? <SaleorThrobber size={16} /> : undefined}
          autoComplete="off"
        />

        {filtersSlot}

        <InfiniteScroll
          id={scrollableTargetId}
          dataLength={itemCount}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          scrollableTarget={scrollableTargetId}
        >
          <Box display="flex" flexDirection="column">
            {!loading && itemCount === 0 && (
              <Text>
                <Text>{emptyMessage}</Text>
              </Text>
            )}
            {selectionMode === "single" ? (
              <RadioGroup
                value={singleSelection.selectedItemId}
                display="flex"
                flexDirection="column"
              >
                <SingleSelectionRows
                  containers={containers}
                  selectedItemId={singleSelection.selectedItemId}
                  onSelect={singleSelection.handleSelect}
                />
              </RadioGroup>
            ) : (
              <MultiSelectionRows
                containers={containers}
                isSelected={multiSelection.isSelected}
                onToggle={multiSelection.handleToggle}
              />
            )}
          </Box>
        </InfiniteScroll>

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} />
          <ConfirmButton
            data-test-id="assign-and-save-button"
            transitionState={confirmButtonState}
            type="submit"
            onClick={handleSubmit}
          >
            {labels.confirmBtn}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignContainerDialog.displayName = "AssignContainerDialog";

export default AssignContainerDialog;
