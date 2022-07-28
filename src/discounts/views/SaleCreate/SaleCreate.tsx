import { ChannelsAction } from "@saleor/channels/urls";
import { createSortedSaleData } from "@saleor/channels/utils";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import SaleCreatePage from "@saleor/discounts/components/SaleCreatePage";
import { ChannelSaleFormData } from "@saleor/discounts/components/SaleDetailsPage";
import {
  saleAddUrl,
  SaleCreateUrlQueryParams,
  saleListUrl,
  saleUrl,
} from "@saleor/discounts/urls";
import {
  useSaleChannelListingUpdateMutation,
  useSaleCreateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@saleor/graphql";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { sectionNames } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import React from "react";
import { useIntl } from "react-intl";

import { SALE_CREATE_FORM_ID } from "./consts";
import { createHandler } from "./handlers";

interface SaleCreateProps {
  params: SaleCreateUrlQueryParams;
}

export const SaleCreateView: React.FC<SaleCreateProps> = ({ params }) => {
  const navigate = useNavigator();
  const pushMessage = useNotifier();
  const intl = useIntl();

  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsAction,
    SaleCreateUrlQueryParams
  >(navigate, params => saleAddUrl(params), params);

  const { availableChannels } = useAppChannel(false);
  const allChannels: ChannelSaleFormData[] = createSortedSaleData(
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
    { formId: SALE_CREATE_FORM_ID },
  );

  const [
    updateChannels,
    updateChannelsOpts,
  ] = useSaleChannelListingUpdateMutation({});

  const [saleCreate, saleCreateOpts] = useSaleCreateMutation({
    onCompleted: data => {
      if (data.saleCreate.errors.length === 0) {
        pushMessage({
          status: "success",
          text: intl.formatMessage({
            id: "n7Fg8i",
            defaultMessage: "Successfully created sale",
          }),
        });
        navigate(saleUrl(data.saleCreate.sale.id), { replace: true });
      }
    },
  });

  const handleCreate = createHandler(
    variables => saleCreate({ variables }),
    updateChannels,
  );
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata,
  );

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.sales)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            id: "ESDTC/",
            defaultMessage: "Manage Sales Channel Availability",
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <SaleCreatePage
        allChannelsCount={allChannels?.length}
        channelListings={currentChannels}
        disabled={saleCreateOpts.loading || updateChannelsOpts.loading}
        errors={[
          ...(saleCreateOpts.data?.saleCreate.errors || []),
          ...(updateChannelsOpts.data?.saleChannelListingUpdate.errors || []),
        ]}
        onBack={() => navigate(saleListUrl())}
        onSubmit={handleSubmit}
        saveButtonBarState={saleCreateOpts.status}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
      />
    </>
  );
};
export default SaleCreateView;
