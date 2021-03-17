import { ChannelCreate } from "@saleor/channels/types/ChannelCreate";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import { FormData } from "@saleor/channels/components/ChannelForm/ChannelForm";
import { sectionNames } from "@saleor/intl";
import currencyCodes from "currency-codes";
import React from "react";
import { useIntl } from "react-intl";

import { useChannelCreateMutation } from "../../mutations";
import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { channelPath, channelsListUrl } from "../../urls";
import { omit } from "lodash-es";

export const ChannelCreateView = ({}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleBack = () => navigate(channelsListUrl());

  const [createChannel, createChannelOpts] = useChannelCreateMutation({
    onCompleted: ({ channelCreate: { errors, channel } }: ChannelCreate) => {
      notify(getDefaultNotifierSuccessErrorData(errors, intl));

      if (!errors.length) {
        navigate(channelPath(channel.id));
      }
    }
  });

  const handleSubmit = ({
    shippingZonesIdsToAdd,
    currencyCode,
    ...rest
  }: FormData) =>
    createChannel({
      variables: {
        input: {
          ...omit(rest, "shippingZonesIdsToRemove"),
          currencyCode: currencyCode.toUpperCase(),
          addShippingZones: shippingZonesIdsToAdd
        }
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
