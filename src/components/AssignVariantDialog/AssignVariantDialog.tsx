import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type ProductWhereInput, type SearchProductsQuery } from "@dashboard/graphql";
import {
  type Container,
  type DialogProps,
  type FetchMoreProps,
  type RelayToFlat,
} from "@dashboard/types";

import { hasReferenceTypeConstraints } from "../AssignAttributeValueDialog/mergeReferenceTypeWhereConstraints";
import { type AssignContainerDialogProps } from "../AssignContainerDialog";
import {
  type InitialConstraints,
  ModalProductFilterProvider,
} from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { AssignVariantDialogMulti } from "./AssignVariantDialogMulti";
import { AssignVariantDialogSingle } from "./AssignVariantDialogSingle";

interface AssignVariantDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onSubmit: (data: Container[]) => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  /** Variant ids already assigned when the dialog opened — shown checked and disabled. */
  selectedIds?: string[];
  excludedFilters?: string[];
  initialConstraints?: InitialConstraints;
}

const AssignVariantDialog = (props: AssignVariantDialogProps) => {
  const {
    selectionMode = "multiple",
    excludedFilters,
    initialConstraints,
    selectedIds,
    ...restProps
  } = props;
  const skipFetchOnOpen = hasReferenceTypeConstraints(initialConstraints);

  const dialogContent =
    selectionMode === "single" ? (
      <AssignVariantDialogSingle skipFetchOnOpen={skipFetchOnOpen} {...restProps} />
    ) : (
      <AssignVariantDialogMulti
        skipFetchOnOpen={skipFetchOnOpen}
        selectedIds={selectedIds}
        {...restProps}
      />
    );

  return (
    <ModalProductFilterProvider
      excludedFilters={excludedFilters}
      initialConstraints={initialConstraints}
    >
      {dialogContent}
    </ModalProductFilterProvider>
  );
};

AssignVariantDialog.displayName = "AssignVariantDialog";
export default AssignVariantDialog;
