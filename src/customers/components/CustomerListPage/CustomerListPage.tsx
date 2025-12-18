// @ts-strict-ignore
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { Customers } from "@dashboard/customers/types";
import { customerAddUrl, CustomerListUrlSortField, customerUrl } from "@dashboard/customers/urls";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForCustomerOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { FilterPagePropsWithPresets, PageListProps, SortPage } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerListDatagrid } from "../CustomerListDatagrid/CustomerListDatagrid";
import { CustomerFilterKeys, CustomerListFilterOpts } from "./filters";

interface CustomerListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<CustomerFilterKeys, CustomerListFilterOpts>,
    SortPage<CustomerListUrlSortField> {
  customers: Customers | undefined;
  selectedCustomerIds: string[];
  loading: boolean;
  onSelectCustomerIds: (rows: number[], clearSelection: () => void) => void;
  onCustomersDelete: () => void;
}

const CustomerListPage = ({
  selectedFilterPreset,
  initialSearch,
  onFilterPresetsAll,
  onFilterPresetDelete,
  onFilterPresetUpdate,
  onSearchChange,
  onFilterPresetChange,
  onFilterPresetPresetSave,
  filterPresets,
  selectedCustomerIds,
  hasPresetsChanged,
  onCustomersDelete,
  ...customerListProps
}: CustomerListPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const { CUSTOMER_OVERVIEW_CREATE, CUSTOMER_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.CUSTOMER_LIST,
  );
  const extensionMenuItems = getExtensionsItemsForCustomerOverviewActions(
    CUSTOMER_OVERVIEW_MORE_ACTIONS,
    selectedCustomerIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(CUSTOMER_OVERVIEW_CREATE);

  return (
    <>
      <TopNav
        title={intl.formatMessage(sectionNames.customers)}
        withoutBorder
        isAlignToRight={false}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
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
                id: "D95l71",
                defaultMessage: "All customers",
                description: "tab name",
              })}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {extensionMenuItems.length > 0 && <TopNav.Menu items={extensionMenuItems} />}
            {extensionCreateButtonItems.length > 0 ? (
              <ButtonGroupWithDropdown
                options={extensionCreateButtonItems}
                data-test-id="create-customer"
                onClick={() => navigate(customerAddUrl)}
              >
                <FormattedMessage
                  id="QLVddq"
                  defaultMessage="Create customer"
                  description="button"
                />
              </ButtonGroupWithDropdown>
            ) : (
              <Button data-test-id="create-customer" onClick={() => navigate(customerAddUrl)}>
                <FormattedMessage
                  id="QLVddq"
                  defaultMessage="Create customer"
                  description="button"
                />
              </Button>
            )}
          </Box>
        </Box>
      </TopNav>
      <Box>
        <ListFilters
          type="expression-filter"
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "kdRcqU",
            defaultMessage: "Search customers...",
          })}
          onSearchChange={onSearchChange}
          actions={
            <Box display="flex" gap={4}>
              {selectedCustomerIds.length > 0 && (
                <BulkDeleteButton onClick={onCustomersDelete}>
                  <FormattedMessage defaultMessage="Delete customers" id="kFsTMN" />
                </BulkDeleteButton>
              )}
            </Box>
          }
        />
        <CustomerListDatagrid
          {...customerListProps}
          hasRowHover={!isFilterPresetOpen}
          rowAnchor={customerUrl}
          onRowClick={id => navigate(customerUrl(id))}
        />
      </Box>
    </>
  );
};

CustomerListPage.displayName = "CustomerListPage";
export default CustomerListPage;
