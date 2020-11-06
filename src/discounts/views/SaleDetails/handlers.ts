import { ChannelSaleData } from "@saleor/channels/utils";
import { SaleDetailsPageFormData } from "@saleor/discounts/components/SaleDetailsPage";
import { getSaleChannelsVariables } from "@saleor/discounts/handlers";
import {
  SaleChannelListingUpdate,
  SaleChannelListingUpdateVariables
} from "@saleor/discounts/types/SaleChannelListingUpdate";
import { SaleDetails_sale } from "@saleor/discounts/types/SaleDetails";
import {
  SaleUpdate,
  SaleUpdateVariables
} from "@saleor/discounts/types/SaleUpdate";
import { joinDateTime } from "@saleor/misc";
import { DiscountValueTypeEnum, SaleType } from "@saleor/types/globalTypes";
import { MutationFetchResult } from "react-apollo";

function discountValueTypeEnum(type: SaleType): DiscountValueTypeEnum {
  return type.toString() === DiscountValueTypeEnum.FIXED
    ? DiscountValueTypeEnum.FIXED
    : DiscountValueTypeEnum.PERCENTAGE;
}

export function createUpdateHandler(
  sale: SaleDetails_sale,
  saleChannelsChoices: ChannelSaleData[],
  updateSale: (
    variables: SaleUpdateVariables
  ) => Promise<MutationFetchResult<SaleUpdate>>,
  updateChannels: (options: {
    variables: SaleChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<SaleChannelListingUpdate>>
) {
  return (formData: SaleDetailsPageFormData) => {
    const { id } = sale;
    updateSale({
      id,
      input: {
        endDate: formData.hasEndDate
          ? joinDateTime(formData.endDate, formData.endTime)
          : null,
        name: formData.name,
        startDate: joinDateTime(formData.startDate, formData.startTime),
        type: discountValueTypeEnum(formData.type)
      }
    });

    updateChannels({
      variables: getSaleChannelsVariables(id, formData, saleChannelsChoices)
    });
  };
}
