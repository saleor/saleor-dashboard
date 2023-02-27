import { ChannelShippingData } from '@dashboard/channels/utils';
import { MetadataFormData } from '@dashboard/components/Metadata';
import { ShippingMethodTypeEnum } from '@dashboard/graphql';
import { OutputData } from '@editorjs/editorjs';

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
  taxClassId: string;
}

export type ShippingZoneRateUpdateFormData = ShippingZoneRateCommonFormData & MetadataFormData;
