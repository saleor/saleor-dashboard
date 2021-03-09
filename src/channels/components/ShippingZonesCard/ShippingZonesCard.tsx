import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import { Channel_channel_shippingZones } from "@saleor/channels/types/Channel";
import CardTitle from "@saleor/components/CardTitle";
import { renderCollectionWithDividers } from "@saleor/misc";
import React, { useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import ShippingZoneItem from "./ShippingZoneItem";
import ShippingZonesInput from "./BorderlessInput";
import ShippingZonesListHeader from "./ShippingZonesListHeader";
import ShippingZonesPopupMenu from "./ShippingZonesPopupMenu";

const messages = defineMessages({
  title: {
    defaultMessage: "Shipping Zones",
    description: "card title"
  },
  subtitle: {
    defaultMessage:
      "Select Shipping Zones that will be supplied via this channel. You can assign Shipping Zones to multiple channels.",
    description: "card subtitle"
  }
});

interface ShippingZonesCardProps {
  zones: Channel_channel_shippingZones[];
}

const ShippingZonesCard: React.FC<ShippingZonesCardProps> = ({}) => {
  const intl = useIntl();
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const [isChoicesMenuOpen, setIsChoicesMenuOpen] = useState<boolean>(false);
  const choicesMenuRef = useRef<HTMLDivElement>(null);

  const zones = [
    {
      name: "Best shipping zone ever in the universe",
      id: "mlem"
    },
    {
      name: "Short name",
      id: "lol"
    }
  ];

  const handleToggleListOpen = () => setIsListOpen(!isListOpen);

  return (
    <Card ref={choicesMenuRef}>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      </CardContent>
      <ShippingZonesListHeader
        zonesCount={zones?.length}
        isListOpen={isListOpen}
        onOpenChange={handleToggleListOpen}
      />
      {renderCollectionWithDividers({
        collection: zones,
        renderItem: zone => <ShippingZoneItem zone={zone} />,
        renderDivider: () => <Divider />
      })}
      <ShippingZonesPopupMenu
        isOpen={isChoicesMenuOpen}
        anchor={choicesMenuRef}
      />
      <ShippingZonesInput />
    </Card>
  );
};

export default ShippingZonesCard;
