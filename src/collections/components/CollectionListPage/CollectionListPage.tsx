// @ts-strict-ignore
import { Collections } from "@dashboard/collections/types";
import {
  collectionAddUrl,
  CollectionListUrlSortField,
  collectionUrl,
} from "@dashboard/collections/urls";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { DashboardCard } from "@dashboard/components/Card";
import { getByName } from "@dashboard/components/Filter/utils";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { FilterPageProps, PageListProps, SortPage } from "@dashboard/types";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { CollectionListDatagrid } from "../CollectionListDatagrid";
import { CollectionFilterKeys, CollectionListFilterOpts, createFilterStructure } from "./filters";

export interface CollectionListPageProps
  extends PageListProps,
    Omit<FilterPageProps<CollectionFilterKeys, CollectionListFilterOpts>, "onTabDelete">,
    SortPage<CollectionListUrlSortField> {
  onTabUpdate: (tabName: string) => void;
  selectedChannelId: string;
  collections: Collections;
  loading: boolean;
  selectedCollectionIds: string[];
  hasPresetsChanged: () => boolean;
  onSelectCollectionIds: (rows: number[], clearSelection: () => void) => void;
  onCollectionsDelete: () => void;
  onTabDelete: (id: number) => void;
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
  onTabUpdate,
  selectedChannelId,
  tabs,
  filterOpts,
  onFilterChange,
  onFilterAttributeFocus,
  hasPresetsChanged,
  currencySymbol,
  selectedCollectionIds,
  onCollectionsDelete,
  ...listProps
}) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigator();
  const filterStructure = createFilterStructure(intl, filterOpts);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const filterDependency = filterStructure.find(getByName("channel"));

  return (
    <ListPageLayout>
      <TopNav
        withoutBorder
        isAlignToRight={false}
        title={intl.formatMessage(sectionNames.collections)}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onTabChange}
              onRemove={onTabDelete}
              onUpdate={onTabUpdate}
              savedPresets={tabs}
              activePreset={currentTab}
              onSelectAll={onAll}
              onSave={onTabSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "G4g5Ii",
                defaultMessage: "All Collections",
                description: "tab name",
              })}
            />
          </Box>
          <Box>
            <Button
              disabled={disabled}
              variant="primary"
              onClick={() => navigate(collectionAddUrl())}
              data-test-id="create-collection"
            >
              <FormattedMessage
                id="jyaAlB"
                defaultMessage="Create collection"
                description="button"
              />
            </Button>
          </Box>
        </Box>
      </TopNav>

      <DashboardCard>
        <ListFilters
          currencySymbol={currencySymbol}
          initialSearch={initialSearch}
          onFilterChange={onFilterChange}
          onFilterAttributeFocus={onFilterAttributeFocus}
          onSearchChange={onSearchChange}
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            id: "eRqx44",
            defaultMessage: "Search collections...",
          })}
          actions={
            <Box display="flex" gap={4}>
              {selectedCollectionIds.length > 0 && (
                <BulkDeleteButton onClick={onCollectionsDelete}>
                  <FormattedMessage defaultMessage="Delete collections" id="FTYkgw" />
                </BulkDeleteButton>
              )}
            </Box>
          }
        />

        <CollectionListDatagrid
          disabled={disabled}
          selectedChannelId={selectedChannelId}
          filterDependency={filterDependency}
          onRowClick={id => {
            navigate(collectionUrl(id), {
              state: {
                prevLocation: location,
              },
            });
          }}
          hasRowHover={!isFilterPresetOpen}
          rowAnchor={collectionUrl}
          {...listProps}
        />
      </DashboardCard>
    </ListPageLayout>
  );
};

CollectionListPage.displayName = "CollectionListPage";
export default CollectionListPage;
