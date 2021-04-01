import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { sectionNames } from "@saleor/intl";
import currencyCodes from "currency-codes";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelCreateInput } from "../../../types/globalTypes";
import { useChannelCreateMutation } from "../../mutations";
import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { ChannelCreate } from "../../types/ChannelCreate";
import { channelPath, channelsListUrl } from "../../urls";

export const ChannelCreateView = ({}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleBack = () => navigate(channelsListUrl());

  const onSubmit = (data: ChannelCreate) => {
    if (!data.channelCreate.errors.length) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(channelPath(data.channelCreate.channel.id));
    }
  };

  const [createChannel, createChannelOpts] = useChannelCreateMutation({
    onCompleted: onSubmit
  });

  const handleSubmit = (data: ChannelCreateInput) =>
    createChannel({
      variables: {
        input: { ...data, currencyCode: data.currencyCode.toUpperCase() }
      }
    });

  const currencyCodeChoices = currencyCodes.data.map(currencyData => ({
    label: intl.formatMessage(
      {
        defaultMessage: "{code} - {countries}",
        description: "currency code select"
      },
      {
        code: currencyData.code,
        countries: currencyData.countries.join(",")
      }
    ),
    value: currencyData.code
  }));

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create Channel",
          description: "window title"
        })}
      />
      <Container>
        <AppHeader onBack={handleBack}>
          {intl.formatMessage(sectionNames.channels)}
        </AppHeader>
        <PageHeader
          title={intl.formatMessage({
            defaultMessage: "New Channel",
            description: "channel create"
          })}
        />
        <ChannelDetailsPage
          disabled={createChannelOpts.loading}
          errors={createChannelOpts?.data?.channelCreate?.errors || []}
          currencyCodes={currencyCodeChoices}
          onSubmit={handleSubmit}
          onBack={handleBack}
          saveButtonBarState={createChannelOpts.status}
        />
      </Container>
    </>
  );
};

export default ChannelCreateView;
