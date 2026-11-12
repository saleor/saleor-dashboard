// @ts-strict-ignore
import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { type DiscountErrorFragment, VoucherTypeEnum } from "@dashboard/graphql";
import { type FormChange, type SubmitPromise } from "@dashboard/hooks/useForm";
import { type RequireOnlyOne } from "@dashboard/misc";
import { arrayDiff } from "@dashboard/utils/arrays/arrays";
import { type IntlShape } from "react-intl";

import { clearInactiveVoucherDiscountDrafts, getAddedChannelsInputFromFormData } from "./data";
import { getVoucherLocalErrors } from "./voucherLocalErrors";

interface ChannelArgs {
  discountValue: string;
  percentageDiscountValue: string;
  minSpent: string;
}

export type ChannelInput = RequireOnlyOne<
  ChannelArgs,
  "discountValue" | "percentageDiscountValue" | "minSpent"
>;

export function createVoucherScopeChangeHandler(
  change: FormChange,
  clearShippingChannelAmounts?: () => void,
) {
  return (scope: string, currentDiscountType: DiscountTypeEnum) => {
    if (scope === DiscountTypeEnum.SHIPPING) {
      change({
        target: {
          name: "discountType",
          value: DiscountTypeEnum.SHIPPING,
        },
      });
      // Match the type a saved shipping voucher loads with, so switching away and back
      // to Free shipping leaves no unsaved change.
      change({
        target: {
          name: "type",
          value: VoucherTypeEnum.SHIPPING,
        },
      });

      return;
    }

    change({
      target: {
        name: "type",
        value: scope,
      },
    });

    if (currentDiscountType === DiscountTypeEnum.SHIPPING) {
      change({
        target: {
          name: "discountType",
          value: DiscountTypeEnum.VALUE_PERCENTAGE,
        },
      });
      // Shipping saves discountValue=100 on channel listings — wipe so %/fixed don't show 100%.
      clearShippingChannelAmounts?.();
    }
  };
}

export function createDiscountAmountTypeChangeHandler(change: FormChange) {
  return (amountType: "PERCENTAGE" | "FIXED") => {
    change({
      target: {
        name: "discountType",
        value:
          amountType === "PERCENTAGE"
            ? DiscountTypeEnum.VALUE_PERCENTAGE
            : DiscountTypeEnum.VALUE_FIXED,
      },
    });
  };
}

export function createChannelsChangeHandler(
  channelListings: ChannelVoucherData[],
  updateChannels: (data: ChannelVoucherData[]) => void,
  triggerChange: () => void,
) {
  return (id: string, input: ChannelInput) => {
    const channelIndex = channelListings.findIndex(channel => channel.id === id);
    const channel = channelListings[channelIndex];
    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        ...input,
      },
      ...channelListings.slice(channelIndex + 1),
    ];

    updateChannels(updatedChannels);
    triggerChange();
  };
}

export const getChannelsVariables = (
  id: string,
  formData: VoucherDetailsPageFormData,
  prevChannels?: ChannelVoucherData[],
) => {
  const initialIds = prevChannels.map(channel => channel.id);
  const modifiedIds = formData.channelListings.map(channel => channel.id);
  const idsDiff = arrayDiff(initialIds, modifiedIds);

  return {
    id,
    input: {
      addChannels: getAddedChannelsInputFromFormData(formData),
      removeChannels: idsDiff.removed,
    },
  };
};

export function createVoucherUpdateHandler(
  submit: (data: VoucherDetailsPageFormData) => SubmitPromise<unknown[]>,
  onInvalid: (errors: DiscountErrorFragment[]) => void,
  intl: IntlShape,
) {
  return async (formData: VoucherDetailsPageFormData) => {
    // Drop unused amount drafts before validate/save.
    const data = clearInactiveVoucherDiscountDrafts(formData);
    const localErrors = getVoucherLocalErrors(data, intl);

    if (localErrors.length) {
      onInvalid(localErrors);

      return localErrors;
    }

    return submit(data);
  };
}
