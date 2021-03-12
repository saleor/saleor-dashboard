import {
  Card,
  CardContent,
  ClickAwayListener,
  Typography
} from "@material-ui/core";
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

interface ShippingZonesCardProps {
  zones: Channel_channel_shippingZones[];
  onSearch: (searchPhrase: string) => void;
  isLoadingZones: boolean;
}

const ShippingZonesCard: React.FC<ShippingZonesCardProps> = ({
  onSearch,
  isLoadingZones,
  zones
}) => {
  const intl = useIntl();
  const choicesMenuRef = useRef<HTMLDivElement>(null);

  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [isChoicesSelectShown, setIsChoicesSelectShown] = useState<boolean>(
    false
  );

  const handleToggleListOpen = () => setIsListOpen(!isListOpen);

  return (
    <Card ref={choicesMenuRef}>
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
          zonesCount={zones?.length}
          isListOpen={isListOpen}
          onOpenChange={handleToggleListOpen}
        />
        {zones.map(zone => (
          <ShippingZoneItem zone={zone} />
        ))}
        {isChoicesSelectShown ? (
          <ClickAwayListener onClickAway={() => setIsChoicesSelectShown(false)}>
            <div ref={choicesMenuRef}>
              <SingleAutocompleteSelectField
                ref={choicesMenuRef}
                useNakedInput
                name="shippingZone"
                choices={mapNodeToChoice(zones)}
                fetchChoices={onSearch}
                // onChange={() => {}}
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
