import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Container, DialogProps, FetchMoreProps } from "@dashboard/types";

import { AssignContainerDialogMulti } from "./AssignContainerDialogMulti";
import { AssignContainerDialogSingle } from "./AssignContainerDialogSingle";

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
}

const AssignContainerDialog = (props: AssignContainerDialogProps) => {
  const { selectionMode = "multiple", ...restProps } = props;

  const { labels, open, onClose } = props;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Header>{labels.title}</DashboardModal.Header>
        {selectionMode === "single" ? (
          <AssignContainerDialogSingle {...restProps} />
        ) : (
          <AssignContainerDialogMulti {...restProps} />
        )}
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignContainerDialog.displayName = "AssignContainerDialog";

export default AssignContainerDialog;
