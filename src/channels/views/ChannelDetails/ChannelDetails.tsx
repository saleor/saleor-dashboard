import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { sectionNames } from "@saleor/intl";
import getChannelsErrorMessage from "@saleor/utils/errors/channels";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelUpdateInput } from "../../../types/globalTypes";
import {
  useChannelActivateMutation,
  useChannelDeactivateMutation,
  useChannelUpdateMutation
} from "../../mutations";
import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { useChannelDetails } from "../../queries";
import { ChannelUpdate } from "../../types/ChannelUpdate";
import { channelsListUrl } from "../../urls";

interface ChannelDetailsProps {
  id: string;
}

export const ChannelDetails: React.FC<ChannelDetailsProps> = ({ id }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleBack = () => navigate(channelsListUrl());

  const onSubmit = (data: ChannelUpdate) => {
    if (!data.channelUpdate.errors.length) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  const handleError = (error: ChannelErrorFragment) => {
    notify({
      status: "error",
      text: getChannelsErrorMessage(error, intl)
    });
  };

  const { data, loading } = useChannelDetails({
    displayLoader: true,
    variables: { id }
  });

  const [updateChannel, updateChannelOpts] = useChannelUpdateMutation({
    onCompleted: onSubmit
  });

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

  const handleSubmit = (data: ChannelUpdateInput) =>
    updateChannel({
      variables: {
        id,
        input: { name: data.name, slug: data.slug }
      }
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
          channel={data?.channel}
          disabled={updateChannelOpts.loading || loading}
          disabledStatus={
            activateChannelOpts.loading || deactivateChannelOpts.loading
          }
          errors={updateChannelOpts?.data?.channelUpdate?.errors || []}
          onSubmit={handleSubmit}
          onBack={handleBack}
          updateChannelStatus={() =>
            data?.channel?.isActive
              ? deactivateChannel({ variables: { id } })
              : activateChannel({ variables: { id } })
          }
          saveButtonBarState={updateChannelOpts.status}
        />
      </Container>
    </>
  );
};

export default ChannelDetails;
