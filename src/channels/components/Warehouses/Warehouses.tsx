import { ChannelWarehouses } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import CardTitle from "@dashboard/components/CardTitle";
import { SearchWarehousesQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { FetchMoreProps, RelayToFlat, ReorderAction } from "@dashboard/types";
import { Card, CardContent, Typography } from "@material-ui/core";
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
    <Card data-test-id="warehouses-section">
      <CardTitle title={intl.formatMessage(sectionNames.warehouses)} />
      <CardContent>
        <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      </CardContent>
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
    </Card>
  );
};
export default Warehouses;
