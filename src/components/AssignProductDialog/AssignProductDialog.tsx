import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { ProductWhereInput } from "@dashboard/graphql";
import { Container, DialogProps, FetchMoreProps } from "@dashboard/types";
import { FormattedMessage } from "react-intl";

import { AssignProductDialogMulti } from "./AssignProductDialogMulti";
import { AssignProductDialogSingle } from "./AssignProductDialogSingle";
import { messages } from "./messages";
import { InitialConstraints, ModalProductFilterProvider } from "./ModalProductFilterProvider";
import { Products, SelectedChannel } from "./types";

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

const AssignProductDialog = (props: AssignProductDialogProps) => {
  const {
    selectionMode = "multiple",
    excludedFilters,
    onFilterChange,
    initialConstraints,
    ...restProps
  } = props;

  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const dialogContent = (
    <>
      <DashboardModal.Header>
        <FormattedMessage {...messages.assignVariantDialogHeader} />
      </DashboardModal.Header>
      {selectionMode === "single" ? (
        <AssignProductDialogSingle {...restProps} onFilterChange={onFilterChange} />
      ) : (
        <AssignProductDialogMulti {...restProps} onFilterChange={onFilterChange} />
      )}
    </>
  );

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <ModalProductFilterProvider
          excludedFilters={excludedFilters}
          initialConstraints={initialConstraints}
        >
          {dialogContent}
        </ModalProductFilterProvider>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
