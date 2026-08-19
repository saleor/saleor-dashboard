import { useUser } from "@dashboard/auth/useUser";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
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
import { PermissionEnum } from "@dashboard/graphql";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { type Pages } from "@dashboard/modeling/types";
import { type PageListUrlSortField, pageUrl } from "@dashboard/modeling/urls";
import { NavigationPinButton } from "@dashboard/navigationPins/components/NavigationPinButton";
import { OrganizationPinsDialog } from "@dashboard/navigationPins/components/OrganizationPinsDialog";
import { navigationPinMessages } from "@dashboard/navigationPins/messages";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type PageListProps, type SortPage } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { rippleGroupedModelTypeTabs } from "../../ripples/groupedModelTypeTabs";
import { ModelSearchInput } from "../ModelSearchInput/ModelSearchInput";
import { type ModelTypeTabCount, ModelTypeTabs } from "../ModelTypeTabs/ModelTypeTabs";
import { type ModelTypeTabGrouping } from "../ModelTypeTabs/useModelTypeTabGrouping";
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
  onCreateModelType: () => void;
  pageTypes: Array<{ id: string; name: string }> | undefined;
  selectedIds: string[];
  activePageTypeName: string | undefined;
  tabCounts: Record<string, ModelTypeTabCount | undefined>;
  onTabChange: (ids: string[]) => void;
  grouping: ModelTypeTabGrouping;
}

const PageListPage = ({
  initialSearch,
  onSearchChange,
  selectedPageIds,
  onPagesDelete,
  onPagesPublish,
  onPagesUnpublish,
  onPageCreate,
  onCreateModelType,
  pageTypes,
  selectedIds,
  activePageTypeName,
  tabCounts,
  onTabChange,
  grouping,
  ...listProps
}: PageListPageProps) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigator();
  const { user } = useUser();

  const { PAGE_OVERVIEW_CREATE, PAGE_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.PAGE_LIST,
  );
  const extensionMenuItems = getExtensionsItemsForPageOverviewActions(
    PAGE_OVERVIEW_MORE_ACTIONS,
    selectedPageIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(PAGE_OVERVIEW_CREATE);
  const createModelTypeOption = {
    label: intl.formatMessage({
      id: "+qDoi0",
      defaultMessage: "Create model type",
      description: "button",
    }),
    testId: "create-page-type",
    onSelect: onCreateModelType,
  };

  const [organizationPinsOpen, setOrganizationPinsOpen] = useState(false);
  const canManageOrganizationPins = Boolean(
    user?.userPermissions?.some(permission => permission.code === PermissionEnum.MANAGE_SETTINGS),
  );
  const topNavMenuItems: TopNavMenuItem[] = canManageOrganizationPins
    ? [
        ...extensionMenuItems,
        {
          label: intl.formatMessage(navigationPinMessages.organizationPinsTitle),
          testId: "manage-organization-pins",
          onSelect: () => setOrganizationPinsOpen(true),
        },
      ]
    : extensionMenuItems;

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
        {topNavMenuItems.length > 0 && <TopNav.Menu items={topNavMenuItems} />}
        <ButtonGroupWithDropdown
          pinnedOptions={[createModelTypeOption]}
          options={extensionCreateButtonItems}
          onClick={onPageCreate}
          testId="create-page"
        >
          {createLabel}
        </ButtonGroupWithDropdown>
      </TopNav>
      <Box display="flex" flexDirection="column" __minWidth={0} __minHeight={0}>
        <ModelTypeTabs
          pageTypes={pageTypes}
          selectedIds={selectedIds}
          counts={tabCounts}
          onTabChange={onTabChange}
          grouping={grouping}
          rightSlot={<Ripple model={rippleGroupedModelTypeTabs} />}
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
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {selectedPageIds.length > 0 ? (
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
              ) : (
                <NavigationPinButton
                  modelTypeId={selectedIds.length === 1 ? selectedIds[0] : null}
                  modelTypeName={activePageTypeName}
                />
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
      {organizationPinsOpen && (
        <OrganizationPinsDialog
          open={organizationPinsOpen}
          onClose={() => setOrganizationPinsOpen(false)}
        />
      )}
    </ListPageLayout>
  );
};

PageListPage.displayName = "PageListPage";
export default PageListPage;
