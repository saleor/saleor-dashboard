import {
  ChannelSaleFormData,
  SaleDetailsPageFormData
} from "@saleor/discounts/components/SaleDetailsPage";
import { getSaleChannelsVariables } from "@saleor/discounts/handlers";
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
  saleChannelsChoices: ChannelSaleFormData[],
  updateSale: (
    variables: SaleUpdateVariables
  ) => Promise<MutationFetchResult<SaleUpdate>>
) {
  return async (formData: SaleDetailsPageFormData) => {
    const { id } = sale;
    const errors = await Promise.all([
      updateSale({
        id,
        input: {
          endDate: formData.hasEndDate
            ? joinDateTime(formData.endDate, formData.endTime)
            : null,
          name: formData.name,
          startDate: joinDateTime(formData.startDate, formData.startTime),
          type: discountValueTypeEnum(formData.type)
        },
        channelInput: getSaleChannelsVariables(
          id,
          formData,
          saleChannelsChoices.map(channel => channel.id)
        ).input
      }).then(({ data }) => data?.saleUpdate.errors ?? [])
    ]);

    return errors.flat();
  };
}
