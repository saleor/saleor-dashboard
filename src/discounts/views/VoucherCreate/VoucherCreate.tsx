// @ts-strict-ignore
import { ChannelVoucherData, createSortedVoucherData } from "@dashboard/channels/utils";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import {
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVoucherChannelListingUpdateMutation,
  useVoucherCreateMutation,
} from "@dashboard/graphql";
import useChannels from "@dashboard/hooks/useChannels";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { sectionNames } from "@dashboard/intl";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import React from "react";
import { useIntl } from "react-intl";

import VoucherCreatePage from "../../components/VoucherCreatePage";
import {
  voucherAddUrl,
  VoucherCreateUrlQueryParams,
  voucherUrl,
  VoucherUrlDialog,
} from "../../urls";
import { createHandler } from "./handlers";
import { VOUCHER_CREATE_FORM_ID } from "./types";

interface VoucherCreateProps {
  params: VoucherCreateUrlQueryParams;
}

export const VoucherCreateView = ({ params }: VoucherCreateProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [openModal, closeModal] = createDialogActionHandlers<
    VoucherUrlDialog,
    VoucherCreateUrlQueryParams
  >(navigate, params => voucherAddUrl(params), params);
  const { availableChannels } = useAppChannel(false);
  const allChannels: ChannelVoucherData[] = createSortedVoucherData(availableChannels);
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
  const [updateChannels, updateChannelsOpts] = useVoucherChannelListingUpdateMutation({});
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
  const handleFormValidate = (data: VoucherDetailsPageFormData) => {
    if (data.codes.length === 0) {
      notify({
        status: "error",
        text: intl.formatMessage({
          id: "GTCg9O",
          defaultMessage: "You must add at least one voucher code",
        }),
      });

      return false;
    }

    return true;
  };
  const handleCreate = createHandler(
    variables => voucherCreate({ variables }),
    updateChannels,
    handleFormValidate,
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
          ...(updateChannelsOpts.data?.voucherChannelListingUpdate.errors || []),
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
