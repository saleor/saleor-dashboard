import AssignContainerDialog, {
  AssignContainerDialogProps,
  Container,
} from "@dashboard/components/AssignContainerDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DialogProps, FetchMoreProps } from "@dashboard/types";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";


export type SimpleItem = { id: string; name: string };



export interface AssignReferenceTypesDialogProps
  extends DialogProps,
    FetchMoreProps {
  confirmButtonState?: ConfirmButtonTransitionState;
  loading: boolean;
  items: SimpleItem[];
  onFetch: (query: string) => void;
  onSubmit: (selected: SimpleItem[]) => void;
}

export const AssignReferenceTypesDialog: React.FC<AssignReferenceTypesDialogProps> = ({
  open,
  onClose,
  loading,
  hasMore,
  onFetchMore,
  items,
  onFetch,
  onSubmit,
  confirmButtonState = "default",
}) => {
  const intl = useIntl();

  const containers: Container[] =
    items?.map(i => ({ id: i.id, name: i.name })) ?? [];

  return (
    <AssignContainerDialog
      open={open}
      onClose={onClose}
      loading={loading}
      containers={containers}
      hasMore={hasMore}
      onFetchMore={onFetchMore}
      onFetch={onFetch}
      confirmButtonState={confirmButtonState}
      labels={{
        title: intl.formatMessage(messages.titleProductTypes),
        label: intl.formatMessage(messages.searchLabel),
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmBtn),
      }}
      onSubmit={selected =>
        onSubmit(selected.map(c => ({ id: c.id, name: c.name })))
      }
    />
  );
};

export default AssignReferenceTypesDialog;
