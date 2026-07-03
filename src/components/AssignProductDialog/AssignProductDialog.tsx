import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type ProductWhereInput } from "@dashboard/graphql";
import { type Container, type DialogProps, type FetchMoreProps } from "@dashboard/types";

import { hasReferenceTypeConstraints } from "../AssignAttributeValueDialog/mergeReferenceTypeWhereConstraints";
import {
  type InitialConstraints,
  ModalProductFilterProvider,
} from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { AssignProductDialogMulti } from "./AssignProductDialogMulti";
import { AssignProductDialogSingle } from "./AssignProductDialogSingle";
import { type Products, type SelectedChannel } from "./types";

export interface AssignProductDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedIds?: Record<string, boolean>;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  // name is part of Container interface
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  labels?: {
    confirmBtn?: string;
  };
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  excludedFilters?: string[];
  initialConstraints?: InitialConstraints;
}

export const AssignProductDialog = (props: AssignProductDialogProps): JSX.Element => {
  const {
    selectionMode = "multiple",
    excludedFilters,
    initialConstraints,
    open,
    onClose,
    ...restProps
  } = props;

  const skipFetchOnOpen = hasReferenceTypeConstraints(initialConstraints);

  const dialogContent =
    selectionMode === "single" ? (
      <AssignProductDialogSingle
        open={open}
        onClose={onClose}
        skipFetchOnOpen={skipFetchOnOpen}
        {...restProps}
      />
    ) : (
      <AssignProductDialogMulti
        open={open}
        onClose={onClose}
        skipFetchOnOpen={skipFetchOnOpen}
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

AssignProductDialog.displayName = "AssignProductDialog";

export default AssignProductDialog;
