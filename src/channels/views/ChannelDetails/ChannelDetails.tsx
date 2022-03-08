import ChannelDeleteDialog from "@saleor/channels/components/ChannelDeleteDialog";
import { FormData } from "@saleor/channels/components/ChannelForm/ChannelForm";
import { getChannelsCurrencyChoices } from "@saleor/channels/utils";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  ChannelDeleteMutation,
  ChannelErrorFragment,
  ChannelUpdateMutation,
  useChannelActivateMutation,
  useChannelDeactivateMutation,
  useChannelDeleteMutation,
  useChannelQuery,
  useChannelShippingZonesQuery,
  useChannelsQuery,
  useChannelUpdateMutation
} from "@saleor/graphql";
import { getSearchFetchMoreProps } from "@saleor/hooks/makeTopLevelSearch/utils";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import useShop from "@saleor/hooks/useShop";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import { extractMutationErrors } from "@saleor/misc";
import useShippingZonesSearch from "@saleor/searches/useShippingZonesSearch";
import getChannelsErrorMessage from "@saleor/utils/errors/channels";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
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
  const shop = useShop();

  const handleBack = () => navigate(channelsListUrl());

  const channelsListData = useChannelsQuery({ displayLoader: true });

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelUrlDialog,
    ChannelUrlQueryParams
  >(navigate, params => channelUrl(id, params), params);

  const [updateChannel, updateChannelOpts] = useChannelUpdateMutation({
    onCompleted: ({ channelUpdate: { errors } }: ChannelUpdateMutation) =>
      notify(getDefaultNotifierSuccessErrorData(errors, intl))
  });

  const { data, loading } = useChannelQuery({
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
    shippingZonesIdsToAdd,
    defaultCountry
  }: FormData) =>
    extractMutationErrors(
      updateChannel({
        variables: {
          id: data?.channel.id,
          input: {
            name,
            slug,
            defaultCountry,
            addShippingZones: shippingZonesIdsToAdd,
            removeShippingZones: shippingZonesIdsToRemove
          }
        }
      })
    );

  const onDeleteCompleted = (data: ChannelDeleteMutation) => {
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

  const handleRemoveConfirm = (channelId?: string) => {
    const data = channelId ? { id, input: { channelId } } : { id };
    deleteChannel({ variables: data });
  };

  const {
    data: channelShippingZonesData,
    loading: channelsShippingZonesLoading
  } = useChannelShippingZonesQuery({
    variables: {
      filter: {
        channels: [id]
      }
    }
  });

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
        <Backlink onClick={handleBack}>
          {intl.formatMessage(sectionNames.channels)}
        </Backlink>
        <PageHeader title={data?.channel?.name} />
        <ChannelDetailsPage
          channelShippingZones={channelShippingZonesData?.shippingZones?.edges?.map(
            ({ node }) => node
          )}
          searchShippingZones={searchShippingZones}
          searchShippingZonesData={searchShippingZonesResult.data}
          fetchMoreShippingZones={getSearchFetchMoreProps(
            searchShippingZonesResult,
            fetchMoreShippingZones
          )}
          channel={data?.channel}
          disabled={
            updateChannelOpts.loading || loading || channelsShippingZonesLoading
          }
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
          countries={shop?.countries || []}
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
