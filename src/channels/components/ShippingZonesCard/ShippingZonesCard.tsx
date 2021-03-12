import {
  Card,
  CardContent,
  ClickAwayListener,
  Typography
} from "@material-ui/core";
import { ChannelDetailsContextConsumerProps } from "@saleor/channels/pages/ChannelDetailsPage/ChannelDetailsProvider/ChannelDetailsProvider";
import { Channel_channel_shippingZones } from "@saleor/channels/types/Channel";
import CardTitle from "@saleor/components/CardTitle";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import CardAddItemsFooter from "@saleor/products/components/ProductStocks/CardAddItemsFooter";
import { mapNodeToChoice } from "@saleor/utils/maps";
import React, { useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import ShippingZoneItem from "./ShippingZoneItem";
import ShippingZonesListHeader from "./ShippingZonesListHeader";

const messages = defineMessages({
  title: {
    defaultMessage: "Shipping Zones",
    description: "card title"
  },
  subtitle: {
    defaultMessage:
      "Select Shipping Zones that will be supplied via this channel. You can assign Shipping Zones to multiple channels.",
    description: "card subtitle"
  },
  addZoneTitle: {
    defaultMessage: "Add Shipping Zones",
    description: "add shipping zone title"
  }
});

interface ShippingZonesCardProps extends ChannelDetailsContextConsumerProps {}

const ShippingZonesCard: React.FC<ShippingZonesCardProps> = ({
  searchShippingZones: onSearch,
  shippingZones,
  shippingZonesChoices,
  addShippingZone,
  removeShippingZone,
  fetchMoreShippingZones
}) => {
  const intl = useIntl();
  const choicesMenuRef = useRef(null);

  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [isChoicesSelectShown, setIsChoicesSelectShown] = useState<boolean>(
    false
  );

  const handleToggleListOpen = () => setIsListOpen(!isListOpen);

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      {/* 
      {loading && (
        <CardContent>
          <Skeleton />
        </CardContent>
      )} */}

      {/* {!loading && ( */}
      <>
        <CardContent>
          <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
        </CardContent>
        <ShippingZonesListHeader
          zonesCount={shippingZones?.length}
          isListOpen={isListOpen}
          onOpenChange={handleToggleListOpen}
        />
        {shippingZones.map(zone => (
          <ShippingZoneItem zone={zone} onDelete={removeShippingZone} />
        ))}
        {isChoicesSelectShown ? (
          <ClickAwayListener onClickAway={() => setIsChoicesSelectShown(false)}>
            <div ref={choicesMenuRef}>
              <SingleAutocompleteSelectField
                useNakedInput
                name="shippingZone"
                choices={mapNodeToChoice(shippingZonesChoices)}
                fetchChoices={onSearch}
                {...fetchMoreShippingZones}
                onChange={({ target }) => addShippingZone(target.value)}
              />
            </div>
          </ClickAwayListener>
        ) : (
          <CardAddItemsFooter
            onAdd={() => setIsChoicesSelectShown(true)}
            title={messages.addZoneTitle}
            testIds={{
              link: "add-shipping-zone-link",
              button: "add-shipping-zone-button"
            }}
          />
        )}
      </>
      {/* )} */}
    </Card>
  );
};

export default ShippingZonesCard;
