// @ts-strict-ignore
import { ChannelVoucherData, validateVoucherPrice } from "@dashboard/channels/utils";
import { VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { DiscountErrorCode, DiscountErrorFragment, VoucherTypeEnum } from "@dashboard/graphql";
import { ChangeEvent, FormChange, SubmitPromise } from "@dashboard/hooks/useForm";
import { RequireOnlyOne } from "@dashboard/misc";
import { arrayDiff } from "@dashboard/utils/arrays";

import { getAddedChannelsInputFromFormData } from "./data";

interface ChannelArgs {
  discountValue: string;
  minSpent: string;
}

export type ChannelInput = RequireOnlyOne<ChannelArgs, "discountValue" | "minSpent">;

export function createDiscountTypeChangeHandler(change: FormChange) {
  return (formData: VoucherDetailsPageFormData, event: ChangeEvent) => {
    if (formData.type === VoucherTypeEnum.SHIPPING) {
      // if previously type was shipping
      change({
        target: {
          name: "type",
          value: VoucherTypeEnum.ENTIRE_ORDER,
        },
      });
    } else if (event.target.value === DiscountTypeEnum.SHIPPING) {
      // if currently type should be shipping
      change({
        target: {
          name: "type",
          value: VoucherTypeEnum.ENTIRE_ORDER,
        },
      });
    }

    change(event);
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
    const { discountValue, minSpent } = input;
    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        ...(minSpent !== undefined
          ? { minSpent }
          : {
              discountValue,
            }),
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
  submit: (data: VoucherDetailsPageFormData) => SubmitPromise<any[]>,
  setLocalErrors: (errors: DiscountErrorFragment[]) => void,
) {
  return async (formData: VoucherDetailsPageFormData) => {
    const { channelListings, discountType, requirementsPicker } = formData;
    const { valid, invalidChannels } = validateChannelListing(
      channelListings,
      discountType,
      requirementsPicker,
    );

    const localErrors: DiscountErrorFragment[] = !valid
      ? [
          {
            __typename: "DiscountError",
            code: DiscountErrorCode.INVALID,
            field: "discountValue",
            channels: invalidChannels,
            message: "Invalid discount value",
          },
        ]
      : [];

    setLocalErrors(localErrors);

    if (localErrors.length) {
      return localErrors;
    }

    return submit(formData);
  };
}

export function validateChannelListing(
  channelListings: ChannelVoucherData[],
  discountType: DiscountTypeEnum,
  requirementsPicker: RequirementsPicker,
) {
  // When discount type is shipping, there is no need to check if all selected channels have a discount value
  if (discountType === DiscountTypeEnum.SHIPPING) {
    return {
      valid: true,
      invalidChannels: [],
    };
  }

  const invalidChannelListings = channelListings
    ?.filter(channel => validateVoucherPrice(requirementsPicker, channel))
    .map(channel => channel.id);

  return {
    valid: !invalidChannelListings.length,
    invalidChannels: invalidChannelListings,
  };
}
