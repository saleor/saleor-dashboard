import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type PageWhereInput, type SearchPagesQuery } from "@dashboard/graphql";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import {
  type Container,
  type DialogProps,
  type FetchMoreProps,
  type RelayToFlat,
} from "@dashboard/types";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, { type AssignContainerDialogProps } from "../AssignContainerDialog";
import {
  type InitialPageConstraints,
  ModalPageFilterProvider,
  useModalPageFilterContext,
} from "../ModalFilters/entityConfigs/ModalPageFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";

interface AssignModelDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  loading: boolean;
  onFilterChange?: (filterVariables: PageWhereInput, query: string) => void;
  onSubmit: (data: Container[]) => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  excludedFilters?: string[];
  initialConstraints?: InitialPageConstraints;
}

const AssignModelDialogInner = ({
  pages,
  onFilterChange,
  labels: labelOverrides,
  open,
  onClose,
  ...restProps
}: Omit<AssignModelDialogProps, "excludedFilters" | "initialConstraints">) => {
  const intl = useIntl();
  const { combinedFilters, clearFilters } = useModalPageFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => onFilterChange?.(filters.where, query),
  });

  const containers: Container[] = useMemo(
    () => pages?.map(page => ({ id: page.id, name: page.title })) ?? [],
    [pages],
  );

  const labels: AssignContainerDialogProps["labels"] = {
    title: intl.formatMessage(messages.assignModelDialogHeader),
    label: intl.formatMessage(messages.assignModelDialogSearch),
    placeholder: intl.formatMessage(messages.assignModelDialogContent),
    confirmBtn: intl.formatMessage(messages.assignModelDialogButton),
    ...labelOverrides,
  };

  const emptyMessage = query
    ? intl.formatMessage(messages.noModelsFound)
    : intl.formatMessage(messages.noModelsAvailable);

  return (
    <AssignContainerDialog
      {...restProps}
      containers={containers}
      labels={labels}
      open={open}
      onClose={onClose}
      onFetch={() => {}}
      emptyMessage={emptyMessage}
      search={{ query, onQueryChange, resetQuery }}
      filtersSlot={<ModalFilters />}
      onResetFilters={clearFilters}
    />
  );
};

const AssignModelDialog = ({
  excludedFilters,
  initialConstraints,
  ...props
}: AssignModelDialogProps) => (
  <ModalPageFilterProvider
    excludedFilters={excludedFilters}
    initialConstraints={initialConstraints}
  >
    <AssignModelDialogInner {...props} />
  </ModalPageFilterProvider>
);

AssignModelDialog.displayName = "AssignModelDialog";
export default AssignModelDialog;
