import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DashboardCard } from "@dashboard/components/Card";
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
import { type Pages } from "@dashboard/modeling/types";
import { type PageListUrlSortField, pageUrl } from "@dashboard/modeling/urls";
import { pageTypeAddUrl } from "@dashboard/modelTypes/urls";
import { type PageListProps, type SearchPageProps, type SortPage } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { PageListDatagrid } from "../PageListDatagrid/PageListDatagrid";
import { pagesListSearchAndFiltersMessages as messages } from "./messages";
import { type ModelType, ModelTypeTabs } from "./ModelTypeTabs/ModelTypeTabs";

interface PageListPageProps extends PageListProps, SearchPageProps, SortPage<PageListUrlSortField> {
  pages: Pages | undefined;
  selectedPageIds: string[];
  loading: boolean;
  modelTypes: ModelType[];
  modelTypeCounts: Record<string, number | undefined>;
  modelTypesTotalCount: number | undefined;
  modelTypesLoading: boolean;
  activeModelType: string | null;
  onActiveModelTypeChange: (typeId: string | null) => void;
  onSelectPageIds: (rows: number[], clearSelection: () => void) => void;
  onPagesDelete: () => void;
  onPagesPublish: () => void;
  onPagesUnpublish: () => void;
  onPageCreate: () => void;
}

const PageListPage = ({
  initialSearch,
  onSearchChange,
  selectedPageIds,
  onPagesDelete,
  onPagesPublish,
  onPagesUnpublish,
  onPageCreate,
  modelTypes,
  modelTypeCounts,
  modelTypesTotalCount,
  modelTypesLoading,
  activeModelType,
  onActiveModelTypeChange,
  ...listProps
}: PageListPageProps) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigator();

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
      <TopNav title={intl.formatMessage(sectionNames.models)} withoutBorder>
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
      </TopNav>
      <DashboardCard>
        <ModelTypeTabs
          types={modelTypes}
          counts={modelTypeCounts}
          totalCount={modelTypesTotalCount}
          activeType={activeModelType}
          loading={modelTypesLoading}
          emptyTypesUrl={pageTypeAddUrl}
          onChange={onActiveModelTypeChange}
        />
        <Box
          display="grid"
          __gridTemplateColumns="auto 1fr"
          gap={4}
          paddingX={6}
          paddingY={2}
          alignItems="center"
        >
          <Box __width="360px">
            <SearchInput
              initialSearch={initialSearch}
              placeholder={intl.formatMessage(messages.searchPlaceholder)}
              onSearchChange={onSearchChange}
              showSearchTooltip
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={4}>
            {selectedPageIds.length > 0 && (
              <>
                <Button variant="secondary" onClick={onPagesUnpublish}>
                  <FormattedMessage {...messages.unpublish} />
                </Button>
                <Button variant="secondary" onClick={onPagesPublish}>
                  <FormattedMessage {...messages.publish} />
                </Button>
                <BulkDeleteButton onClick={onPagesDelete}>
                  <FormattedMessage {...messages.delete} />
                </BulkDeleteButton>
              </>
            )}
          </Box>
        </Box>
        <PageListDatagrid
          {...listProps}
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
