import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Container } from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import FilterBar from "@saleor/components/FilterBar";
import { sectionNames } from "@saleor/intl";
import {
  ListActions,
  PageListProps,
  FilterPageProps,
  TabPageProps,
  SortPage
} from "@saleor/types";
import { CollectionListUrlSortField } from "@saleor/collections/urls";
import { CollectionList_collections_edges_node } from "../../types/CollectionList";
import CollectionList from "../CollectionList/CollectionList";
import {
  CollectionFilterKeys,
  CollectionListFilterOpts,
  createFilterStructure
} from "./filters";

export interface CollectionListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<CollectionFilterKeys, CollectionListFilterOpts>,
    SortPage<CollectionListUrlSortField>,
    TabPageProps {
  collections: CollectionList_collections_edges_node[];
}

const CollectionListPage: React.FC<CollectionListPageProps> = ({
  currencySymbol,
  currentTab,
  disabled,
  filterOpts,
  initialSearch,
  onAdd,
  onAll,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();

  const structure = createFilterStructure(intl, filterOpts);

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.collections)}>
        <Button
          color="primary"
          disabled={disabled}
          variant="contained"
          onClick={onAdd}
        >
          <FormattedMessage
            defaultMessage="Create collection"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Collections",
            description: "tab name"
          })}
          currencySymbol={currencySymbol}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Collection"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <CollectionList disabled={disabled} {...listProps} />
      </Card>
    </Container>
  );
};
CollectionListPage.displayName = "CollectionListPage";
export default CollectionListPage;
