import { Card, CardContent, Typography } from "@material-ui/core";
import { ChannelWarehouses } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CardTitle from "@saleor/components/CardTitle";
import { SearchWarehousesQuery } from "@saleor/graphql";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignmentList from "../AssignmentList";

const messages = defineMessages({
  title: {
    id: "yv/bIV",
    defaultMessage: "Warehouses",
    description: "card title",
  },
  subtitle: {
    id: "ImTelT",
    defaultMessage:
      "Select warehouses that will be used in this channel. You can assign warehouses to multiple channels.",
    description: "card subtitle",
  },
});

interface WarehousesCardProps {
  addWarehouse: (id: string) => void;
  removeWarehouse: (id: string) => void;
  searchWarehouses: (searchPhrase: string) => void;
  fetchMoreWarehouses: FetchMoreProps;
  warehouses: ChannelWarehouses;
  warehousesChoices: RelayToFlat<SearchWarehousesQuery["search"]>;
}

const WarehousesCard: React.FC<WarehousesCardProps> = props => {
  const {
    addWarehouse,
    removeWarehouse,
    searchWarehouses,
    fetchMoreWarehouses,
    warehouses,
    warehousesChoices,
  } = props;

  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      </CardContent>
      <AssignmentList
        items={warehouses}
        itemsChoices={warehousesChoices}
        addItem={addWarehouse}
        removeItem={removeWarehouse}
        searchItems={searchWarehouses}
        fetchMoreItems={fetchMoreWarehouses}
        dataTestId="warehouse"
        inputName="warehouse"
        itemsName={intl.formatMessage(messages.title)}
      />
    </Card>
  );
};
export default WarehousesCard;
