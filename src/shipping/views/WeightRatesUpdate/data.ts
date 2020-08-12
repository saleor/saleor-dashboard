import { FormData as ShippingZoneRateDialogFormData } from "@saleor/shipping/components/WeightRatesPage";
import { UpdateShippingRateVariables } from "@saleor/shipping/types/UpdateShippingRate";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";

export function getUpdateShippingRateVariables(
  data: ShippingZoneRateDialogFormData,
  id: string,
  shippingZoneId: string
): UpdateShippingRateVariables {
  const parsedMinValue = parseFloat(data.minValue);
  const parsedMaxValue = parseFloat(data.maxValue);

  return {
    id,
    input: {
      maximumOrderWeight: parsedMaxValue,
      minimumOrderWeight: parsedMinValue,
      name: data.name,
      // price: data.isFree ? 0 : parseFloat(data.price),
      shippingZone: shippingZoneId,
      type: ShippingMethodTypeEnum.WEIGHT
    }
  };
}
