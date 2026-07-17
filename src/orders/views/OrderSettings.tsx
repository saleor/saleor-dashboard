// @ts-strict-ignore
import {
  type ChannelErrorFragment,
  useChannelUpdateMutation,
  useOrderSettingsChannelsQuery,
  useOrderSettingsQuery,
  useOrderSettingsUpdateMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationState } from "@dashboard/misc";
import OrderSettingsPage from "@dashboard/orders/components/OrderSettingsPage";
import { getOrderSettingsFormData } from "@dashboard/orders/components/OrderSettingsPage/formData";
import { orderSettingsPageMessages } from "@dashboard/orders/components/OrderSettingsPage/messages";
import { submitOrderSettingsForm } from "@dashboard/orders/components/OrderSettingsPage/submitOrderSettingsForm";
import { type OrderSettingsFormData } from "@dashboard/orders/components/OrderSettingsPage/types";
import { useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";

const OrderSettings = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const { data, loading } = useOrderSettingsQuery({});
  const { data: channelsData, loading: channelsLoading } = useOrderSettingsChannelsQuery({});
  const channels = useMemo(() => channelsData?.channels ?? [], [channelsData?.channels]);
  const [channelUpdate] = useChannelUpdateMutation();
  const [orderSettingsUpdate, orderSettingsUpdateOpts] = useOrderSettingsUpdateMutation();
  const [channelSaveErrors, setChannelSaveErrors] = useState<ChannelErrorFragment[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const initialFormData = useMemo(
    () => getOrderSettingsFormData(data?.shop, channels),
    [channels, data?.shop],
  );

  const channelNameById = useMemo(
    () =>
      channels.reduce<Record<string, string>>((accumulator, channel) => {
        accumulator[channel.id] = channel.name;

        return accumulator;
      }, {}),
    [channels],
  );

  const handleSubmit = useCallback(
    async (formData: OrderSettingsFormData) => {
      setIsSaving(true);
      setChannelSaveErrors([]);

      const result = await submitOrderSettingsForm({
        formData,
        initialFormData,
        orderSettingsUpdate,
        channelUpdate,
      });

      setChannelSaveErrors(result.channelErrors);
      setIsSaving(false);

      if (!result.allErrors.length) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "lL57q7",
            defaultMessage: "Order settings updated",
          }),
        });
      } else {
        notifySaveErrors(result, channelNameById, notify, intl);
      }

      return result.allErrors;
    },
    [channelNameById, channelUpdate, initialFormData, intl, notify, orderSettingsUpdate],
  );

  const pageLoading = loading || channelsLoading || orderSettingsUpdateOpts.loading || isSaving;

  const saveButtonBarState = getMutationState(
    orderSettingsUpdateOpts.called || isSaving,
    orderSettingsUpdateOpts.loading || isSaving,
    [...(orderSettingsUpdateOpts.data?.shopSettingsUpdate?.errors || []), ...channelSaveErrors],
  );

  return (
    <OrderSettingsPage
      shop={data?.shop}
      channels={channels}
      disabled={pageLoading}
      onSubmit={handleSubmit}
      saveButtonBarState={saveButtonBarState}
    />
  );
};

function notifySaveErrors(
  result: Awaited<ReturnType<typeof submitOrderSettingsForm>>,
  channelNameById: Record<string, string>,
  notify: ReturnType<typeof useNotifier>,
  intl: ReturnType<typeof useIntl>,
): void {
  const hasShopErrors = result.shopErrors.length > 0;
  const hasChannelErrors = result.channelErrors.length > 0;

  if (hasShopErrors && hasChannelErrors) {
    notify({
      status: "error",
      text: intl.formatMessage(orderSettingsPageMessages.partialSaveFailed),
    });

    return;
  }

  if (hasChannelErrors) {
    const channelNames = result.failedChannelIds
      .map(channelId => channelNameById[channelId])
      .filter(Boolean)
      .join(", ");

    if (channelNames) {
      notify({
        status: "error",
        text: intl.formatMessage(orderSettingsPageMessages.channelSaveFailed, {
          channels: channelNames,
        }),
      });

      return;
    }
  }

  notify({
    status: "error",
    text: intl.formatMessage(commonMessages.somethingWentWrong),
  });
}

export default OrderSettings;
