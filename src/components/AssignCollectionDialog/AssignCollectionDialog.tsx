// @ts-strict-ignore
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, { AssignContainerDialogProps } from "../AssignContainerDialog";
import { messages } from "./messages";

interface AssignCollectionDialogProps
  extends Omit<
    AssignContainerDialogProps,
    "containers" | "labels" | "hasMore" | "loading" | "onFetchMore" | "onFetch"
  > {
  selectedCollections: string[];
}

const AssignCollectionDialog: React.FC<AssignCollectionDialogProps> = ({
  selectedCollections,
  ...rest
}) => {
  const intl = useIntl();

  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearch({
    skip: !rest.open,
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const collections = mapEdgesToItems(searchCollectionsOpts?.data?.search) ?? [];
  const collectionsToDisplay = collections.filter(
    category => !selectedCollections.includes(category.id),
  );

  return (
    <AssignContainerDialog
      containers={collectionsToDisplay}
      labels={{
        title: intl.formatMessage(messages.assignCollectionDialogHeader),
        label: intl.formatMessage(messages.assignCollectionDialogLabel),
        placeholder: intl.formatMessage(messages.assignCollectionDialogPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmBtn),
      }}
      hasMore={searchCollectionsOpts?.data?.search.pageInfo.hasNextPage}
      onFetch={searchCollections}
      onFetchMore={loadMoreCollections}
      loading={searchCollectionsOpts.loading}
      {...rest}
    />
  );
};

AssignCollectionDialog.displayName = "AssignCollectionDialog";
export default AssignCollectionDialog;
