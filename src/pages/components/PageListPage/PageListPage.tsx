import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Pages } from "@dashboard/pages/types";
import {
  PageListUrlDialog,
  PageListUrlQueryParams,
  PageListUrlSortField,
  pageUrl,
} from "@dashboard/pages/urls";
import { FilterPagePropsWithPresets, PageListProps, SortPage } from "@dashboard/types";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import {
  createFilterStructure,
  PageListFilterKeys,
  PageListFilterOpts,
} from "../../views/PageList/filters";
import { PageListDatagrid } from "../PageListDatagrid/PageListDatagrid";
import { pagesListSearchAndFiltersMessages as messages } from "./messages";

export interface PageListActionDialogOpts {
  open: (action: PageListUrlDialog, newParams?: PageListUrlQueryParams) => void;
  close: () => void;
}
export interface PageListPageProps
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

const PageListPage: React.FC<PageListPageProps> = ({
  selectedFilterPreset,
  filterOpts,
  initialSearch,
  onFilterPresetsAll,
  onFilterChange,
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
}) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigator();
  const structure = createFilterStructure(intl, filterOpts);
  const [isFilterPresetOpen, setFilterPresetOpen] = React.useState(false);

  return (
    <ListPageLayout>
      <TopNav title={intl.formatMessage(sectionNames.content)} isAlignToRight={false} withoutBorder>
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={5} display="flex" alignItems="center">
              <ChevronRightIcon />
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
                id: "hJrzlT",
                defaultMessage: "All content",
                description: "tab name",
              })}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Button onClick={onPageCreate} variant="primary" data-test-id="create-page">
              <FormattedMessage id="DOVEZF" defaultMessage="Create content" description="button" />
            </Button>
          </Box>
        </Box>
      </TopNav>
      <DashboardCard>
        <ListFilters
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage(messages.searchPlaceholder)}
          onFilterChange={onFilterChange}
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
              state: {
                prevLocation: location,
              },
            })
          }
        />
      </DashboardCard>
    </ListPageLayout>
  );
};

PageListPage.displayName = "PageListPage";
export default PageListPage;
