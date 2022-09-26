import { Card, CardContent, Typography } from "@material-ui/core";
import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CardTitle from "@saleor/components/CardTitle";
import { SearchShippingZonesQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import AssignmentList from "../AssignmentList";
import { messages } from "./messages";

export interface ShippingZonesProps {
  addShippingZone: (id: string) => void;
  removeShippingZone: (id: string) => void;
  searchShippingZones: (searchPhrase: string) => void;
  loading: boolean;
  totalCount: number;
  fetchMoreShippingZones: FetchMoreProps;
  shippingZones: ChannelShippingZones;
  shippingZonesChoices: RelayToFlat<SearchShippingZonesQuery["search"]>;
}

const ShippingZones: React.FC<ShippingZonesProps> = props => {
  const {
    addShippingZone,
    removeShippingZone,
    searchShippingZones,
    loading,
    totalCount,
    fetchMoreShippingZones,
    shippingZones,
    shippingZonesChoices,
  } = props;

  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(sectionNames.shippingZones)} />
      <CardContent>
        <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      </CardContent>
      <AssignmentList
        loading={loading}
        items={shippingZones}
        itemsChoices={shippingZonesChoices}
        addItem={addShippingZone}
        removeItem={removeShippingZone}
        searchItems={searchShippingZones}
        fetchMoreItems={fetchMoreShippingZones}
        totalCount={totalCount}
        dataTestId="shipping"
        inputName="shippingZone"
        itemsName={intl.formatMessage(sectionNames.shippingZones)}
      />
    </Card>
  );
};

export default ShippingZones;
