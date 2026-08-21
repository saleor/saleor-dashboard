import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createCustomerWhereVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { CreateCustomerTypeDialog } from "@dashboard/customerTypes/components/CreateCustomerTypeDialog/CreateCustomerTypeDialog";
import { useCreateCustomerType } from "@dashboard/customerTypes/hooks/useCreateCustomerType";
import {
  CustomerTypeSortField,
  type CustomerWhereInput,
  OrderDirection,
  useBulkRemoveCustomersMutation,
  useCustomerTypeListQuery,
  useListCustomersQuery,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { sectionNames } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import commonErrorMessages from "@dashboard/utils/errors/common";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";

import { CustomerBulkDeleteDialog } from "../../components/CustomerBulkDeleteDialog/CustomerBulkDeleteDialog";
import CustomerListPage from "../../components/CustomerListPage";
import {
  ALL_CUSTOMERS_TAB_ID,
  type CustomerTypeTabCount,
} from "../../components/CustomerTypeTabs/CustomerTypeTabs";
import {
  customerListUrl,
  type CustomerListUrlDialog,
  type CustomerListUrlQueryParams,
} from "../../urls";
import { getFilterQueryParam } from "./filters";
import { getSortQueryVariables } from "./sort";
import { useCustomerTypeTabCounts } from "./useCustomerTypeTabCounts";

interface CustomerListProps {
  params: CustomerListUrlQueryParams;
}

const normalizeCustomerTypes = (
  value: string | string[] | Record<string, string> | undefined,
): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return [...new Set(value.filter(Boolean))];
  }

  if (typeof value === "object") {
    return [...new Set(Object.values(value).filter(Boolean))];
  }

  return [value];
};

const mergeCustomerListWhere = (
  filterWhere: CustomerWhereInput,
  selectedCustomerTypes: string[],
): CustomerWhereInput | undefined => {
  const typeWhere: CustomerWhereInput | undefined =
    selectedCustomerTypes.length === 0
      ? undefined
      : selectedCustomerTypes.length === 1
        ? { customerType: { eq: selectedCustomerTypes[0] } }
        : { customerType: { oneOf: selectedCustomerTypes } };
  const hasFilterWhere = Object.keys(filterWhere).length > 0;

  if (typeWhere && hasFilterWhere) {
    return { AND: [filterWhere, typeWhere] };
  }

  if (typeWhere) {
    return typeWhere;
  }

  if (hasFilterWhere) {
    return filterWhere;
  }

  return undefined;
};

