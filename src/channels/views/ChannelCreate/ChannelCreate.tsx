// @ts-strict-ignore
import { type FormData } from "@dashboard/channels/components/ChannelForm/ChannelForm";
import { getChannelCreateDefaults } from "@dashboard/channels/utils/getChannelCreateDefaults";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  type ChannelCreateInput,
  type ChannelCreateMutation,
  type ChannelErrorFragment,
  useChannelCreateMutation,
  useChannelReorderWarehousesMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import currencyCodes from "currency-codes";
import { useIntl } from "react-intl";
import slugify from "slugify";

import ChannelDetailsPage from "../../pages/ChannelDetailsPage";
import { channelUrl } from "../../urls";
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
    onCompleted: ({ channelCreate: { errors } }: ChannelCreateMutation) => {
      if (!errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "HA0fD3", defaultMessage: "Channel created" }),
        });
      }
    },
  });
  const [reorderChannelWarehouses, reorderChannelWarehousesOpts] =
    useChannelReorderWarehousesMutation({
      onCompleted: data => {
        const errors = data.channelReorderWarehouses.errors;

        if (errors.length) {
          errors.forEach(error => handleError(error));
        }
      },
    });
  const saveChannel = useSaveChannel({
    createChannel,
    reorderChannelWarehouses,
  });
  const handleSubmit = async (formData: FormData) => {
    const defaults = getChannelCreateDefaults();
    const {
      allocationStrategy = defaults.allocationStrategy,
      allowUnpaidOrders = defaults.allowUnpaidOrders,
      automaticallyConfirmAllNewOrders = defaults.automaticallyConfirmAllNewOrders,
      automaticallyFulfillNonShippableGiftCard = defaults.automaticallyFulfillNonShippableGiftCard,
      currencyCode,
      defaultCountry,
      defaultTransactionFlowStrategy = defaults.defaultTransactionFlowStrategy,
      releaseFundsForExpiredCheckouts = defaults.releaseFundsForExpiredCheckouts,
      checkoutTtlBeforeReleasingFunds = defaults.checkoutTtlBeforeReleasingFunds,
      expireOrdersAfter = defaults.expireOrdersAfter,
      deleteExpiredOrdersAfter = defaults.deleteExpiredOrdersAfter,
      markAsPaidStrategy = defaults.markAsPaidStrategy,
      name,
      slug,
      warehousesToDisplay,
      automaticallyCompleteCheckouts = defaults.automaticallyCompleteCheckouts,
      allowLegacyGiftCardUse = defaults.allowLegacyGiftCardUse,
    } = formData;

    const input: ChannelCreateInput = {
      name,
      slug: slug || slugify(name).toLowerCase(),
      defaultCountry,
      currencyCode: currencyCode.toUpperCase(),
      addShippingZones: [],
      addWarehouses: [],
      stockSettings: {
        allocationStrategy,
      },
      paymentSettings: {
        defaultTransactionFlowStrategy,
        releaseFundsForExpiredCheckouts,
        checkoutTtlBeforeReleasingFunds: releaseFundsForExpiredCheckouts
          ? checkoutTtlBeforeReleasingFunds || 0
          : checkoutTtlBeforeReleasingFunds,
      },
      orderSettings: {
        markAsPaidStrategy,
        expireOrdersAfter: expireOrdersAfter || 0,
        deleteExpiredOrdersAfter,
        allowUnpaidOrders,
        automaticallyConfirmAllNewOrders,
        automaticallyFulfillNonShippableGiftCard,
      },
      checkoutSettings: {
        automaticallyCompleteFullyPaidCheckouts: automaticallyCompleteCheckouts,
        allowLegacyGiftCardUse,
      },
    };

    const { errors, channelId } = await saveChannel(input, warehousesToDisplay);

    if (!errors.length && channelId) {
      navigate(channelUrl(channelId, { action: "setup" }));
    }

    return errors;
  };
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
      <ChannelDetailsPage
        disabled={createChannelOpts.loading || reorderChannelWarehousesOpts.loading}
        errors={createChannelOpts?.data?.channelCreate?.errors || []}
        currencyCodes={currencyCodeChoices}
        onSubmit={handleSubmit}
        saveButtonBarState={createChannelOpts.status}
        countries={shop?.countries || []}
      />
    </>
  );
};

export default ChannelCreateView;
