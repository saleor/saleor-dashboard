import { FetchResult } from "@apollo/client";
import { FormData } from "@saleor/discounts/components/SaleCreatePage";
import { getSaleChannelsVariables } from "@saleor/discounts/handlers";
import {
  SaleChannelListingUpdateMutation,
  SaleChannelListingUpdateMutationVariables,
  SaleCreateMutation,
  SaleCreateMutationVariables
} from "@saleor/graphql";
import {
  extractMutationErrors,
  getMutationErrors,
  joinDateTime
} from "@saleor/misc";
import { decimal } from "@saleor/misc";
import { DiscountValueTypeEnum, SaleType } from "@saleor/types/globalTypes";

function discountValueTypeEnum(type: SaleType): DiscountValueTypeEnum {
  return type.toString() === DiscountValueTypeEnum.FIXED
    ? DiscountValueTypeEnum.FIXED
    : DiscountValueTypeEnum.PERCENTAGE;
}

export function createHandler(
  createSale: (
    variables: SaleCreateMutationVariables
  ) => Promise<FetchResult<SaleCreateMutation>>,
  updateChannels: (options: {
    variables: SaleChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<SaleChannelListingUpdateMutation>>
) {
  return async (formData: FormData) => {
    const response = await createSale({
      input: {
        endDate: formData.hasEndDate
          ? joinDateTime(formData.endDate, formData.endTime)
          : null,
        name: formData.name,
        startDate: joinDateTime(formData.startDate, formData.startTime),
        type: discountValueTypeEnum(formData.type),
        value: decimal(formData.value)
      }
    });

    const errors = getMutationErrors(response);

    if (errors.length > 0) {
      return { errors };
    }

    const updateChannelsErrors = await extractMutationErrors(
      updateChannels({
        variables: getSaleChannelsVariables(
          response.data.saleCreate.sale.id,
          formData
        )
      })
    );

    if (updateChannelsErrors.length > 0) {
      return { errors: updateChannelsErrors };
    }

    return { id: response.data.saleCreate.sale.id };
  };
}
