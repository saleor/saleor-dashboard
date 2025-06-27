import { AttributeDefinition } from "./AttributeDefinition";
import { AttributeTypeDefinition } from "./AttributeTypeDefinition";
import { CollectionChannelDefinition } from "./CollectionChannelDefinition";
import { CollectionPublishedDefinition } from "./CollectionPublishedDefinition";
import { CustomerNumberOfOrdersDefinition } from "./CustomerNumberOfOrdersDefinition";
import { GiftCardDefinition } from "./GiftCardDefinition";
import { MetadataDefinition } from "./MetadataDefinition";
import { ProductTypeConfigurableDefinition } from "./ProductTypeConfigurableDefinition";
import { StaffMemberStatusDefinition } from "./StaffMemberStatusDefinition";
import { StaticBooleanDefinition } from "./StaticBooleanDefinition";
import { StaticDefinition } from "./StaticDefinition";
import { VoucherChannelDefinition } from "./VoucherChannelDefinition";
import { VoucherStatusDefinition } from "./VoucherStatusDefinition";
import { VoucherTimesUsedDefinition } from "./VoucherTimesUsedDefinition";

export const definitions = [
  new AttributeDefinition(),
  new AttributeTypeDefinition(),
  new CollectionChannelDefinition(),
  new CollectionPublishedDefinition(),
  new CustomerNumberOfOrdersDefinition(),
  new GiftCardDefinition(),
  new MetadataDefinition(),
  new ProductTypeConfigurableDefinition(),
  new StaffMemberStatusDefinition(),
  new StaticBooleanDefinition(),
  new StaticDefinition(),
  new VoucherChannelDefinition(),
  new VoucherStatusDefinition(),
  new VoucherTimesUsedDefinition(),
];
