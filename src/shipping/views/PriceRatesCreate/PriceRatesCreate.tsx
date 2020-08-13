import { useChannelsList } from "@saleor/channels/queries";
import { ChannelData, createChannelsData } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useListActions from "@saleor/hooks/useListActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages } from "@saleor/intl";
import PriceRatesPage from "@saleor/shipping/components/PriceRatesPage";
import { useShippingRateCreate } from "@saleor/shipping/mutations";
import { useShippingZone } from "@saleor/shipping/queries";
import { shippingZoneUrl } from "@saleor/shipping/urls";
import React from "react";
import { useIntl } from "react-intl";

import { getCreateShippingRateVariables } from "./data";

const channels = [
  { id: "1", maxValue: 0, minValue: 0, name: "channel", price: 0 },
  { id: "2", maxValue: 0, minValue: 0, name: "test", price: 0 }
];
export interface PriceRatesCreateProps {
  id: string;
  params: any;
}

export const PriceRatesCreate: React.FC<PriceRatesCreateProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data } = useShippingZone({
    displayLoader: true,
    variables: { id }
  });

  const { data: channelsData } = useChannelsList({});
  const allChannels: ChannelData[] = createChannelsData(channelsData?.channels);
  const [currentChannels, setCurrentChannels] = useStateFromProps(allChannels);

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<ChannelData>(currentChannels, (a, b) => a.id === b.id);

  const [isChannelsModalOpen, setChannelsModalOpen] = React.useState(false);

  const handleChannelsModalClose = () => {
    setChannelsModalOpen(false);
    setChannels(currentChannels);
  };

  const handleChannelsConfirm = () => {
    setCurrentChannels(channelListElements);
    setChannelsModalOpen(false);
  };

  const [createShippingRate, createShippingRateOpts] = useShippingRateCreate({
    onCompleted: data => {
      if (data.shippingPriceCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });

  const handleSubmit = (data: any) =>
    createShippingRate({
      variables: getCreateShippingRateVariables(data, params, id)
    });
  const handleBack = () => navigate(shippingZoneUrl(id));

  return (
    <>
      <WindowTitle title={"price rates"} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Channel Availability"
          })}
          confirmButtonState="default"
          onConfirm={handleChannelsConfirm}
        />
      )}
      <PriceRatesPage
        channels={channels}
        shippingChannels={[
          {
            id: "1",
            isPublished: true,
            name: "channel",
            publicationDate: null
          },
          {
            id: "2",
            isPublished: true,
            name: "test",
            publicationDate: null
          }
        ]}
        disabled={false}
        saveButtonBarState={createShippingRateOpts?.status}
        onSubmit={handleSubmit}
        onBack={handleBack}
        errors={createShippingRateOpts.data?.shippingPriceCreate.errors || []}
        openChannelsModal={() => setChannelsModalOpen(true)}
      />
    </>
  );
};

export default PriceRatesCreate;
