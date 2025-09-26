// @ts-strict-ignore
import { useIntl } from "react-intl";

import AssignContainerDialog, { AssignContainerDialogProps } from "../AssignContainerDialog";
import { messages } from "./messages";

type Collections = {
  id: string;
  name: string;
}[];

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  collections: Collections | null;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

const AssignCollectionDialog = ({ collections, labels, ...rest }: AssignCollectionDialogProps) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={collections}
      emptyMessage={intl.formatMessage(messages.noCollectionsFound)}
      labels={{
        title: intl.formatMessage(messages.assignCollectionDialogHeader),
        label: intl.formatMessage(messages.assignCollectionDialogLabel),
        placeholder: intl.formatMessage(messages.assignCollectionDialogPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmBtn),
        ...labels,
      }}
      {...rest}
    />
  );
};

AssignCollectionDialog.displayName = "AssignCollectionDialog";
export default AssignCollectionDialog;
