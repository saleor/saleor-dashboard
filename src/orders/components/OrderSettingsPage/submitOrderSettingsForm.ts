import {
  type ChannelErrorFragment,
  type ChannelUpdateMutationFn,
  type OrderSettingsUpdateMutationFn,
  type ShopErrorFragment,
} from "@dashboard/graphql";
import { extractMutationErrors } from "@dashboard/misc";

import {
  buildChannelOrderSettingsInput,
  getDirtyChannelIds,
  isShopSettingsPristine,
} from "./formData";
import { type OrderSettingsFormData } from "./types";

export interface OrderSettingsSubmitResult {
  allErrors: Array<ChannelErrorFragment | ShopErrorFragment>;
  channelErrors: ChannelErrorFragment[];
  failedChannelIds: string[];
  shopErrors: ShopErrorFragment[];
}

interface SubmitOrderSettingsFormParams {
  formData: OrderSettingsFormData;
  initialFormData: OrderSettingsFormData;
  orderSettingsUpdate: OrderSettingsUpdateMutationFn;
  channelUpdate: ChannelUpdateMutationFn;
  /** Shop settings require MANAGE_SETTINGS — skip when the user cannot update them. */
  canUpdateShop?: boolean;
  /** Channel orderSettings require MANAGE_ORDERS (or channels) — skip when unauthorized. */
  canUpdateChannels?: boolean;
}

export async function submitOrderSettingsForm({
  formData,
  initialFormData,
  orderSettingsUpdate,
  channelUpdate,
  canUpdateShop = true,
  canUpdateChannels = true,
}: SubmitOrderSettingsFormParams): Promise<OrderSettingsSubmitResult> {
  const dirtyChannelIds = canUpdateChannels
    ? getDirtyChannelIds(formData.channels, initialFormData.channels)
    : [];
  const shouldUpdateShop = canUpdateShop && !isShopSettingsPristine(formData, initialFormData);

  const shopUpdatePromise = shouldUpdateShop
    ? extractMutationErrors(
        orderSettingsUpdate({
          variables: {
            shopSettingsInput: {
              fulfillmentAutoApprove: formData.fulfillmentAutoApprove,
              fulfillmentAllowUnpaid: formData.fulfillmentAllowUnpaid,
              reserveStockDurationAnonymousUser: formData.reserveStockDurationAnonymousUser || null,
              reserveStockDurationAuthenticatedUser:
                formData.reserveStockDurationAuthenticatedUser || null,
              limitQuantityPerCheckout: formData.limitQuantityPerCheckout || null,
            },
          },
        }),
      )
    : Promise.resolve([]);

  const channelUpdatePromise =
    dirtyChannelIds.length > 0
      ? Promise.all(
          dirtyChannelIds.map(async channelId => {
            const errors = await extractMutationErrors(
              channelUpdate({
                variables: {
                  id: channelId,
                  input: {
                    orderSettings: buildChannelOrderSettingsInput(formData.channels[channelId]),
                  },
                },
              }),
            );

            return { channelId, errors: errors as ChannelErrorFragment[] };
          }),
        )
      : Promise.resolve([]);

  const [shopErrors, channelResults] = await Promise.all([shopUpdatePromise, channelUpdatePromise]);

  const failedChannelIds = channelResults
    .filter(result => result.errors.length > 0)
    .map(result => result.channelId);
  const channelErrors = channelResults.flatMap(result => result.errors);

  return {
    shopErrors: shopErrors as ShopErrorFragment[],
    channelErrors,
    failedChannelIds,
    allErrors: [...shopErrors, ...channelErrors],
  };
}
