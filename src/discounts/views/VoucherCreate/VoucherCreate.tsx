import { ChannelsAction } from "@saleor/channels/urls";
import {
  ChannelVoucherData,
  createSortedVoucherData,
} from "@saleor/channels/utils";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVoucherChannelListingUpdateMutation,
  useVoucherCreateMutation,
} from "@saleor/graphql";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { sectionNames } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import React from "react";
import { useIntl } from "react-intl";

import VoucherCreatePage from "../../components/VoucherCreatePage";
import {
  voucherAddUrl,
  VoucherCreateUrlQueryParams,
  voucherUrl,
} from "../../urls";
import { createHandler } from "./handlers";
import { VOUCHER_CREATE_FORM_ID } from "./types";

interface VoucherCreateProps {
  params: VoucherCreateUrlQueryParams;
}

export const VoucherCreateView: React.FC<VoucherCreateProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsAction,
    VoucherCreateUrlQueryParams
  >(navigate, params => voucherAddUrl(params), params);

  const { availableChannels } = useAppChannel(false);
  const allChannels: ChannelVoucherData[] = createSortedVoucherData(
    availableChannels,
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
    toggleAllChannels,
  } = useChannels(
    allChannels,
    params?.action,
    { closeModal, openModal },
    { formId: VOUCHER_CREATE_FORM_ID },
  );

  const [
    updateChannels,
    updateChannelsOpts,
  ] = useVoucherChannelListingUpdateMutation({});

  const [voucherCreate, voucherCreateOpts] = useVoucherCreateMutation({
    onCompleted: data => {
      if (data.voucherCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "Q8mpW3",
            defaultMessage: "Successfully created voucher",
          }),
        });
        navigate(voucherUrl(data.voucherCreate.voucher.id), { replace: true });
      }
    },
  });

  const handleCreate = createHandler(
    variables => voucherCreate({ variables }),
    updateChannels,
  );
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata,
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
            id: "Eau5AV",
            defaultMessage: "Manage Products Channel Availability",
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
        disabled={voucherCreateOpts.loading || updateChannelsOpts.loading}
        errors={[
          ...(voucherCreateOpts.data?.voucherCreate.errors || []),
          ...(updateChannelsOpts.data?.voucherChannelListingUpdate.errors ||
            []),
        ]}
        onSubmit={handleSubmit}
        saveButtonBarState={voucherCreateOpts.status}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
      />
    </>
  );
};
export default VoucherCreateView;
