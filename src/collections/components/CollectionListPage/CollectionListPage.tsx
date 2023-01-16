import { collectionAddUrl } from "@dashboard/collections/urls";
import { Button } from "@dashboard/components/Button";
import { Container } from "@dashboard/components/Container";
import { getByName } from "@dashboard/components/Filter/utils";
import FilterBar from "@dashboard/components/FilterBar";
import PageHeader from "@dashboard/components/PageHeader";
import { sectionNames } from "@dashboard/intl";
import {
  FilterPageProps,
  PageListProps,
  SearchPageProps,
  TabPageProps,
} from "@dashboard/types";
import { Card } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CollectionList, {
  CollectionListProps,
} from "../CollectionList/CollectionList";
import {
  CollectionFilterKeys,
  CollectionListFilterOpts,
  createFilterStructure,
} from "./filters";
export interface CollectionListPageProps
  extends PageListProps,
    SearchPageProps,
    TabPageProps,
    FilterPageProps<CollectionFilterKeys, CollectionListFilterOpts>,
    CollectionListProps {}

const CollectionListPage: React.FC<CollectionListPageProps> = ({
  currentTab,
  disabled,
  initialSearch,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  selectedChannelId,
  tabs,
  filterOpts,
  onFilterChange,
  onFilterAttributeFocus,
  ...listProps
}) => {
  const intl = useIntl();
  const filterStructure = createFilterStructure(intl, filterOpts);

  const filterDependency = filterStructure.find(getByName("channel"));

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.collections)}>
        <Button
          disabled={disabled}
          variant="primary"
          href={collectionAddUrl()}
          data-test-id="create-collection"
        >
          <FormattedMessage
            id="jyaAlB"
            defaultMessage="Create collection"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            id: "G4g5Ii",
            defaultMessage: "All Collections",
            description: "tab name",
          })}
          currentTab={currentTab}
          filterStructure={filterStructure}
          initialSearch={initialSearch}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onFilterAttributeFocus={onFilterAttributeFocus}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
          searchPlaceholder={intl.formatMessage({
            id: "s97tLq",
            defaultMessage: "Search Collections",
          })}
          tabs={tabs}
        />
        <CollectionList
          disabled={disabled}
          selectedChannelId={selectedChannelId}
          filterDependency={filterDependency}
          {...listProps}
        />
      </Card>
    </Container>
  );
};
CollectionListPage.displayName = "CollectionListPage";
export default CollectionListPage;
