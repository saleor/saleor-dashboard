import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { DialogProps, FetchMoreProps, Node } from "@dashboard/types";
import React from "react";

import { AssignContainerDialogMulti } from "./AssignContainerDialogMulti";
import { AssignContainerDialogSingle } from "./AssignContainerDialogSingle";

export interface AssignContainerDialogFormData {
  containers: string[];
  query: string;
}

type Labels = Record<"confirmBtn" | "title" | "label" | "placeholder", string>;
export interface Container extends Node {
  name: string;
}
export interface AssignContainerDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  labels: Labels;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  emptyMessage?: string;
  selectionMode?: 'single' | 'multiple';
  selectedId?: string;
}

const AssignContainerDialog = (props: AssignContainerDialogProps) => {
  const {
    selectionMode = 'multiple',
    open,
    onClose,
    ...restProps
  } = props;

  const { labels } = props;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Header>{labels.title}</DashboardModal.Header>
        {selectionMode === 'single' ? (
          <AssignContainerDialogSingle
            {...restProps}
            onClose={onClose}
          />
        ) : (
          <AssignContainerDialogMulti
            {...restProps}
            onClose={onClose}
          />
        )}
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignContainerDialog.displayName = "AssignContainerDialog";

export default AssignContainerDialog;
