import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type CategoryFilterInput } from "@dashboard/graphql";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { type Container, type DialogProps, type FetchMoreProps } from "@dashboard/types";
import { useIntl } from "react-intl";

import AssignContainerDialog, { type AssignContainerDialogProps } from "../AssignContainerDialog";
import {
  ModalCategoryFilterProvider,
  useModalCategoryFilterContext,
} from "../ModalFilters/entityConfigs/ModalCategoryFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";

type Categories = {
  id: string;
  name: string;
}[];

interface AssignCategoryDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  categories: Categories | null;
  loading: boolean;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  onFilterChange?: (filterVariables: CategoryFilterInput, query: string) => void;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
}

const AssignCategoryDialogInner = ({
  categories,
  onFilterChange,
  onFetch,
  labels: labelOverrides,
  open,
  onClose,
  ...restProps
}: AssignCategoryDialogProps) => {
  const intl = useIntl();
  const { combinedFilters, clearFilters } = useModalCategoryFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => {
      if (onFilterChange) {
        onFilterChange(filters.filter, query);

        return;
      }

      onFetch(query);
    },
  });

  const labels: AssignContainerDialogProps["labels"] = {
    title: intl.formatMessage(messages.assignCategoryDialogHeader),
    label: intl.formatMessage(messages.assignCategoryDialogLabel),
    placeholder: intl.formatMessage(messages.assignCategoryDialogPlaceholder),
    confirmBtn: intl.formatMessage(messages.confirmButton),
    ...labelOverrides,
  };

  return (
    <AssignContainerDialog
      {...restProps}
      containers={categories ?? []}
      labels={labels}
      open={open}
      onClose={onClose}
      onFetch={() => {}}
      emptyMessage={intl.formatMessage(messages.noCategoriesFound)}
      search={{ query, onQueryChange, resetQuery }}
      filtersSlot={<ModalFilters />}
      onResetFilters={clearFilters}
    />
  );
};

const AssignCategoryDialog = (props: AssignCategoryDialogProps) => (
  <ModalCategoryFilterProvider>
    <AssignCategoryDialogInner {...props} />
  </ModalCategoryFilterProvider>
);

AssignCategoryDialog.displayName = "AssignCategoryDialog";
export default AssignCategoryDialog;
