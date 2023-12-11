import { FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  ChannelCreateInput,
  ChannelErrorFragment,
  useChannelCreateMutation,
  useChannelReorderWarehousesMutation,
} from "@dashboard/graphql";
import { SearchData } from "@dashboard/hooks/makeTopLevelSearch";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import currencyCodes from "currency-codes";
import React from "react";
import { useIntl } from "react-intl";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { channelPath } from "../../urls";
import { useShippingZones } from "../ChannelDetails/useShippingZones";
import { useWarehouses } from "../ChannelDetails/useWarehouses";
import { useSaveChannel } from "./useSaveChannel";

export const ChannelCreateView = () => {
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
    onCompleted: ({ channelCreate }) => {
      if (!channelCreate?.errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const [reorderChannelWarehouses, reorderChannelWarehousesOpts] =
    useChannelReorderWarehousesMutation({
      onCompleted: data => {
        const errors = data?.channelReorderWarehouses?.errors;
        if (errors?.length) {
          errors.forEach(error => handleError(error));
        }

        navigate(
          channelPath(data?.channelReorderWarehouses?.channel?.id || ""),
        );
      },
    });

  const saveChannel = useSaveChannel({
    createChannel,
    reorderChannelWarehouses,
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
    markAsPaidStrategy,
    deleteExpiredOrdersAfter,
    allowUnpaidOrders,
  }: FormData) => {
    const input: ChannelCreateInput = {
      defaultCountry,
      name,
      slug,
      currencyCode: currencyCode.toUpperCase(),
      addShippingZones: shippingZonesIdsToAdd,
      addWarehouses: warehousesIdsToAdd,
      stockSettings: {
        allocationStrategy,
      },
      orderSettings: {
        markAsPaidStrategy,
        deleteExpiredOrdersAfter,
        allowUnpaidOrders,
      },
    };

    return saveChannel(input, warehousesToDisplay);
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
      <>
        <ChannelDetailsPage
          allShippingZonesCount={
            shippingZonesCountData?.shippingZones?.totalCount as number
          }
          searchShippingZones={searchShippingZones}
          searchShippingZonesData={searchShippingZonesResult.data as SearchData}
          fetchMoreShippingZones={getSearchFetchMoreProps(
            searchShippingZonesResult as CommonSearchOpts,
            fetchMoreShippingZones,
          )}
          allWarehousesCount={
            warehousesCountData?.warehouses?.totalCount as number
          }
          searchWarehouses={searchWarehouses}
          searchWarehousesData={searchWarehousesResult.data as SearchData}
          fetchMoreWarehouses={getSearchFetchMoreProps(
            searchWarehousesResult as CommonSearchOpts,
            fetchMoreWarehouses,
          )}
          disabled={
            createChannelOpts.loading ||
            reorderChannelWarehousesOpts.loading ||
            shippingZonesCountLoading ||
            warehousesCountLoading
          }
          errors={createChannelOpts?.data?.channelCreate?.errors || []}
          currencyCodes={currencyCodeChoices}
          onSubmit={handleSubmit}
          saveButtonBarState={createChannelOpts.status}
          countries={shop?.countries || []}
        />
      </>
    </>
  );
};

export default ChannelCreateView;
