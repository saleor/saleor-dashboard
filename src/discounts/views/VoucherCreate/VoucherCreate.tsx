import { useChannelsList } from "@saleor/channels/queries";
import { ChannelsAction } from "@saleor/channels/urls";
import {
  ChannelVoucherData,
  createSortedVoucherData
} from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { sectionNames } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import VoucherCreatePage from "../../components/VoucherCreatePage";
import {
  TypedVoucherCreate,
  useVoucherChannelListingUpdate
} from "../../mutations";
import { VoucherCreate } from "../../types/VoucherCreate";
import {
  voucherAddUrl,
  VoucherCreateUrlQueryParams,
  voucherListUrl,
  voucherUrl
} from "../../urls";
import { createHandler } from "./handlers";

interface VoucherCreateProps {
  params: VoucherCreateUrlQueryParams;
}

export const VoucherCreateView: React.FC<VoucherCreateProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsAction,
    VoucherCreateUrlQueryParams
  >(navigate, params => voucherAddUrl(params), params);

  const { data: channelsData } = useChannelsList({});
  const allChannels: ChannelVoucherData[] = createSortedVoucherData(
    channelsData?.channels
  );

  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels
  } = useChannels(allChannels, params?.action, { closeModal, openModal });

  const [updateChannels, updateChannelsOpts] = useVoucherChannelListingUpdate(
    {}
  );

  const handleVoucherCreate = (data: VoucherCreate) => {
    if (data.voucherCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Successfully created voucher"
        })
      });
      navigate(voucherUrl(data.voucherCreate.voucher.id), true);
    }
  };

  return (
    <TypedVoucherCreate onCompleted={handleVoucherCreate}>
      {(voucherCreate, voucherCreateOpts) => {
        const handleSubmit = createHandler(
          variables => voucherCreate({ variables }),
          updateChannels
        );
        return (
          <>
            {!!allChannels?.length && (
              <ChannelsAvailabilityDialog
                isSelected={isChannelSelected}
                disabled={!channelListElements.length}
                channels={allChannels}
                onChange={channelsToggle}
                onClose={handleChannelsModalClose}
                open={isChannelsModalOpen}
                title={intl.formatMessage({
                  defaultMessage: "Manage Products Channel Availability"
                })}
                confirmButtonState="default"
                selected={channelListElements.length}
                onConfirm={handleChannelsConfirm}
                toggleAll={toggleAllChannels}
              />
            )}
            <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
            <VoucherCreatePage
              allChannelsCount={allChannels?.length}
              channelListings={currentChannels}
              hasChannelChanged={
                allChannels?.length !== currentChannels?.length
              }
              disabled={voucherCreateOpts.loading || updateChannelsOpts.loading}
              errors={[
                ...(voucherCreateOpts.data?.voucherCreate.errors || []),
                ...(updateChannelsOpts.data?.voucherChannelListingUpdate
                  .errors || [])
              ]}
              onBack={() => navigate(voucherListUrl())}
              onSubmit={handleSubmit}
              saveButtonBarState={voucherCreateOpts.status}
              openChannelsModal={handleChannelsModalOpen}
              onChannelsChange={setCurrentChannels}
            />
          </>
        );
      }}
    </TypedVoucherCreate>
  );
};
export default VoucherCreateView;
