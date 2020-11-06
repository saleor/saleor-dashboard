import { ChannelVoucherData } from "@saleor/channels/utils";
import { VoucherDetailsPageFormData } from "@saleor/discounts/components/VoucherDetailsPage";
import { getChannelsVariables } from "@saleor/discounts/handlers";
import { RequirementsPicker } from "@saleor/discounts/types";
import {
  VoucherChannelListingUpdate,
  VoucherChannelListingUpdateVariables
} from "@saleor/discounts/types/VoucherChannelListingUpdate";
import { VoucherDetails_voucher } from "@saleor/discounts/types/VoucherDetails";
import {
  VoucherUpdate,
  VoucherUpdateVariables
} from "@saleor/discounts/types/VoucherUpdate";
import { joinDateTime } from "@saleor/misc";
import {
  DiscountValueTypeEnum,
  VoucherTypeEnum
} from "@saleor/types/globalTypes";
import { MutationFetchResult } from "react-apollo";

export function createUpdateHandler(
  voucher: VoucherDetails_voucher,
  voucherChannelsChoices: ChannelVoucherData[],
  updateVoucher: (
    variables: VoucherUpdateVariables
  ) => Promise<MutationFetchResult<VoucherUpdate>>,
  updateChannels: (options: {
    variables: VoucherChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<VoucherChannelListingUpdate>>
) {
  return (formData: VoucherDetailsPageFormData) => {
    const { id } = voucher;
    updateVoucher({
      id,
      input: {
        applyOncePerCustomer: formData.applyOncePerCustomer,
        applyOncePerOrder: formData.applyOncePerOrder,
        discountValueType:
          formData.discountType.toString() === "SHIPPING"
            ? DiscountValueTypeEnum.PERCENTAGE
            : formData.discountType,
        endDate: formData.hasEndDate
          ? joinDateTime(formData.endDate, formData.endTime)
          : null,
        minCheckoutItemsQuantity:
          formData.requirementsPicker !== RequirementsPicker.ITEM
            ? 0
            : parseFloat(formData.minCheckoutItemsQuantity),
        startDate: joinDateTime(formData.startDate, formData.startTime),
        type:
          formData.discountType.toString() === "SHIPPING"
            ? VoucherTypeEnum.SHIPPING
            : formData.type,
        usageLimit: formData.hasUsageLimit
          ? parseInt(formData.usageLimit, 10)
          : null
      }
    });

    updateChannels({
      variables: getChannelsVariables(id, formData, voucherChannelsChoices)
    });
  };
}
