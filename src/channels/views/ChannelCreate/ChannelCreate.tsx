import { FormData } from "@saleor/channels/components/ChannelForm/ChannelForm";
import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  ChannelCreateMutation,
  ChannelErrorFragment,
  useChannelCreateMutation,
  useChannelReorderWarehousesMutation,
} from "@saleor/graphql";
import { getSearchFetchMoreProps } from "@saleor/hooks/makeTopLevelSearch/utils";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import useShop from "@saleor/hooks/useShop";
import { sectionNames } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import getChannelsErrorMessage from "@saleor/utils/errors/channels";
import currencyCodes from "currency-codes";
import React from "react";
import { useIntl } from "react-intl";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { channelPath, channelsListUrl } from "../../urls";
import { calculateItemsOrderMoves } from "../ChannelDetails/handlers";
import { useShippingZones } from "../ChannelDetails/useShippingZones";
import { useWarehouses } from "../ChannelDetails/useWarehouses";

export const ChannelCreateView = ({}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const handleError = (error: ChannelErrorFragment) => {
    notify({
      status: "error",
      text: getChannelsErrorMessage(error, intl),
    });
  };

  const [createChannel, createChannelOpts] = useChannelCreateMutation({
    onCompleted: ({ channelCreate: { errors } }: ChannelCreateMutation) => {
      notify(getDefaultNotifierSuccessErrorData(errors, intl));
    },
  });

  const [reorderChannelWarehouses] = useChannelReorderWarehousesMutation({
    onCompleted: data => {
      const errors = data.channelReorderWarehouses.errors;
      if (errors.length) {
        errors.forEach(error => handleError(error));
      }

      navigate(channelPath(data.channelReorderWarehouses.channel?.id));
    },
  });

  const handleSubmit = async ({
    shippingZonesIdsToAdd,
    warehousesIdsToAdd,
    warehousesToDisplay,
    currencyCode,
    allocationStrategy,
    name,
    slug,
    defaultCountry,
  }: FormData) => {
    const createChannelMutation = createChannel({
      variables: {
        input: {
          defaultCountry,
          name,
          slug,
          currencyCode: currencyCode.toUpperCase(),
          addShippingZones: shippingZonesIdsToAdd,
          addWarehouses: warehousesIdsToAdd,
          stockSettings: {
            allocationStrategy,
          },
        },
      },
    });

    const result = await createChannelMutation;
    const errors = await extractMutationErrors(createChannelMutation);

    if (!errors?.length) {
      const moves = calculateItemsOrderMoves(
        result.data?.channelCreate.channel?.warehouses,
        warehousesToDisplay,
      );

      await reorderChannelWarehouses({
        variables: {
          channelId: result.data?.channelCreate.channel?.id,
          moves,
        },
      });
    }

    return errors;
  };

  const {
    shippingZonesCountData,
    shippingZonesCountLoading,
    fetchMoreShippingZones,
    searchShippingZones,
    searchShippingZonesResult,
  } = useShippingZones();

  const {
    warehousesCountData,
    warehousesCountLoading,
    fetchMoreWarehouses,
    searchWarehouses,
    searchWarehousesResult,
  } = useWarehouses();

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
          allShippingZonesCount={
            shippingZonesCountData?.shippingZones?.totalCount
          }
          searchShippingZones={searchShippingZones}
          searchShippingZonesData={searchShippingZonesResult.data}
          fetchMoreShippingZones={getSearchFetchMoreProps(
            searchShippingZonesResult,
            fetchMoreShippingZones,
          )}
          allWarehousesCount={warehousesCountData?.warehouses?.totalCount}
          searchWarehouses={searchWarehouses}
          searchWarehousesData={searchWarehousesResult.data}
          fetchMoreWarehouses={getSearchFetchMoreProps(
            searchWarehousesResult,
            fetchMoreWarehouses,
          )}
          disabled={
            createChannelOpts.loading ||
            shippingZonesCountLoading ||
            warehousesCountLoading
          }
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
