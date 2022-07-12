import { SearchCollectionsQuery } from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps,
} from "../AssignContainerDialog";
import { messages } from "./messages";

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
}

const AssignCollectionDialog: React.FC<AssignCollectionDialogProps> = ({
  collections,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={collections}
      labels={{
        title: intl.formatMessage(messages.assignCollectionDialogHeader),
        label: intl.formatMessage(messages.assignCollectionDialogLabel),
        placeholder: intl.formatMessage(
          messages.assignCollectionDialogPlaceholder,
        ),
        confirmBtn: intl.formatMessage(messages.confirmBtn),
      }}
      {...rest}
    />
  );
};

AssignCollectionDialog.displayName = "AssignCollectionDialog";
export default AssignCollectionDialog;
