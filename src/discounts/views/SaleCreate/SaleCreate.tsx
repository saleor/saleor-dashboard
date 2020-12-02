import { useChannelsList } from "@saleor/channels/queries";
import { ChannelsAction } from "@saleor/channels/urls";
import { ChannelSaleData, createSortedSaleData } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import SaleCreatePage from "@saleor/discounts/components/SaleCreatePage";
import {
  TypedSaleCreate,
  useSaleChannelListingUpdate
} from "@saleor/discounts/mutations";
import { SaleCreate } from "@saleor/discounts/types/SaleCreate";
import {
  saleAddUrl,
  SaleCreateUrlQueryParams,
  saleListUrl,
  saleUrl
} from "@saleor/discounts/urls";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { sectionNames } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import { createHandler } from "./handlers";

interface SaleCreateProps {
  params: SaleCreateUrlQueryParams;
}

export const SaleCreateView: React.FC<SaleCreateProps> = ({ params }) => {
  const navigate = useNavigator();
  const pushMessage = useNotifier();
  const intl = useIntl();

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsAction,
    SaleCreateUrlQueryParams
  >(navigate, params => saleAddUrl(params), params);

  const { data: channelsData } = useChannelsList({});
  const allChannels: ChannelSaleData[] = createSortedSaleData(
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

  const [updateChannels, updateChannelsOpts] = useSaleChannelListingUpdate({});

  const handleSaleCreate = (data: SaleCreate) => {
    if (data.saleCreate.errors.length === 0) {
      pushMessage({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Successfully created sale"
        })
      });
      navigate(saleUrl(data.saleCreate.sale.id), true);
    }
  };

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
            defaultMessage: "Manage Sales Channel Availability"
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <TypedSaleCreate onCompleted={handleSaleCreate}>
        {(saleCreate, saleCreateOpts) => {
          const handleSubmit = createHandler(
            variables => saleCreate({ variables }),
            updateChannels
          );
          return (
            <>
              <WindowTitle title={intl.formatMessage(sectionNames.sales)} />
              <SaleCreatePage
                allChannelsCount={allChannels?.length}
                channelListings={currentChannels}
                disabled={saleCreateOpts.loading || updateChannelsOpts.loading}
                errors={[
                  ...(saleCreateOpts.data?.saleCreate.errors || []),
                  ...(updateChannelsOpts.data?.saleChannelListingUpdate
                    .errors || [])
                ]}
                onBack={() => navigate(saleListUrl())}
                onSubmit={handleSubmit}
                saveButtonBarState={saleCreateOpts.status}
                openChannelsModal={handleChannelsModalOpen}
                onChannelsChange={setCurrentChannels}
              />
            </>
          );
        }}
      </TypedSaleCreate>
    </>
  );
};
export default SaleCreateView;
