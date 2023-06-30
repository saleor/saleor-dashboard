// @ts-strict-ignore
import {
  collectionAddUrl,
  CollectionListUrlSortField,
  collectionUrl,
} from "@dashboard/collections/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { getByName } from "@dashboard/components/Filter/utils";
import FilterBar from "@dashboard/components/FilterBar";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { CollectionListQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  FilterPageProps,
  PageListProps,
  RelayToFlat,
  SearchPageProps,
  SortPage,
  TabPageProps,
} from "@dashboard/types";
import { Card } from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CollectionListDatagrid } from "../CollectionListDatagrid";
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
    SortPage<CollectionListUrlSortField> {
  selectedChannelId: string;
  columnPickerSettings: string[];
  collections: RelayToFlat<CollectionListQuery["collections"]>;
  loading: boolean;
  selectedCollectionIds: string[];
  onSelectCollectionIds: (rows: number[], clearSelection: () => void) => void;
}

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
  const navigate = useNavigator();
  const filterStructure = createFilterStructure(intl, filterOpts);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  const filterDependency = filterStructure.find(getByName("channel"));

  return (
    <ListPageLayout>
      <TopNav title={intl.formatMessage(sectionNames.collections)}>
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
      </TopNav>
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
        <CollectionListDatagrid
          disabled={disabled}
          selectedChannelId={selectedChannelId}
          filterDependency={filterDependency}
          onRowClick={id => {
            navigate(collectionUrl(id));
          }}
          hasRowHover={!isFilterPresetOpen}
          {...listProps}
        />
      </Card>
    </ListPageLayout>
  );
};
CollectionListPage.displayName = "CollectionListPage";
export default CollectionListPage;
