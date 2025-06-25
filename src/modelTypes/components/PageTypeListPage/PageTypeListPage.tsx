import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForPageTypeOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { PageTypeFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { pageTypeAddUrl, PageTypeListUrlSortField } from "@dashboard/modelTypes/urls";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  ListActions,
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps,
} from "../../../types";
import PageTypeList from "../PageTypeList";

export interface PageTypeListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    SortPage<PageTypeListUrlSortField>,
    Omit<TabPageProps, "onTabDelete"> {
  pageTypes: PageTypeFragment[];
  onTabUpdate: (tabName: string) => void;
  onTabDelete: (id: number) => void;
  hasPresetsChanged: () => boolean;
  selectedPageTypes: string[];
}

const PageTypeListPage: React.FC<PageTypeListPageProps> = ({
  currentTab,
  initialSearch,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  onTabUpdate,
  hasPresetsChanged,
  tabs,
  selectedPageTypes,
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  const { PAGE_TYPE_OVERVIEW_CREATE, PAGE_TYPE_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.PAGE_TYPE_LIST,
  );
  const extensionMenuItems = getExtensionsItemsForPageTypeOverviewActions(
    PAGE_TYPE_OVERVIEW_MORE_ACTIONS,
    selectedPageTypes,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(PAGE_TYPE_OVERVIEW_CREATE);

  return (
    <ListPageLayout>
      <TopNav
        isAlignToRight={false}
        withoutBorder
        title={intl.formatMessage(sectionNames.modelTypes)}
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
                id: "P8vgix",
                defaultMessage: "All model types",
                description: "select all model types preset label",
              })}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {extensionMenuItems.length > 0 && <TopNav.Menu items={extensionMenuItems} />}
          {extensionCreateButtonItems.length > 0 ? (
            <ButtonGroupWithDropdown
              options={extensionCreateButtonItems}
              onClick={() => navigate(pageTypeAddUrl)}
              data-test-id="create-page-type"
            >
              <FormattedMessage
                id="+qDoi0"
                defaultMessage="Create model type"
                description="button"
              />
            </ButtonGroupWithDropdown>
          ) : (
            <Button
              onClick={() => navigate(pageTypeAddUrl)}
              variant="primary"
              data-test-id="create-page-type"
            >
              <FormattedMessage
                id="+qDoi0"
                defaultMessage="Create model type"
                description="button"
              />
            </Button>
          )}
        </Box>
      </TopNav>
      <DashboardCard gap={0}>
        <Box paddingX={6} marginBottom={2}>
          <Box __width="320px">
            <SearchInput
              initialSearch={initialSearch}
              placeholder={intl.formatMessage({
                id: "INw68F",
                defaultMessage: "Search model types...",
              })}
              onSearchChange={onSearchChange}
            />
          </Box>
        </Box>

        <PageTypeList {...listProps} />
      </DashboardCard>
    </ListPageLayout>
  );
};

PageTypeListPage.displayName = "PageTypeListPage";
export default PageTypeListPage;
