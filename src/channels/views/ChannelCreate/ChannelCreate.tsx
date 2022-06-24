import { FormData } from "@saleor/channels/components/ChannelForm/ChannelForm";
import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  ChannelCreateMutation,
  useChannelCreateMutation,
} from "@saleor/graphql";
import { getSearchFetchMoreProps } from "@saleor/hooks/makeTopLevelSearch/utils";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import useShop from "@saleor/hooks/useShop";
import { sectionNames } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import useShippingZonesSearch from "@saleor/searches/useShippingZonesSearch";
import currencyCodes from "currency-codes";
import React from "react";
import { useIntl } from "react-intl";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { channelPath, channelsListUrl } from "../../urls";

export const ChannelCreateView = ({}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const [createChannel, createChannelOpts] = useChannelCreateMutation({
    onCompleted: ({
      channelCreate: { errors, channel },
    }: ChannelCreateMutation) => {
      notify(getDefaultNotifierSuccessErrorData(errors, intl));

      if (!errors.length) {
        navigate(channelPath(channel.id));
      }
    },
  });

  const handleSubmit = ({
    shippingZonesIdsToAdd,
    shippingZonesIdsToRemove,
    currencyCode,
    ...rest
  }: FormData) =>
    extractMutationErrors(
      createChannel({
        variables: {
          input: {
            ...rest,
            currencyCode: currencyCode.toUpperCase(),
            addShippingZones: shippingZonesIdsToAdd,
          },
        },
      }),
    );

  const {
    loadMore: fetchMoreShippingZones,
    search: searchShippingZones,
    result: searchShippingZonesResult,
  } = useShippingZonesSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const currencyCodeChoices = currencyCodes.data.map(currencyData => ({
    label: intl.formatMessage(
      {
        id: "J7mFhU",
        defaultMessage: "{code} - {countries}",
        description: "currency code select",
      },
      {
        code: currencyData.code,
        countries: currencyData.countries.join(","),
      },
    ),
    value: currencyData.code,
  }));

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "OrMr/k",
          defaultMessage: "Create Channel",
          description: "window title",
        })}
      />
      <Container>
        <Backlink href={channelsListUrl()}>
          {intl.formatMessage(sectionNames.channels)}
        </Backlink>
        <PageHeader
          title={intl.formatMessage({
            id: "DnghuS",
            defaultMessage: "New Channel",
            description: "channel create",
          })}
        />
        <ChannelDetailsPage
          searchShippingZones={searchShippingZones}
          searchShippingZonesData={searchShippingZonesResult.data}
          fetchMoreShippingZones={getSearchFetchMoreProps(
            searchShippingZonesResult,
            fetchMoreShippingZones,
          )}
          disabled={createChannelOpts.loading}
          errors={createChannelOpts?.data?.channelCreate?.errors || []}
          currencyCodes={currencyCodeChoices}
          onSubmit={handleSubmit}
          saveButtonBarState={createChannelOpts.status}
          countries={shop?.countries || []}
        />
      </Container>
    </>
  );
};

export default ChannelCreateView;
