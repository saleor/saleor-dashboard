import { useChannelUpdateMutation } from "@saleor/channels/mutations";
import {
  Channel_channel,
  Channel_channel_shippingZones
} from "@saleor/channels/types/Channel";
import { ChannelUpdate } from "@saleor/channels/types/ChannelUpdate";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  getParsedSearchData,
  getSearchFetchMoreProps
} from "@saleor/hooks/makeTopLevelSearch/utils";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import {
  getById,
  getByUnmatchingId
} from "@saleor/orders/components/OrderReturnPage/utils";
import useShippingZonesSearch from "@saleor/searches/useShippingZonesSearch";
import { FetchMoreProps } from "@saleor/types";
import React, { createContext, useState } from "react";
import { useIntl } from "react-intl";
import { getUpdatedIdsWithNewId } from "./utils";

interface ChannelDetailsProviderProps {
  channel: Channel_channel;
  children: React.ReactNode;
}

type ShippingZonesIds = Array<string>;

export interface ChannelDetailsContextConsumerProps {
  shippingZones: Channel_channel_shippingZones[];
  addShippingZone: (id: string) => void;
  removeShippingZone: (id: string) => void;
  searchShippingZones: (searchPhrase: string) => void;
  fetchMoreShippingZones: FetchMoreProps;
  shippingZonesChoices: Array<{ id: string; name: string }>;
}

const ChannelDetailsProvider: React.FC<ChannelDetailsProviderProps> = ({
  children,
  channel
}) => {
  const [shippingZonesToDisplay, setShippingZonesToDisplay] = useState<
    Channel_channel_shippingZones[]
  >(channel?.shippingZones || []);
  const [shippingZonesIdsToRemove, setShippingZonesIdsToRemove] = useState<
    ShippingZonesIds
  >([]);
  const [shippingZonesIdsToAdd, setShippingZonesIdsToAdd] = useState<
    ShippingZonesIds
  >([]);

  // const intl = useIntl();
  // const notify = useNotifier();

  // const [updateChannel, updateChannelOpts] = useChannelUpdateMutation({
  //   onCompleted: ({ channelUpdate: { errors } }: ChannelUpdate) =>
  //     notify(getDefaultNotifierSuccessErrorData(errors, intl))
  // });

  const {
    loadMore: fetchMoreShippingZones,
    search: searchShippingZones,
    result: searchShippingZonesResult
  } = useShippingZonesSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const addShippingZone = (zoneId: string) => {
    setShippingZonesIdsToAdd(
      getUpdatedIdsWithNewId(shippingZonesIdsToAdd, zoneId)
    );

    setShippingZonesToDisplay([
      ...shippingZonesToDisplay,
      getParsedSearchData(searchShippingZonesResult).find(getById(zoneId))
    ]);
  };

  const removeShippingZone = (zoneId: string) => {
    setShippingZonesIdsToRemove(
      getUpdatedIdsWithNewId(shippingZonesIdsToRemove, zoneId)
    );

    setShippingZonesToDisplay(
      shippingZonesToDisplay.filter(getByUnmatchingId(zoneId))
    );
  };

  const getFilteredShippingZonesChoices = () =>
    getParsedSearchData(searchShippingZonesResult).filter(
      ({ id: searchedZoneId }) =>
        !shippingZonesToDisplay.map(({ id }) => id).includes(searchedZoneId)
    );

  const contextValues: ChannelDetailsContextConsumerProps = {
    shippingZonesChoices: getFilteredShippingZonesChoices(),
    shippingZones: shippingZonesToDisplay,
    addShippingZone,
    removeShippingZone,
    searchShippingZones,
    fetchMoreShippingZones: getSearchFetchMoreProps(
      searchShippingZonesResult,
      fetchMoreShippingZones
    )
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
