import { type ChannelShippingData } from "@dashboard/channels/utils";
import { type ShippingMethodTypeEnum } from "@dashboard/graphql";
import { type OutputData } from "@editorjs/editorjs";

export interface ShippingZoneRateCommonFormData {
  channelListings: ChannelShippingData[];
  name: string;
  description: OutputData | null;
  minValue: string;
  maxValue: string;
  minDays: string;
  maxDays: string;
  type: ShippingMethodTypeEnum | null;
  taxClassId: string;
}

export type ShippingZoneRateUpdateFormData = ShippingZoneRateCommonFormData;
