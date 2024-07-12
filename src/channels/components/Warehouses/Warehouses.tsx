import { ChannelWarehouses } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { DashboardCard } from "@dashboard/components/Card";
import { SearchWarehousesQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { FetchMoreProps, RelayToFlat, ReorderAction } from "@dashboard/types";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import AssignmentList from "../AssignmentList";
import { messages } from "./messages";

export interface WarehousesProps {
  addWarehouse: (id: string) => void;
  removeWarehouse: (id: string) => void;
  searchWarehouses: (searchPhrase: string) => void;
  reorderWarehouses: ReorderAction;
  loading: boolean;
  totalCount: number;
  fetchMoreWarehouses: FetchMoreProps;
  warehouses: ChannelWarehouses;
  warehousesChoices: RelayToFlat<SearchWarehousesQuery["search"]>;
}

const Warehouses: React.FC<WarehousesProps> = props => {
  const {
    addWarehouse,
    removeWarehouse,
    searchWarehouses,
    reorderWarehouses,
    loading,
    totalCount,
    fetchMoreWarehouses,
    warehouses,
    warehousesChoices,
  } = props;
  const intl = useIntl();

  return (
    <DashboardCard data-test-id="warehouses-section">
      <DashboardCard.Title>{intl.formatMessage(sectionNames.warehouses)}</DashboardCard.Title>
      <DashboardCard.Content>
        <Text>{intl.formatMessage(messages.subtitle)}</Text>
      </DashboardCard.Content>
      <AssignmentList
        loading={loading}
        items={warehouses}
        itemsChoices={warehousesChoices!}
        addItem={addWarehouse}
        removeItem={removeWarehouse}
        searchItems={searchWarehouses}
        reorderItem={reorderWarehouses}
        fetchMoreItems={fetchMoreWarehouses}
        totalCount={totalCount}
        dataTestId="warehouse"
        inputName="warehouse"
        itemsName={intl.formatMessage(sectionNames.warehouses)}
      />
    </DashboardCard>
  );
};

export default Warehouses;
