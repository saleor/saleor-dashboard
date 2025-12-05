import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForPageOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Pages } from "@dashboard/modeling/types";
import { PageListUrlSortField, pageUrl } from "@dashboard/modeling/urls";
import { FilterPagePropsWithPresets, PageListProps, SortPage } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { PageListFilterKeys, PageListFilterOpts } from "../../views/PageList/filters";
import { PageListDatagrid } from "../PageListDatagrid/PageListDatagrid";
import { pagesListSearchAndFiltersMessages as messages } from "./messages";

interface PageListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<PageListFilterKeys, PageListFilterOpts>,
    SortPage<PageListUrlSortField> {
  pages: Pages | undefined;
  selectedPageIds: string[];
  loading: boolean;
  onSelectPageIds: (rows: number[], clearSelection: () => void) => void;
  onPagesDelete: () => void;
  onPagesPublish: () => void;
  onPagesUnpublish: () => void;
  onPageCreate: () => void;
}

const PageListPage = ({
  selectedFilterPreset,
  initialSearch,
  onFilterPresetsAll,
  onFilterPresetDelete,
  onFilterPresetUpdate,
  onSearchChange,
  onFilterPresetChange,
  onFilterPresetPresetSave,
  filterPresets,
  selectedPageIds,
  hasPresetsChanged,
  onPagesDelete,
  onPagesPublish,
  onPagesUnpublish,
  onPageCreate,
  ...listProps
}: PageListPageProps) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigator();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  const { PAGE_OVERVIEW_CREATE, PAGE_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.PAGE_LIST,
  );
  const extensionMenuItems = getExtensionsItemsForPageOverviewActions(
    PAGE_OVERVIEW_MORE_ACTIONS,
    selectedPageIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(PAGE_OVERVIEW_CREATE);

  return (
    <ListPageLayout>
      <TopNav title={intl.formatMessage(sectionNames.models)} isAlignToRight={false} withoutBorder>
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={5} display="flex" alignItems="center">
              <ChevronRight />
            </Box>
            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onFilterPresetChange}
              onRemove={onFilterPresetDelete}
              onUpdate={onFilterPresetUpdate}
              savedPresets={filterPresets}
              activePreset={selectedFilterPreset}
              onSelectAll={onFilterPresetsAll}
              onSave={onFilterPresetPresetSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "UgCuqX",
                defaultMessage: "All models",
                description: "tab name",
              })}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {extensionMenuItems.length > 0 && <TopNav.Menu items={extensionMenuItems} />}
            {extensionCreateButtonItems.length > 0 ? (
              <ButtonGroupWithDropdown
                options={extensionCreateButtonItems}
                onClick={onPageCreate}
                data-test-id="create-page"
              >
                <FormattedMessage id="pyiyxe" defaultMessage="Create model" description="button" />
              </ButtonGroupWithDropdown>
            ) : (
              <Button onClick={onPageCreate} variant="primary" data-test-id="create-page">
                <FormattedMessage id="pyiyxe" defaultMessage="Create model" description="button" />
              </Button>
            )}
          </Box>
        </Box>
      </TopNav>
      <DashboardCard>
        <ListFilters
          type="expression-filter"
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage(messages.searchPlaceholder)}
          onSearchChange={onSearchChange}
          actions={
            selectedPageIds.length > 0 && (
              <Box display="flex" gap={4}>
                <Button variant="secondary" onClick={onPagesUnpublish}>
                  <FormattedMessage {...messages.unpublish} />
                </Button>
                <Button variant="secondary" onClick={onPagesPublish}>
                  <FormattedMessage {...messages.publish} />
                </Button>
                <BulkDeleteButton onClick={onPagesDelete}>
                  <FormattedMessage {...messages.delete} />
                </BulkDeleteButton>
              </Box>
            )
          }
        />
        <PageListDatagrid
          {...listProps}
          hasRowHover={!isFilterPresetOpen}
          rowAnchor={pageUrl}
          onRowClick={id =>
            navigate(pageUrl(id), {
              state: getPrevLocationState(location),
            })
          }
        />
      </DashboardCard>
    </ListPageLayout>
  );
};

PageListPage.displayName = "PageListPage";
export default PageListPage;
