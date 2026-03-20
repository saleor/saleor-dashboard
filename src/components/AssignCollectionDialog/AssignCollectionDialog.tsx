import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type CollectionFilterInput } from "@dashboard/graphql";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { type Container, type DialogProps, type FetchMoreProps } from "@dashboard/types";
import { useIntl } from "react-intl";

import AssignContainerDialog, { type AssignContainerDialogProps } from "../AssignContainerDialog";
import {
  ModalCollectionFilterProvider,
  useModalCollectionFilterContext,
} from "../ModalFilters/entityConfigs/ModalCollectionFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";

type Collections = {
  id: string;
  name: string;
}[];

export type AssignCollectionFilterChangeHandler = (
  filterVariables: CollectionFilterInput,
  channel: string | undefined,
  query: string,
) => void;

interface AssignCollectionDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  collections: Collections | null;
  loading: boolean;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  onFilterChange?: AssignCollectionFilterChangeHandler;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  excludedFilters?: string[];
}

const AssignCollectionDialogInner = ({
  collections,
  onFilterChange,
  onFetch,
  labels: labelOverrides,
  open,
  onClose,
  ...restProps
}: AssignCollectionDialogProps) => {
  const intl = useIntl();
  const { combinedFilters, clearFilters } = useModalCollectionFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => {
      if (onFilterChange) {
        onFilterChange(filters.filter, filters.channel, query);

        return;
      }

      onFetch(query);
    },
  });

  const labels: AssignContainerDialogProps["labels"] = {
    title: intl.formatMessage(messages.assignCollectionDialogHeader),
    label: intl.formatMessage(messages.assignCollectionDialogLabel),
    placeholder: intl.formatMessage(messages.assignCollectionDialogPlaceholder),
    confirmBtn: intl.formatMessage(messages.confirmBtn),
    ...labelOverrides,
  };

  return (
    <AssignContainerDialog
      {...restProps}
      containers={collections ?? []}
      labels={labels}
      open={open}
      onClose={onClose}
      onFetch={() => {}}
      emptyMessage={intl.formatMessage(messages.noCollectionsFound)}
      search={{ query, onQueryChange, resetQuery }}
      filtersSlot={<ModalFilters />}
      onResetFilters={clearFilters}
    />
  );
};

const AssignCollectionDialog = ({ excludedFilters, ...props }: AssignCollectionDialogProps) => (
  <ModalCollectionFilterProvider excludedFilters={excludedFilters}>
    <AssignCollectionDialogInner {...props} />
  </ModalCollectionFilterProvider>
);

AssignCollectionDialog.displayName = "AssignCollectionDialog";
export default AssignCollectionDialog;
