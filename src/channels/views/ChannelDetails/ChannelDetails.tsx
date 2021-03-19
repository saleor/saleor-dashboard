import ChannelDeleteDialog from "@saleor/channels/components/ChannelDeleteDialog";
import { FormData } from "@saleor/channels/components/ChannelForm/ChannelForm";
import { ChannelDelete } from "@saleor/channels/types/ChannelDelete";
import { getChannelsCurrencyChoices } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
import { getSearchFetchMoreProps } from "@saleor/hooks/makeTopLevelSearch/utils";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import { sectionNames } from "@saleor/intl";
import useShippingZonesSearch from "@saleor/searches/useShippingZonesSearch";
import getChannelsErrorMessage from "@saleor/utils/errors/channels";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import {
  useChannelActivateMutation,
  useChannelDeactivateMutation,
  useChannelDeleteMutation,
  useChannelUpdateMutation
} from "../../mutations";
import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { useChannelDetails, useChannelsList } from "../../queries";
import { ChannelUpdate } from "../../types/ChannelUpdate";
import {
  channelsListUrl,
  channelUrl,
  ChannelUrlDialog,
  ChannelUrlQueryParams
} from "../../urls";

interface ChannelDetailsProps {
  id: string;
  params: ChannelUrlQueryParams;
}

export const ChannelDetails: React.FC<ChannelDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleBack = () => navigate(channelsListUrl());

  const channelsListData = useChannelsList({ displayLoader: true });

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelUrlDialog,
    ChannelUrlQueryParams
  >(navigate, params => channelUrl(id, params), params);

  const [updateChannel, updateChannelOpts] = useChannelUpdateMutation({
    onCompleted: ({ channelUpdate: { errors } }: ChannelUpdate) =>
      notify(getDefaultNotifierSuccessErrorData(errors, intl))
  });

  const { data, loading } = useChannelDetails({
    displayLoader: true,
    variables: { id }
  });

  const handleError = (error: ChannelErrorFragment) => {
    notify({
      status: "error",
      text: getChannelsErrorMessage(error, intl)
    });
  };

  const [activateChannel, activateChannelOpts] = useChannelActivateMutation({
    onCompleted: data => {
      const errors = data.channelActivate.errors;
      if (errors.length) {
        errors.forEach(error => handleError(error));
      }
    }
  });

  const [
    deactivateChannel,
    deactivateChannelOpts
  ] = useChannelDeactivateMutation({
    onCompleted: data => {
      const errors = data.channelDeactivate.errors;
      if (errors.length) {
        errors.forEach(error => handleError(error));
      }
    }
  });

  const handleSubmit = ({
    name,
    slug,
    shippingZonesIdsToRemove,
    shippingZonesIdsToAdd
  }: FormData) =>
    updateChannel({
      variables: {
        id: data?.channel.id,
        input: {
          name,
          slug,
          addShippingZones: shippingZonesIdsToAdd,
          removeShippingZones: shippingZonesIdsToRemove
        }
      }
    });

  const onDeleteCompleted = (data: ChannelDelete) => {
    const errors = data.channelDelete.errors;
    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Channel deleted"
        })
      });
      closeModal();
      navigate(channelsListUrl());
    } else {
      errors.map(error =>
        notify({
          status: "error",
          text: getChannelsErrorMessage(error, intl)
        })
      );
    }
  };

  const [deleteChannel, deleteChannelOpts] = useChannelDeleteMutation({
    onCompleted: onDeleteCompleted
  });

  const channelsChoices = getChannelsCurrencyChoices(
    id,
    data?.channel,
    channelsListData?.data?.channels
  );

  const handleRemoveConfirm = (targetChannelId?: string) => {
    const data = targetChannelId
      ? { id, input: { targetChannel: targetChannelId } }
      : { id };
    deleteChannel({ variables: data });
  };

  const {
    loadMore: fetchMoreShippingZones,
    search: searchShippingZones,
    result: searchShippingZonesResult
  } = useShippingZonesSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Channel details",
          description: "window title"
        })}
      />
      <Container>
        <AppHeader onBack={handleBack}>
          {intl.formatMessage(sectionNames.channels)}
        </AppHeader>
        <PageHeader title={data?.channel?.name} />
        <ChannelDetailsPage
          searchShippingZones={searchShippingZones}
          searchShippingZonesData={searchShippingZonesResult.data}
          fetchMoreShippingZones={getSearchFetchMoreProps(
            searchShippingZonesResult,
            fetchMoreShippingZones
          )}
          channel={data?.channel}
          disabled={updateChannelOpts.loading || loading}
          disabledStatus={
            activateChannelOpts.loading || deactivateChannelOpts.loading
          }
          errors={updateChannelOpts?.data?.channelUpdate?.errors || []}
          onBack={handleBack}
          onDelete={() => openModal("remove")}
          onSubmit={handleSubmit}
          updateChannelStatus={() =>
            data?.channel?.isActive
              ? deactivateChannel({ variables: { id } })
              : activateChannel({ variables: { id } })
          }
          saveButtonBarState={updateChannelOpts.status}
        />
      </Container>
      <ChannelDeleteDialog
        channelsChoices={channelsChoices}
        hasOrders={data?.channel?.hasOrders}
        open={params.action === "remove"}
        confirmButtonState={deleteChannelOpts.status}
        onBack={() => navigate(channelsListUrl())}
        onClose={closeModal}
        onConfirm={handleRemoveConfirm}
      />
    </>
  );
};

export default ChannelDetails;
