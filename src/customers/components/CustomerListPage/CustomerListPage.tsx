import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ExpressionFilters } from "@dashboard/components/AppLayout/ListFilters/components/ExpressionFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { ListSearchInput } from "@dashboard/components/ListSearchInput/ListSearchInput";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { useCanEditCustomers } from "@dashboard/customers/hooks/useCanEditCustomers";
import { type Customers } from "@dashboard/customers/types";
import {
  customerAddUrl,
  type CustomerListUrlSortField,
  customerUrl,
} from "@dashboard/customers/urls";
import { rippleCustomerTypes } from "@dashboard/customerTypes/ripples/customerTypes";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForCustomerOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { PermissionEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type PageListProps, type SearchPageProps, type SortPage } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerListDatagrid } from "../CustomerListDatagrid/CustomerListDatagrid";
import { type CustomerTypeTabCount, CustomerTypeTabs } from "../CustomerTypeTabs/CustomerTypeTabs";

interface CustomerListPageProps
  extends PageListProps,
    SearchPageProps,
    SortPage<CustomerListUrlSortField> {
  customers: Customers | undefined;
  selectedCustomerIds: string[];
  loading: boolean;
  onSelectCustomerIds: (rows: number[], clearSelection: () => void) => void;
  onCustomersDelete: () => void;
  onCreateCustomerType: () => void;
  customerTypes: Array<{ id: string; name: string }> | undefined;
  selectedTypeIds: string[];
  activeCustomerTypeName: string | undefined;
  tabCounts: Record<string, CustomerTypeTabCount | undefined>;
  onTabChange: (ids: string[]) => void;
}

export const CustomerListPage = ({
  initialSearch,
  onSearchChange,
  selectedCustomerIds,
  onCustomersDelete,
  onCreateCustomerType,
  customerTypes,
  selectedTypeIds,
  activeCustomerTypeName,
  tabCounts,
  onTabChange,
  ...customerListProps
}: CustomerListPageProps): JSX.Element => {
  const intl = useIntl();
  const navigate = useNavigator();
  const canEditCustomers = useCanEditCustomers();
  const userPermissions = useUserPermissions();
  const canCreateCustomerTypes = hasPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES,
  ]);
  const { CUSTOMER_OVERVIEW_CREATE, CUSTOMER_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.CUSTOMER_LIST,
  );
  const extensionMenuItems = getExtensionsItemsForCustomerOverviewActions(
    CUSTOMER_OVERVIEW_MORE_ACTIONS,
    selectedCustomerIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(CUSTOMER_OVERVIEW_CREATE);
  const createCustomerTypeOption = canCreateCustomerTypes
    ? [
        {
          label: intl.formatMessage({
            id: "qC83EA",
            defaultMessage: "Create customer type",
            description: "button",
          }),
          testId: "create-customer-type",
          onSelect: onCreateCustomerType,
        },
      ]
    : [];
  const showCreateSplitButton =
    createCustomerTypeOption.length > 0 || extensionCreateButtonItems.length > 0;
  const createHref =
    selectedTypeIds.length === 1
      ? customerAddUrl({ "customer-type-id": selectedTypeIds[0] })
      : customerAddUrl();
  const createLabel = activeCustomerTypeName ? (
    <FormattedMessage
      id="aGBp6V"
      defaultMessage="Create {typeName}"
      description="create customer of the selected type"
      values={{ typeName: activeCustomerTypeName }}
    />
  ) : (
    <FormattedMessage id="QLVddq" defaultMessage="Create customer" description="button" />
  );

  return (
    <ListPageLayout>
      <TopNav title={intl.formatMessage(sectionNames.customers)} withoutBorder>
        {extensionMenuItems.length > 0 && <TopNav.Menu items={extensionMenuItems} />}
        {canEditCustomers &&
          (showCreateSplitButton ? (
            <ButtonGroupWithDropdown
              pinnedOptions={createCustomerTypeOption}
              options={extensionCreateButtonItems}
              testId="create-customer"
              onClick={() => navigate(createHref)}
            >
              {createLabel}
            </ButtonGroupWithDropdown>
          ) : (
            <Button data-test-id="create-customer" onClick={() => navigate(createHref)}>
              {createLabel}
            </Button>
          ))}
      </TopNav>
      <Box display="flex" flexDirection="column" __minWidth={0} __minHeight={0}>
        <CustomerTypeTabs
          customerTypes={customerTypes}
          selectedIds={selectedTypeIds}
          counts={tabCounts}
          onTabChange={onTabChange}
          rightSlot={<Ripple model={rippleCustomerTypes} />}
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
            <Box display="flex" alignItems="center" gap={4}>
              <ExpressionFilters />
              <ListSearchInput
                initialSearch={initialSearch}
                placeholder={intl.formatMessage({
                  id: "bVjFta",
                  defaultMessage: "Search customers",
                })}
                onSearchChange={onSearchChange}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {canEditCustomers && selectedCustomerIds.length > 0 && (
                <BulkDeleteButton count={selectedCustomerIds.length} onClick={onCustomersDelete}>
                  <FormattedMessage defaultMessage="Delete customers" id="kFsTMN" />
                </BulkDeleteButton>
              )}
            </Box>
          </Box>
          <CustomerListDatagrid
            {...customerListProps}
            searchQuery={initialSearch}
            rowAnchor={customerUrl}
            onRowClick={id => navigate(customerUrl(id))}
          />
        </DashboardCard>
      </Box>
    </ListPageLayout>
  );
};

CustomerListPage.displayName = "CustomerListPage";
export default CustomerListPage;
