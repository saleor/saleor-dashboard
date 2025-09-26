import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { SearchProductsQuery } from "@dashboard/graphql";
import { Container, DialogProps, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { FormattedMessage } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import { AssignVariantDialogMulti } from "./AssignVariantDialogMulti";
import { AssignVariantDialogSingle } from "./AssignVariantDialogSingle";
import { messages } from "./messages";

interface AssignVariantDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
}

const AssignVariantDialog = (props: AssignVariantDialogProps) => {
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
          <AssignVariantDialogSingle {...restProps} />
        ) : (
          <AssignVariantDialogMulti {...restProps} />
        )}
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignVariantDialog.displayName = "AssignVariantDialog";
export default AssignVariantDialog;