const CustomerList = ({ params }: CustomerListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.CUSTOMER_LIST);
  const { valueProvider } = useConditionalFilterContext();
  const filterWhere = createCustomerWhereVariables(valueProvider.value);

  usePaginationReset(customerListUrl, params, settings.rowNumber);

  const selectedCustomerTypesKey = Array.isArray(params.customerTypes)
    ? params.customerTypes.join(",")
    : (params.customerTypes ?? "");
  const selectedCustomerTypes = useMemo(
    () => normalizeCustomerTypes(params.customerTypes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCustomerTypesKey],
  );

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);
  const paginationState = createPaginationState(settings.rowNumber, params);
  const where = useMemo(
    () => mergeCustomerListWhere(filterWhere, selectedCustomerTypes),
    [filterWhere, selectedCustomerTypes],
  );
  const newQueryVariables = useMemo(
    () => ({
      ...paginationState,
      where,
      search: params.query,
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber, where],
  );

  const { data, refetch } = useListCustomersQuery({
    displayLoader: true,
    variables: newQueryVariables,
  });
  const customers = mapEdgesToItems(data?.customers);
  const { data: customerTypesData, loading: customerTypesLoading } = useCustomerTypeListQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      first: 100,
      sort: { field: CustomerTypeSortField.NAME, direction: OrderDirection.ASC },
    },
  });
  const customerTypes = useMemo(
    () => mapEdgesToItems(customerTypesData?.customerTypes) ?? undefined,
    [customerTypesData],
  );

  // Drop type ids that are absent from the tab list only when some ids are still recognized.
  // Keep the URL filter when none are in the tab list (e.g. outside the first fetched page),
  // so deep-linked type tabs still filter the list server-side.
  useEffect(
    function dropUnknownCustomerTypeIds() {
      if (!customerTypes || customerTypesLoading || selectedCustomerTypes.length === 0) {
        return;
      }

      const validIds = selectedCustomerTypes.filter(id =>
        customerTypes.some(customerType => customerType.id === id),
      );

      if (validIds.length === selectedCustomerTypes.length || validIds.length === 0) {
        return;
      }

      navigate(
        customerListUrl({
          ...params,
          customerTypes: validIds,
        }),
        { replace: true },
      );
    },
    // Sanitize when the tab selection or type catalog changes. Spreading `params` from this
    // render preserves search/sort; do not depend on the whole params object (new each render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCustomerTypes, customerTypes, customerTypesLoading, navigate],
  );

  const { counts, setCount, fetchers } = useCustomerTypeTabCounts({
    customerTypes,
    selectedCustomerTypes,
    allTabId: ALL_CUSTOMERS_TAB_ID,
    pageSize: settings.rowNumber,
  });

  const activeCount: CustomerTypeTabCount | undefined = data?.customers
    ? {
        value: data.customers.edges.length,
        hasMore: !!data.customers.pageInfo.hasNextPage,
      }
    : undefined;
  const activeTabCountKey =
    selectedCustomerTypes.length === 1 ? selectedCustomerTypes[0] : ALL_CUSTOMERS_TAB_ID;

  useEffect(
    function syncActiveTabCount() {
      if (activeCount) {
        setCount(activeTabCountKey, activeCount);
      }
    },
    [activeCount?.value, activeCount?.hasMore, activeTabCountKey, setCount],
  );

  const [, , handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: customerListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CustomerListUrlDialog,
    CustomerListUrlQueryParams
  >(navigate, customerListUrl, params);
  const createCustomerTypeDialog = useCreateCustomerType({ onClose: closeModal });
  const paginationValues = usePaginator({
    pageInfo: data?.customers?.pageInfo,
    paginationState,
    queryString: params,
  });
  const [bulkRemoveCustomers, bulkRemoveCustomersOpts] = useBulkRemoveCustomersMutation({
    onCompleted: data => {
      const errors = data.customerBulkDelete?.errors ?? [];

      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "xgPXGD", defaultMessage: "Customers deleted" }),
        });
        refetch();
        clearRowSelection();
        closeModal();

        return;
      }

      notify({
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError),
      });
    },
  });
  const handleSort = createSortHandler(navigate, customerListUrl, params);
  const handleTabChange = useCallback(
    (ids: string[]) => {
      clearRowSelection();
      navigate(
        customerListUrl({
          ...params,
          customerTypes: ids.length ? ids : undefined,
          after: undefined,
          before: undefined,
        }),
      );
    },
    [clearRowSelection, navigate, params],
  );
  const handleSetSelectedCustomerIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!customers) {
        return;
      }

      const rowsIds = rows.map(row => customers[row]?.id).filter(id => id !== undefined);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [customers, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );
  const activeCustomerType = useMemo(
    () =>
      selectedCustomerTypes.length === 1
        ? customerTypes?.find(customerType => customerType.id === selectedCustomerTypes[0])
        : undefined,
    [customerTypes, selectedCustomerTypes],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      {fetchers}
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <CustomerListPage
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        customers={customers}
        settings={settings}
        disabled={!data}
        loading={!data}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        selectedCustomerIds={selectedRowIds}
        onSelectCustomerIds={handleSetSelectedCustomerIds}
        sort={getSortParams(params)}
        onCustomersDelete={() => openModal("remove", { ids: selectedRowIds })}
        onCreateCustomerType={() => openModal("create-customer-type")}
        customerTypes={customerTypes}
        selectedTypeIds={selectedCustomerTypes}
        activeCustomerTypeName={activeCustomerType?.name}
        tabCounts={counts}
        onTabChange={handleTabChange}
      />
      <CreateCustomerTypeDialog
        open={params.action === "create-customer-type"}
        onClose={closeModal}
        {...createCustomerTypeDialog}
      />
      <CustomerBulkDeleteDialog
        confirmButtonState={bulkRemoveCustomersOpts.status}
        count={selectedRowIds?.length ?? 0}
        onClose={closeModal}
        onConfirm={() =>
          bulkRemoveCustomers({
            variables: {
              ids: selectedRowIds,
            },
          })
        }
        open={params.action === "remove" && selectedRowIds?.length > 0}
      />
    </PaginatorContext.Provider>
  );
};

export default CustomerList;
