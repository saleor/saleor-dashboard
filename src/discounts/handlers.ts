// @ts-strict-ignore
import { type ChannelVoucherData } from "@dashboard/channels/utils";
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
  percentageDiscountValue: string;
  minSpent: string;
}

export type ChannelInput = RequireOnlyOne<
  ChannelArgs,
  "discountValue" | "percentageDiscountValue" | "minSpent"
>;

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

const emptyChannelListingValidation = (): ChannelListingValidationResult => ({
  valid: true,
  invalidDiscountValueChannels: [],
  invalidMinSpentChannels: [],
  invalidChannels: [],
});

const toChannelListingValidation = ({
  invalidDiscountValueChannels,
  invalidMinSpentChannels,
}: {
  invalidDiscountValueChannels: string[];
  invalidMinSpentChannels: string[];
}): ChannelListingValidationResult => {
  const invalidChannels = [
    ...new Set([...invalidDiscountValueChannels, ...invalidMinSpentChannels]),
  ];

  return {
    valid: invalidChannels.length === 0,
    invalidDiscountValueChannels,
    invalidMinSpentChannels,
    invalidChannels,
  };
};

const buildChannelListingLocalErrors = (
  validation: ChannelListingValidationResult,
): DiscountErrorFragment[] => {
  const localErrors: DiscountErrorFragment[] = [];

  if (validation.invalidDiscountValueChannels.length) {
    localErrors.push({
      __typename: "DiscountError",
      code: DiscountErrorCode.INVALID,
      field: "discountValue",
      channels: validation.invalidDiscountValueChannels,
      message: "Invalid discount value",
      voucherCodes: null,
    });
  }

  if (validation.invalidMinSpentChannels.length) {
    localErrors.push({
      __typename: "DiscountError",
      code: DiscountErrorCode.INVALID,
      field: "minSpent",
      channels: validation.invalidMinSpentChannels,
      message: "Invalid minimum spend",
      voucherCodes: null,
    });
  }

  return localErrors;
};

export function createVoucherUpdateHandler(
  submit: (data: VoucherDetailsPageFormData) => SubmitPromise<any[]>,
  setLocalErrors: (errors: DiscountErrorFragment[]) => void,
) {
  return async (formData: VoucherDetailsPageFormData) => {
    // Drop unused amount drafts before validate/save.
    const data = clearInactiveVoucherDiscountDrafts(formData);
    const { channelListings, discountType, requirementsPicker } = data;
    const validation = validateChannelListing(channelListings, discountType, requirementsPicker);
    const localErrors = buildChannelListingLocalErrors(validation);

    setLocalErrors(localErrors);

    if (localErrors.length) {
      return localErrors;
    }

    return submit(data);
  };
}

export interface ChannelListingValidationResult {
  valid: boolean;
  /** Channels with an invalid discount amount / percentage. */
  invalidDiscountValueChannels: string[];
  /** Channels with an invalid order minimum spend. */
  invalidMinSpentChannels: string[];
  /** Union of both field lists (legacy callers / tests). */
  invalidChannels: string[];
}

export function validateChannelListing(
  channelListings: ChannelVoucherData[],
  discountType: DiscountTypeEnum,
  requirementsPicker: RequirementsPicker,
): ChannelListingValidationResult {
  // When discount type is shipping, there is no need to check if all selected channels have a discount value
  if (discountType === DiscountTypeEnum.SHIPPING) {
    return emptyChannelListingValidation();
  }

  // With no channels assigned, do not block unrelated saves (e.g. renaming).
  if (!channelListings?.length) {
    return emptyChannelListingValidation();
  }

  const invalidDiscountValueChannels = channelListings
    .filter(channel =>
      validatePrice(
        discountType === DiscountTypeEnum.VALUE_PERCENTAGE
          ? channel.percentageDiscountValue
          : channel.discountValue,
      ),
    )
    .map(channel => channel.id);
  const invalidMinSpentChannels =
    requirementsPicker === RequirementsPicker.ORDER
      ? channelListings
          .filter(channel => validatePrice(channel.minSpent))
          .map(channel => channel.id)
      : [];

  return toChannelListingValidation({
    invalidDiscountValueChannels,
    invalidMinSpentChannels,
  });
}
