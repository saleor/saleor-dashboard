import { Card, CardContent, Typography } from "@material-ui/core";
import { ChannelWarehouses } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CardTitle from "@saleor/components/CardTitle";
import { SearchWarehousesQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignmentList from "../AssignmentList";

const messages = defineMessages({
  subtitle: {
    id: "ImTelT",
    defaultMessage:
      "Select warehouses that will be used in this channel. You can assign warehouses to multiple channels.",
    description: "card subtitle",
  },
});

interface WarehousesProps {
  addWarehouse: (id: string) => void;
  removeWarehouse: (id: string) => void;
  searchWarehouses: (searchPhrase: string) => void;
  fetchMoreWarehouses: FetchMoreProps;
  warehouses: ChannelWarehouses;
  warehousesChoices: RelayToFlat<SearchWarehousesQuery["search"]>;
}

const Warehouses: React.FC<WarehousesProps> = props => {
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
      <CardTitle title={intl.formatMessage(sectionNames.warehouses)} />
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
        itemsName={intl.formatMessage(sectionNames.warehouses)}
      />
    </Card>
  );
};
export default Warehouses;
