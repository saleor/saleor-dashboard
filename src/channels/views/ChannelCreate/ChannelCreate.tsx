import { FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  ChannelCreateInput,
  ChannelCreateMutation,
  ChannelErrorFragment,
  useChannelCreateMutation,
  useChannelReorderWarehousesMutation,
} from "@dashboard/graphql";
import { SearchData } from "@dashboard/hooks/makeTopLevelSearch";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import currencyCodes from "currency-codes";
import { useIntl } from "react-intl";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { channelPath } from "../../urls";
import { useShippingZones } from "../ChannelDetails/useShippingZones";
import { useWarehouses } from "../ChannelDetails/useWarehouses";
import { useSaveChannel } from "./useSaveChannel";

const ChannelCreateView = () => {
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
    onCompleted: ({ channelCreate }: ChannelCreateMutation) => {
      if (channelCreate && !channelCreate.errors.length) {
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
        if (!data.channelReorderWarehouses) {
          return;
        }

        const errors = data.channelReorderWarehouses.errors;

        if (errors.length) {
          errors.forEach(error => handleError(error));
        }

        const channelId = data.channelReorderWarehouses.channel?.id;

        if (channelId) {
          navigate(channelPath(channelId));
        }
      },
    });
  const saveChannel = useSaveChannel({
    createChannel,
    reorderChannelWarehouses,
  });
  const handleSubmit = async ({
    allocationStrategy,
    allowUnpaidOrders,
    currencyCode,
    defaultCountry,
    defaultTransactionFlowStrategy,
    deleteExpiredOrdersAfter,
    markAsPaidStrategy,
    name,
    shippingZonesIdsToAdd,
    slug,
    warehousesIdsToAdd,
    warehousesToDisplay,
    automaticallyCompleteCheckouts,
  }: FormData) => {
    const input: ChannelCreateInput = {
      name,
      slug,
      defaultCountry,
      currencyCode: currencyCode.toUpperCase(),
      addShippingZones: shippingZonesIdsToAdd,
      addWarehouses: warehousesIdsToAdd,
      stockSettings: {
        allocationStrategy,
      },
      paymentSettings: {
        defaultTransactionFlowStrategy,
      },
      orderSettings: {
        markAsPaidStrategy,
        deleteExpiredOrdersAfter,
        allowUnpaidOrders,
      },
      checkoutSettings: {
        automaticallyCompleteFullyPaidCheckouts: automaticallyCompleteCheckouts,
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
          allShippingZonesCount={shippingZonesCountData?.shippingZones?.totalCount ?? 0}
          searchShippingZones={searchShippingZones}
          searchShippingZonesData={searchShippingZonesResult.data as SearchData | undefined}
          fetchMoreShippingZones={getSearchFetchMoreProps(
            searchShippingZonesResult as any,
            fetchMoreShippingZones,
          )}
          allWarehousesCount={warehousesCountData?.warehouses?.totalCount ?? 0}
          searchWarehouses={searchWarehouses}
          searchWarehousesData={searchWarehousesResult.data as SearchData | undefined}
          fetchMoreWarehouses={getSearchFetchMoreProps(
            searchWarehousesResult as any,
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
