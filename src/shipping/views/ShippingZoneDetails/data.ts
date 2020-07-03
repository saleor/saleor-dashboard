import { CreateShippingRateVariables } from "@saleor/shipping/types/CreateShippingRate";
import { UpdateShippingRateVariables } from "@saleor/shipping/types/UpdateShippingRate";
import { ShippingZoneUrlQueryParams } from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";

import { FormData as ShippingZoneRateDialogFormData } from "../../components/ShippingZoneRateDialog";

export function getCreateShippingRateVariables(
  data: ShippingZoneRateDialogFormData,
  params: ShippingZoneUrlQueryParams,
  id: string
): CreateShippingRateVariables {
  return {
    input: {
      maximumOrderPrice:
        params.type === ShippingMethodTypeEnum.PRICE
          ? data.noLimits
            ? null
            : parseFloat(data.maxValue)
          : null,
      maximumOrderWeight:
        params.type === ShippingMethodTypeEnum.WEIGHT
          ? data.noLimits
            ? null
            : parseFloat(data.maxValue)
          : null,

      minimumOrderPrice:
        params.type === ShippingMethodTypeEnum.PRICE
          ? data.noLimits
            ? null
            : parseFloat(data.minValue)
          : null,
      minimumOrderWeight:
        params.type === ShippingMethodTypeEnum.WEIGHT
          ? data.noLimits
            ? null
            : parseFloat(data.minValue)
          : null,
      name: data.name,
      price: data.isFree ? 0 : parseFloat(data.price),
      shippingZone: id,
      type: params.type
    }
  };
}

export function getUpdateShippingRateVariables(
  data: ShippingZoneRateDialogFormData,
  params: ShippingZoneUrlQueryParams,
  id: string
): UpdateShippingRateVariables {
  const isPriceType = data.type === ShippingMethodTypeEnum.PRICE;
  const parsedMinValue = parseFloat(data.minValue);
  const parsedMaxValue = parseFloat(data.maxValue);
  const isPriceSet = !data.noLimits && isPriceType;
  const isWeightSet = !data.noLimits && !isPriceType;
  return {
    id: params.id,
    input: {
      maximumOrderPrice: isPriceSet ? parsedMaxValue : null,
      maximumOrderWeight: isWeightSet ? parsedMaxValue : null,
      minimumOrderPrice: isPriceSet ? parsedMinValue : null,
      minimumOrderWeight: isWeightSet ? parsedMinValue : null,
      name: data.name,
      price: data.isFree ? 0 : parseFloat(data.price),
      shippingZone: id,
      type: data.type
    }
  };
}
