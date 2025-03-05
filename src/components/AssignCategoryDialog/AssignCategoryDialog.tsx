import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import AssignContainerDialog, { AssignContainerDialogProps } from "../AssignContainerDialog";
import { messages } from "./messages";

interface AssignCategoryDialogProps
  extends Omit<
    AssignContainerDialogProps,
    "containers" | "labels" | "hasMore" | "loading" | "onFetchMore" | "onFetch"
  > {
  selectedCategories: string[];
}

const AssignCategoryDialog: React.FC<AssignCategoryDialogProps> = ({
  selectedCategories,
  open,
  ...rest
}) => {
  const intl = useIntl();

  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    skip: !open,
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search) ?? [];
  const categoriesToDisplay = categories.filter(
    category => !selectedCategories.includes(category.id),
  );

  return (
    <AssignContainerDialog
      containers={categoriesToDisplay}
      labels={{
        title: intl.formatMessage(messages.assignCategoryDialogHeader),
        label: intl.formatMessage(messages.assignCategoryDialogLabel),
        placeholder: intl.formatMessage(messages.assignCategoryDialogPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmButton),
      }}
      hasMore={searchCategoriesOpts.data?.search?.pageInfo?.hasNextPage ?? false}
      onFetch={searchCategories}
      onFetchMore={loadMoreCategories}
      loading={searchCategoriesOpts.loading}
      open={open}
      {...rest}
    />
  );
};

AssignCategoryDialog.displayName = "AssignCategoryDialog";
export default AssignCategoryDialog;
