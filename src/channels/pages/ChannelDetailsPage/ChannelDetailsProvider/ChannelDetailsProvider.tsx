import { Channel_channel } from "@saleor/channels/types/Channel";
import { remove } from "lodash";
import uniq from "lodash-es/uniq";
import React, { createContext, useState } from "react";

interface ChannelDetailsProviderProps {
  channel: Channel_channel;
  children: React.ReactNode;
}

const ChannelDetailsProvider: React.FC<ChannelDetailsProviderProps> = ({
  children,
  channel
}) => {
  const initialData = {
    shippingZones: channel.shippingZones.map(zone => zone.id)
  };

  const [shippingZones, setShippingZones] = useState<Array<string>>(
    initialData.shippingZones
  );

  const addShippingZone = (zoneId: string) =>
    setShippingZones(uniq([...shippingZones, zoneId]));

  const removeShippingZone = (zoneId: string) =>
    setShippingZones(remove(shippingZones, zoneId));

  const contextValues = {
    shippingZones: shippingZones,
    addShippingZone,
    removeShippingZone
  };

  return (
    <ChannelDetailsContext.Provider value={contextValues}>
      {children}
    </ChannelDetailsContext.Provider>
  );
};

export default ChannelDetailsProvider;

export const ChannelDetailsContext = createContext<
  ChannelDetailsContextConsumerProps
>(null);
