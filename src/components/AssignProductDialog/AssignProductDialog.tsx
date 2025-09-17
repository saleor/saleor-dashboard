import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Container, DialogProps, FetchMoreProps } from "@dashboard/types";
import { FormattedMessage } from "react-intl";

import { AssignProductDialogMulti } from "./AssignProductDialogMulti";
import { AssignProductDialogSingle } from "./AssignProductDialogSingle";
import { messages } from "./messages";
import { Products, SelectedChannel } from "./types";

export interface AssignProductDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedIds?: Record<string, boolean>;
  loading: boolean;
  onFetch: (value: string) => void;
  // name is part of Container interface
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  labels?: {
    confirmBtn?: string;
  };
  selectionMode?: "single" | "multiple";
  selectedId?: string;
}

const AssignProductDialog = (props: AssignProductDialogProps) => {
  const { selectionMode = "multiple", ...restProps } = props;

  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Header>
          <FormattedMessage {...messages.assignVariantDialogHeader} />
        </DashboardModal.Header>
        {selectionMode === "single" ? (
          <AssignProductDialogSingle {...restProps} />
        ) : (
          <AssignProductDialogMulti {...restProps} />
        )}
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
