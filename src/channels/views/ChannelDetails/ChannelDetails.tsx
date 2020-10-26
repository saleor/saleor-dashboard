import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelUpdateInput } from "../../../types/globalTypes";
import { useChannelUpdateMutation } from "../../mutations";
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
      handleBack();
    }
  };

  const { data, loading } = useChannelDetails({
    displayLoader: true,
    variables: { id }
  });

  const [updateChannel, updateChannelOpts] = useChannelUpdateMutation({
    onCompleted: onSubmit
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
          editableCurrency={false}
          errors={updateChannelOpts?.data?.channelUpdate?.errors || []}
          onSubmit={handleSubmit}
          onBack={handleBack}
          saveButtonBarState={updateChannelOpts.status}
        />
      </Container>
    </>
  );
};

export default ChannelDetails;
