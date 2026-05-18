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
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type PageListProps, type SortPage } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { rippleModelTypeTabs } from "../../ripples/modelTypeTabs";
import { ModelSearchInput } from "../ModelSearchInput/ModelSearchInput";
import { type ModelTypeTabCount, ModelTypeTabs } from "../ModelTypeTabs/ModelTypeTabs";
import { PageListDatagrid } from "../PageListDatagrid/PageListDatagrid";
import { pagesListSearchAndFiltersMessages as messages } from "./messages";

interface PageListPageProps extends PageListProps, SortPage<PageListUrlSortField> {
  pages: Pages | undefined;
  selectedPageIds: string[];
  loading: boolean;
  initialSearch: string;
  onSearchChange: (query: string) => void;
  onSelectPageIds: (rows: number[], clearSelection: () => void) => void;
  onPagesDelete: () => void;
  onPagesPublish: () => void;
  onPagesUnpublish: () => void;
  onPageCreate: () => void;
  pageTypes: Array<{ id: string; name: string }> | undefined;
  activeTabId: string;
  activePageTypeName: string | undefined;
  tabCounts: Record<string, ModelTypeTabCount | undefined>;
  onTabChange: (id: string) => void;
}

const PageListPage = ({
  initialSearch,
  onSearchChange,
  selectedPageIds,
  onPagesDelete,
  onPagesPublish,
  onPagesUnpublish,
  onPageCreate,
  pageTypes,
  activeTabId,
  activePageTypeName,
  tabCounts,
  onTabChange,
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

  const createLabel = activePageTypeName ? (
    <FormattedMessage
      id="ML+YsS"
      defaultMessage="Create {typeName}"
      description="button"
      values={{ typeName: activePageTypeName }}
    />
  ) : (
    <FormattedMessage id="pyiyxe" defaultMessage="Create model" description="button" />
  );

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
            {createLabel}
          </ButtonGroupWithDropdown>
        ) : (
          <Button onClick={onPageCreate} variant="primary" data-test-id="create-page">
            {createLabel}
          </Button>
        )}
      </TopNav>
      <Box display="flex" flexDirection="column" __minWidth={0} __minHeight={0}>
        <ModelTypeTabs
          pageTypes={pageTypes}
          activeId={activeTabId}
          counts={tabCounts}
          onTabChange={onTabChange}
          rightSlot={<Ripple model={rippleModelTypeTabs} />}
        />
        <DashboardCard>
          <Box
            display="grid"
            __gridTemplateColumns="auto 1fr"
            gap={4}
            paddingBottom={2}
            paddingX={6}
            paddingTop={4}
          >
            <ModelSearchInput
              initialSearch={initialSearch}
              placeholder={intl.formatMessage(messages.searchPlaceholder)}
              onSearchChange={onSearchChange}
            />
            <Box display="flex" justifyContent="flex-end">
              {selectedPageIds.length > 0 && (
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
              )}
            </Box>
          </Box>
          <PageListDatagrid
            {...listProps}
            searchQuery={initialSearch}
            rowAnchor={pageUrl}
            onRowClick={id =>
              navigate(pageUrl(id), {
                state: getPrevLocationState(location),
              })
            }
          />
        </DashboardCard>
      </Box>
    </ListPageLayout>
  );
};

PageListPage.displayName = "PageListPage";
export default PageListPage;
