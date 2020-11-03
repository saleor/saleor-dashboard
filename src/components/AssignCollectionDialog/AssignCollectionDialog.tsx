import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps
} from "../AssignContainerDialog";

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "title" | "search"> {
  collections: SearchCollections_search_edges_node[];
}

const AssignCollectionDialog: React.FC<AssignCollectionDialogProps> = ({
  collections,
  ...rest
}) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={collections}
      search={{
        label: intl.formatMessage({
          defaultMessage: "Search Collection"
        }),
        placeholder: intl.formatMessage({
          defaultMessage: "Search by collection name, etc..."
        })
      }}
      title={intl.formatMessage({
        defaultMessage: "Assign Collection",
        description: "dialog header"
      })}
      {...rest}
    />
  );
};

AssignCollectionDialog.displayName = "AssignCollectionDialog";
export default AssignCollectionDialog;
