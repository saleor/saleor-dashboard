// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import {
  type ChannelErrorFragment,
  PermissionEnum,
  type ShopErrorFragment,
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
  const userPermissions = useUserPermissions();
  const canManageSettings = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_SETTINGS]);
  const canManageOrders = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_ORDERS]);
  const { data, loading } = useOrderSettingsQuery({
    skip: !canManageSettings,
  });
  const { data: channelsData, loading: channelsLoading } = useOrderSettingsChannelsQuery({
    skip: !canManageOrders,
  });
  const channels = useMemo(() => channelsData?.channels ?? [], [channelsData?.channels]);
  const [channelUpdate] = useChannelUpdateMutation();
  const [orderSettingsUpdate, orderSettingsUpdateOpts] = useOrderSettingsUpdateMutation();
  const [lastSubmitErrors, setLastSubmitErrors] = useState<
    Array<ChannelErrorFragment | ShopErrorFragment>
  >([]);
  const [saveAttempted, setSaveAttempted] = useState(false);
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
      setSaveAttempted(true);
      setLastSubmitErrors([]);

      try {
        const result = await submitOrderSettingsForm({
          formData,
          initialFormData,
          orderSettingsUpdate,
          channelUpdate,
          canUpdateShop: canManageSettings,
          canUpdateChannels: canManageOrders,
        });

        setLastSubmitErrors(result.allErrors);

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
      } finally {
        setIsSaving(false);
      }
    },
    [
      canManageOrders,
      canManageSettings,
      channelNameById,
      channelUpdate,
      initialFormData,
      intl,
      notify,
      orderSettingsUpdate,
    ],
  );

  const pageLoading =
    (canManageSettings && loading) ||
    (canManageOrders && channelsLoading) ||
    orderSettingsUpdateOpts.loading ||
    isSaving;

  const saveButtonBarState = getMutationState(
    saveAttempted || isSaving,
    isSaving || orderSettingsUpdateOpts.loading,
    lastSubmitErrors,
  );

  return (
    <OrderSettingsPage
      shop={data?.shop}
      channels={channels}
      canManageOrders={canManageOrders}
      canManageSettings={canManageSettings}
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
