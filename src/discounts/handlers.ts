// @ts-strict-ignore
import { type ChannelVoucherData, validateVoucherPrice } from "@dashboard/channels/utils";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { DiscountErrorCode, type DiscountErrorFragment, VoucherTypeEnum } from "@dashboard/graphql";
import { type ChangeEvent, type FormChange, type SubmitPromise } from "@dashboard/hooks/useForm";
import { type RequireOnlyOne } from "@dashboard/misc";
import { validatePrice } from "@dashboard/products/utils/validation";
import { arrayDiff } from "@dashboard/utils/arrays";

import { clearInactiveVoucherDiscountDrafts, getAddedChannelsInputFromFormData } from "./data";

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

export function createVoucherScopeChangeHandler(change: FormChange) {
  return (scope: string, currentDiscountType: DiscountTypeEnum) => {
    if (scope === DiscountTypeEnum.SHIPPING) {
      change({
        target: {
          name: "discountType",
          value: DiscountTypeEnum.SHIPPING,
        },
      });
      change({
        target: {
          name: "type",
          value: VoucherTypeEnum.ENTIRE_ORDER,
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
    // Drop the inactive amount draft before validate/save (toggle keeps both until Save).
    const data = clearInactiveVoucherDiscountDrafts(formData);
    const { channelListings, discountType, percentageDiscountValue, requirementsPicker } = data;
    const { valid, invalidChannels } = validateChannelListing(
      channelListings,
      discountType,
      requirementsPicker,
      percentageDiscountValue,
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

    return submit(data);
  };
}

export function validateChannelListing(
  channelListings: ChannelVoucherData[],
  discountType: DiscountTypeEnum,
  requirementsPicker: RequirementsPicker,
  percentageDiscountValue = "",
) {
  // When discount type is shipping, there is no need to check if all selected channels have a discount value
  if (discountType === DiscountTypeEnum.SHIPPING) {
    return {
      valid: true,
      invalidChannels: [],
    };
  }

  // Percentage uses one draft value for all channels — validate that, not per-channel fixed drafts.
  // Do not run validateVoucherPrice on a synthetic channel: empty minSpent would fail whenever
  // requirements are ORDER, even if the percentage itself is valid.
  if (discountType === DiscountTypeEnum.VALUE_PERCENTAGE) {
    // Percentage is persisted on channel listings only. With no channels assigned, an empty
    // draft must not block unrelated saves (e.g. renaming) — and the % input used to be hidden
    // behind the empty-channels placeholder, so validation failures looked like a dead Save.
    if (!channelListings?.length) {
      return {
        valid: true,
        invalidChannels: [],
      };
    }

    if (validatePrice(percentageDiscountValue)) {
      return {
        valid: false,
        invalidChannels: channelListings.map(channel => channel.id),
      };
    }

    if (requirementsPicker === RequirementsPicker.ORDER) {
      const invalidMinSpentChannels = channelListings
        .filter(channel => validatePrice(channel.minSpent))
        .map(channel => channel.id);

      return {
        valid: !invalidMinSpentChannels.length,
        invalidChannels: invalidMinSpentChannels,
      };
    }

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
