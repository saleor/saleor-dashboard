import { OutputData } from "@editorjs/editorjs";
import { ChannelShippingData } from "@saleor/channels/utils";
import { MetadataFormData } from "@saleor/components/Metadata";
import { ShippingMethodTypeEnum } from "@saleor/graphql";

export interface ShippingZoneRateCommonFormData {
  channelListings: ChannelShippingData[];
  name: string;
  description: OutputData;
  orderValueRestricted: boolean;
  minValue: string;
  maxValue: string;
  minDays: string;
  maxDays: string;
  type: ShippingMethodTypeEnum;
}

export type ShippingZoneRateUpdateFormData = ShippingZoneRateCommonFormData &
  MetadataFormData;
