import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import { getModelTypeIcon } from "@dashboard/components/ModelTypeIcon/getModelTypeIcon";
import { ModelTypeIcon } from "@dashboard/components/ModelTypeIcon/ModelTypeIcon";
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

import { hasReferenceTypeConstraints } from "../AssignAttributeValueDialog/mergeReferenceTypeWhereConstraints";
import AssignContainerDialog, {
  type AssignContainerDialogProps,
} from "../AssignContainerDialog/AssignContainerDialog";
import {
  type InitialPageConstraints,
  ModalPageFilterProvider,
  useModalPageFilterContext,
} from "../ModalFilters/entityConfigs/ModalPageFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";

interface AssignModelDialogProps
  extends FetchMoreProps,
    DialogProps,
    Pick<AssignContainerDialogProps, "excludeContainer" | "backfillResetKey"> {
  confirmButtonState: ConfirmButtonTransitionState;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  loading: boolean;
  onFilterChange?: (filterVariables: PageWhereInput, query: string) => void | Promise<unknown>;
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
  skipFetchOnOpen = false,
  ...restProps
}: Omit<AssignModelDialogProps, "excludedFilters" | "initialConstraints"> & {
  skipFetchOnOpen?: boolean;
}) => {
  const intl = useIntl();
  const { combinedFilters, clearFilters } = useModalPageFilterContext();

  const { query, onQueryChange, resetQuery, isSearching } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    skipFetchOnOpen,
    onFetch: (filters, query) => onFilterChange?.(filters.where, query),
  });

  const containers: Container[] = useMemo(
    () => pages?.map(page => ({ id: page.id, name: page.title })) ?? [],
    [pages],
  );

  // Kept off `Container`: that shape is also the submit payload, so the icon and slug are looked
  // up per row at render time rather than riding along with the selection.
  const pagesById = useMemo(() => new Map(pages?.map(page => [page.id, page]) ?? []), [pages]);

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
      renderContainerAdornment={container => {
        const page = pagesById.get(container.id);

        return page ? <ModelTypeIcon icon={getModelTypeIcon(page.pageType?.metadata)} /> : null;
      }}
      // Models can share a name; merchants tell them apart by slug.
      renderContainerDescription={container => pagesById.get(container.id)?.slug}
      labels={labels}
      open={open}
      onClose={onClose}
      onFetch={() => {}}
      emptyMessage={emptyMessage}
      backfillExhaustedMessage={intl.formatMessage(messages.allLoadedModelsFilteredOut)}
      search={{ query, onQueryChange, resetQuery, isSearching }}
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
    <AssignModelDialogInner
      {...props}
      skipFetchOnOpen={hasReferenceTypeConstraints(initialConstraints)}
    />
  </ModalPageFilterProvider>
);

AssignModelDialog.displayName = "AssignModelDialog";
export default AssignModelDialog;
