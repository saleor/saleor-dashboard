import {
  ChannelVoucherData,
  validateSalePrice,
  validateVoucherPrice,
} from "@saleor/channels/utils";
import {
  ChannelSaleFormData,
  SaleDetailsPageFormData,
} from "@saleor/discounts/components/SaleDetailsPage";
import { VoucherDetailsPageFormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { DiscountTypeEnum } from "@saleor/discounts/types";
import {
  DiscountErrorCode,
  DiscountErrorFragment,
  SaleType,
  VoucherTypeEnum,
} from "@saleor/graphql";
import { ChangeEvent, FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import { RequireOnlyOne } from "@saleor/misc";
import { arrayDiff } from "@saleor/utils/arrays";

import { getAddedChannelsInputFromFormData } from "./data";

export interface ChannelArgs {
  discountValue: string;
  minSpent: string;
}

export type ChannelInput = RequireOnlyOne<
  ChannelArgs,
  "discountValue" | "minSpent"
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

export function createChannelsChangeHandler(
  channelListings: ChannelVoucherData[],
  updateChannels: (data: ChannelVoucherData[]) => void,
  triggerChange: () => void,
) {
  return (id: string, input: ChannelInput) => {
    const channelIndex = channelListings.findIndex(
      channel => channel.id === id,
    );
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

export function createSaleChannelsChangeHandler(
  channelListings: ChannelSaleFormData[],
  updateChannels: (data: ChannelSaleFormData[]) => void,
  triggerChange: () => void,
  saleType: SaleType,
) {
  return (id: string, passedValue: string) => {
    const channelIndex = channelListings.findIndex(
      channel => channel.id === id,
    );
    const channel = channelListings[channelIndex];
    const { percentageValue, fixedValue } = channel;

    const newPercentage =
      saleType === SaleType.PERCENTAGE ? passedValue : percentageValue;
    const newFixed = saleType === SaleType.FIXED ? passedValue : fixedValue;

    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        fixedValue: newFixed,
        percentageValue: newPercentage,
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

export const getSaleChannelsVariables = (
  id: string,
  formData: SaleDetailsPageFormData,
  prevChannelsIds?: string[],
) => {
  const modifiedIds = formData.channelListings.map(channel => channel.id);

  const idsDiff = arrayDiff(prevChannelsIds, modifiedIds);

  return {
    id,
    input: {
      addChannels:
        formData.channelListings
          ?.map(channel => ({
            channelId: channel.id,
            discountValue:
              formData.type === SaleType.FIXED
                ? channel.fixedValue
                : channel.percentageValue,
          }))
          .filter(channel => !!channel.discountValue) || [],
      removeChannels: idsDiff.removed,
    },
  };
};

export function createSaleUpdateHandler(
  submit: (data: SaleDetailsPageFormData) => SubmitPromise<any[]>,
  setLocalErrors: (errors: DiscountErrorFragment[]) => void,
) {
  return async (formData: SaleDetailsPageFormData) => {
    const { channelListings } = formData;

    const invalidChannelListings = channelListings
      ?.filter(channel => validateSalePrice(formData, channel))
      .map(channel => channel.id);
    const localErrors: DiscountErrorFragment[] = !!invalidChannelListings?.length
      ? [
          {
            __typename: "DiscountError",
            code: DiscountErrorCode.INVALID,
            field: "value",
            channels: invalidChannelListings,
            message: "Invalid discount value",
          },
        ]
      : [];

    setLocalErrors(localErrors);

    if (!!localErrors.length) {
      return localErrors;
    }

    return submit(formData);
  };
}

export function createVoucherUpdateHandler(
  submit: (data: VoucherDetailsPageFormData) => SubmitPromise<any[]>,
  setLocalErrors: (errors: DiscountErrorFragment[]) => void,
) {
  return async (formData: VoucherDetailsPageFormData) => {
    const { channelListings } = formData;

    const invalidChannelListings = channelListings
      ?.filter(channel => validateVoucherPrice(formData, channel))
      .map(channel => channel.id);
    const localErrors: DiscountErrorFragment[] = !!invalidChannelListings?.length
      ? [
          {
            __typename: "DiscountError",
            code: DiscountErrorCode.INVALID,
            field: "discountValue",
            channels: invalidChannelListings,
            message: "Invalid discount value",
          },
        ]
      : [];

    setLocalErrors(localErrors);

    if (!!localErrors.length) {
      return localErrors;
    }

    return submit(formData);
  };
}
