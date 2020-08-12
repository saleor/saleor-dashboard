import DialogContentText from "@material-ui/core/DialogContentText";
import { useChannelsList } from "@saleor/channels/queries";
import { ChannelData, createChannelsData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useListActions from "@saleor/hooks/useListActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import WeightRatesPage, {
  FormData
} from "@saleor/shipping/components/WeightRatesPage";
import {
  useShippingRateDelete,
  useShippingRateUpdate
} from "@saleor/shipping/mutations";
import { useShippingZone } from "@saleor/shipping/queries";
import { shippingZoneUrl } from "@saleor/shipping/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getUpdateShippingRateVariables } from "./data";

const channels = [
  { id: "1", maxValue: 12, minValue: 1, name: "channel", price: 23 },
  { id: "2", maxValue: 30, minValue: 10, name: "test", price: 11 }
];

export interface WeightRatesUpdateProps {
  id: string;
  rateId: string;
}

export const WeightRatesUpdate: React.FC<WeightRatesUpdateProps> = ({
  id,
  rateId
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading } = useShippingZone({
    displayLoader: true,
    variables: { id }
  });

  const rate = data?.shippingZone?.shippingMethods.find(
    rate => rate.id === rateId
  );

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

  const [openModal, setOpenModal] = React.useState(false);

  const [updateShippingRate, updateShippingRateOpts] = useShippingRateUpdate({
    onCompleted: data => {
      if (data.shippingPriceUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });

  const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
    onCompleted: data => {
      if (data.shippingPriceDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(shippingZoneUrl(id));
      }
    }
  });

  const handleDelete = () => setOpenModal(true);
  const handleSubmit = (data: FormData) => {
    updateShippingRate({
      variables: getUpdateShippingRateVariables(data, rateId, id)
    });
  };
  const handleBack = () => navigate(shippingZoneUrl(id));

  return (
    <>
      <WindowTitle title={"shipping weight rates"} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Channels Availability"
          })}
          confirmButtonState="default"
          onConfirm={handleChannelsConfirm}
        />
      )}
      <ActionDialog
        confirmButtonState={deleteShippingRateOpts.status}
        onClose={() => setOpenModal(false)}
        onConfirm={() =>
          deleteShippingRate({
            variables: {
              id: rateId
            }
          })
        }
        open={openModal}
        title={intl.formatMessage({
          defaultMessage: "Delete Shipping Method",
          description: "dialog header"
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {name}?"
            description="delete shipping method"
            id="shippingZoneDetailsDialogsDeleteShippingMethod"
            values={{
              name: getStringOrPlaceholder(rate?.name)
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <WeightRatesPage
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
        disabled={loading}
        saveButtonBarState={updateShippingRateOpts.status}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onBack={handleBack}
        rate={rate}
        errors={updateShippingRateOpts.data?.shippingPriceUpdate.errors || []}
        openChannelsModal={() => setChannelsModalOpen(true)}
      />
    </>
  );
};

export default WeightRatesUpdate;
