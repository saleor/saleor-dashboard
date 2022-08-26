import { Card, CardContent, Typography } from "@material-ui/core";
import { ChannelWarehouses } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CardTitle from "@saleor/components/CardTitle";
import { SearchWarehousesQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { FetchMoreProps, RelayToFlat, ReorderAction } from "@saleor/types";
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
    <Card>
      <CardTitle title={intl.formatMessage(sectionNames.warehouses)} />
      <CardContent>
        <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      </CardContent>
      <AssignmentList
        loading={loading}
        items={warehouses}
        itemsChoices={warehousesChoices}
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
