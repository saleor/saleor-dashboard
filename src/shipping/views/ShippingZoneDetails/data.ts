import { CreateShippingRateVariables } from "@saleor/shipping/types/CreateShippingRate";
import { ShippingZone_shippingZone_shippingMethods } from "@saleor/shipping/types/ShippingZone";
import { UpdateShippingRateVariables } from "@saleor/shipping/types/UpdateShippingRate";
import { ShippingZoneUrlQueryParams } from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";

import { FormData as ShippingZoneRateDialogFormData } from "../../components/ShippingZoneRateDialog";

function getValue(value: string, hasLimits: boolean): number | null {
  return hasLimits ? null : parseFloat(value);
}

export function getCreateShippingRateVariables(
  data: ShippingZoneRateDialogFormData,
  params: ShippingZoneUrlQueryParams,
  id: string
): CreateShippingRateVariables {
  return {
    input: {
      maximumOrderPrice:
        params.type === ShippingMethodTypeEnum.PRICE
          ? getValue(data.maxValue, data.noLimits)
          : null,
      maximumOrderWeight:
        params.type === ShippingMethodTypeEnum.WEIGHT
          ? getValue(data.maxValue, data.noLimits)
          : null,

      minimumOrderPrice:
        params.type === ShippingMethodTypeEnum.PRICE
          ? getValue(data.minValue, data.noLimits)
          : null,
      minimumOrderWeight:
        params.type === ShippingMethodTypeEnum.WEIGHT
          ? getValue(data.minValue, data.noLimits)
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
  shippingRate: ShippingZone_shippingZone_shippingMethods,
  shippingZoneId: string
): UpdateShippingRateVariables {
  const base: UpdateShippingRateVariables = {
    id: shippingRate.id,
    input: {
      name: data.name,
      price: data.isFree ? 0 : parseFloat(data.price),
      shippingZone: shippingZoneId,
      type: shippingRate.type
    }
  };

  if (shippingRate.type === ShippingMethodTypeEnum.PRICE) {
    return {
      ...base,
      input: {
        ...base.input,
        maximumOrderPrice: getValue(data.maxValue, data.noLimits),
        minimumOrderPrice: getValue(data.minValue, data.noLimits)
      }
    };
  }

  return {
    ...base,
    input: {
      ...base.input,
      maximumOrderWeight: getValue(data.maxValue, data.noLimits),
      minimumOrderWeight: getValue(data.minValue, data.noLimits)
    }
  };
}
