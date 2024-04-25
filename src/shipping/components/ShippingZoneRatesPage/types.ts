import { ChannelShippingData } from "@dashboard/channels/utils";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { ShippingMethodTypeEnum } from "@dashboard/graphql";
import { OutputData } from "@editorjs/editorjs";

export interface ShippingZoneRateCommonFormData {
  channelListings: ChannelShippingData[];
  name: string;
  description: OutputData | null;
  orderValueRestricted: boolean;
  minValue: string;
  maxValue: string;
  minDays: string;
  maxDays: string;
  type: ShippingMethodTypeEnum | null;
  taxClassId: string;
}

export type ShippingZoneRateUpdateFormData = ShippingZoneRateCommonFormData & MetadataFormData;
